import { execFileSync } from "node:child_process";
import { createScriptClient } from "../scripts/script-env";
import { developmentDatabaseUrl, TEST_SCHEMA, testSchemaUrl } from "./test-database";

/**
 * Rebuilds the test schema before the suite: drop it, apply every committed
 * migration from scratch (this is also the migration-integrity check), then
 * run the seed. Only the dedicated test schema is ever dropped.
 */
export default async function setup() {
  const url = developmentDatabaseUrl();
  if (!/^each_test$/.test(TEST_SCHEMA)) throw new Error("Unexpected test schema name.");

  process.env.DATABASE_URL_UNPOOLED = url;
  delete process.env.DATABASE_SCHEMA;
  const admin = createScriptClient();
  try {
    await admin.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${TEST_SCHEMA}" CASCADE`);
    await admin.$executeRawUnsafe(`CREATE SCHEMA "${TEST_SCHEMA}"`);
  } finally {
    await admin.$disconnect();
  }

  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const run = (args: string[], env: Record<string, string>) =>
    execFileSync(npx, args, {
      env: { ...process.env, ...env },
      stdio: "pipe",
      shell: process.platform === "win32",
    });

  // The Prisma CLI reads the schema from the URL; scripts use DATABASE_SCHEMA.
  run(["prisma", "migrate", "deploy"], { DATABASE_URL_UNPOOLED: testSchemaUrl() });
  run(["tsx", "prisma/seed.ts"], { DATABASE_URL_UNPOOLED: url, DATABASE_SCHEMA: TEST_SCHEMA });
}
