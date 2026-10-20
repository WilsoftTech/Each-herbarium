import { parseEnv } from "@neon/env";
import { AwsClient } from "aws4fetch";
import { z } from "zod";
import config from "../neon";
import { createScriptClient, loadLocalEnv } from "./script-env";

/** Read-only service probes. For user-facing flows, run the browser suite on dev. */
loadLocalEnv();
const env = parseEnv(config);
const db = createScriptClient();
const requestOptions = () => ({ signal: AbortSignal.timeout(15_000), redirect: "error" as const });

async function main() {
  console.log(`Neon branch: ${env.branch?.name ?? "unspecified"}`);
  const results = await Promise.allSettled([
    (async () => {
      const rows = await db.$queryRaw<{ value: number }[]>`SELECT 1 AS value`;
      if (rows[0]?.value !== 1) throw new Error("Database probe returned an unexpected value.");
      console.log("Postgres: SELECT 1 = 1");
    })(),
    (async () => {
      const url = `${env.auth.baseUrl.replace(/\/$/, "")}/get-session`;
      const response = await fetch(url, requestOptions());
      if (!response.ok) throw new Error(`Auth probe returned HTTP ${response.status}.`);
      const session: unknown = await response.json();
      if (
        session !== null &&
        !z.object({ user: z.null(), session: z.null() }).safeParse(session).success
      ) {
        throw new Error("Anonymous Auth probe returned an unexpected session.");
      }
      console.log("Managed Auth: HTTP 200 (anonymous session)");
    })(),
    (async () => {
      const client = new AwsClient({ ...env.storage, service: "s3" });
      const url = new URL(`${env.storage.endpoint.replace(/\/$/, "")}/assets`);
      url.searchParams.set("list-type", "2");
      url.searchParams.set("max-keys", "1");
      const response = await client.fetch(url.toString(), requestOptions());
      if (!response.ok) throw new Error(`Storage probe returned HTTP ${response.status}.`);
      await response.arrayBuffer();
      console.log("Object Storage: HTTP 200 (private assets bucket)");
    })(),
    (async () => {
      const functionUrl = env.functions?.hello.baseUrl;
      if (!functionUrl) throw new Error("Function environment is missing.");
      const response = await fetch(functionUrl, requestOptions());
      if (!response.ok) throw new Error(`Function probe returned HTTP ${response.status}.`);
      z.object({ ok: z.literal(true), service: z.literal("each-backend") }).parse(
        await response.json(),
      );
      console.log("Functions: HTTP 200 (each-backend)");
    })(),
  ]);
  const failed = results.filter((result) => result.status === "rejected");
  for (const result of failed) console.error("Neon probe failed:", result.reason);
  if (failed.length) process.exitCode = 1;
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
