import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabaseEnv } from "@/config/env";
import { PrismaClient } from "@/generated/prisma/client";

export type Database = PrismaClient;

function createClient(): PrismaClient {
  const { url, schema } = getDatabaseEnv();
  const adapter = new PrismaPg(
    {
      connectionString: url,
      // Serverless functions each hold a small pool; Neon's pooler multiplexes them.
      max: 5,
      // Raw SQL is not schema-qualified, so the search path must match too.
      ...(schema ? { options: `-c search_path=${schema}` } : {}),
    },
    schema ? { schema } : undefined,
  );
  return new PrismaClient({ adapter });
}

// One client per process. Development hot reloads re-evaluate this module,
// so the instance is kept on globalThis to avoid exhausting connections.
const globalForDb = globalThis as typeof globalThis & { eachDb?: PrismaClient };

/** The Prisma client, created on first use. Server-only. */
export function getDb(): PrismaClient {
  return (globalForDb.eachDb ??= createClient());
}

/**
 * Interactive transaction limits. Generous because each statement is a round
 * trip to Neon; transactions are short (a handful of statements) regardless.
 */
export const transactionOptions = { maxWait: 10_000, timeout: 20_000 } as const;
