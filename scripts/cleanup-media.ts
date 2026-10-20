import { parseArgs } from "node:util";
import { AwsClient } from "aws4fetch";
import { parseStorageEnv } from "../src/validation/env";
import { createScriptClient, databaseHost, loadLocalEnv } from "./script-env";

/**
 * Orphaned-object cleanup for the Neon media bucket (ADR 0007).
 *
 * Finds (1) PENDING media rows older than a day, whose upload never finished,
 * and (2) objects under media/ with no database row (for example when deleting
 * an object failed after its row was removed). Dry run by default; pass
 * --apply to delete. READY rows and objects younger than a day are never touched.
 *
 *   npm run media:cleanup            # report only
 *   npm run media:cleanup -- --apply # delete what the report lists
 */
const { values } = parseArgs({ options: { apply: { type: "boolean", default: false } } });
const GRACE_MS = 24 * 60 * 60 * 1000;

loadLocalEnv();
const storage = parseStorageEnv(process.env);
const client = new AwsClient({
  accessKeyId: storage.accessKeyId,
  secretAccessKey: storage.secretAccessKey,
  service: "s3",
  region: storage.region,
});
const db = createScriptClient();
const objectUrl = (key: string) =>
  `${storage.bucketUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;

async function listKeys(): Promise<{ key: string; lastModified: Date }[]> {
  const found: { key: string; lastModified: Date }[] = [];
  let token: string | undefined;
  do {
    const url = new URL(storage.bucketUrl);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("prefix", "media/");
    if (token) url.searchParams.set("continuation-token", token);
    const response = await client.fetch(url.toString());
    if (!response.ok) throw new Error(`Listing failed: ${response.status}`);
    const xml = await response.text();
    for (const entry of xml.match(/<Contents>[\s\S]*?<\/Contents>/g) ?? []) {
      const key = /<Key>([\s\S]*?)<\/Key>/.exec(entry)?.[1];
      const modified = /<LastModified>([\s\S]*?)<\/LastModified>/.exec(entry)?.[1];
      if (key) found.push({ key, lastModified: new Date(modified ?? 0) });
    }
    token = /<IsTruncated>true<\/IsTruncated>/.test(xml)
      ? /<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/.exec(xml)?.[1]
      : undefined;
  } while (token);
  return found;
}

async function main() {
  const cutoff = new Date(Date.now() - GRACE_MS);
  console.log(
    `Database: ${databaseHost()} · Mode: ${values.apply ? "APPLY (deleting)" : "dry run"}`,
  );

  const stalePending = await db.mediaAsset.findMany({
    where: { storage: "NEON", status: "PENDING", createdAt: { lt: cutoff } },
    select: { id: true, key: true },
  });

  const objects = await listKeys();
  const known = new Set(
    (await db.mediaAsset.findMany({ where: { storage: "NEON" }, select: { key: true } })).map(
      (row) => row.key,
    ),
  );
  const orphans = objects.filter(
    (object) => !known.has(object.key) && object.lastModified < cutoff,
  );

  console.log(`Unfinished uploads older than a day: ${stalePending.length}`);
  stalePending.forEach((row) => console.log(`  row ${row.id} ${row.key}`));
  console.log(`Objects without a database row: ${orphans.length}`);
  orphans.forEach((object) => console.log(`  ${object.key}`));

  if (!values.apply) return;

  for (const row of stalePending) {
    await client.fetch(objectUrl(row.key), { method: "DELETE" });
    await db.mediaAsset.delete({ where: { id: row.id } });
  }
  for (const object of orphans) {
    await client.fetch(objectUrl(object.key), { method: "DELETE" });
  }
  await db.auditEvent.create({
    data: {
      action: "media.cleanup",
      entityType: "media",
      summary: `Removed ${stalePending.length} unfinished uploads and ${orphans.length} orphaned objects`,
    },
  });
  console.log("Done.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
