import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabaseEnv } from "@/config/env";
import { PrismaClient, type Prisma } from "@/generated/prisma/client";

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

class Rollback<T> extends Error {
  constructor(readonly value: T) {
    super("rollback");
  }
}

/**
 * Runs `body` in a transaction that is always rolled back, and returns its
 * result. Used to see what a pending revision would look like (preview,
 * editor, validation) through the same queries and mapping the public pages
 * use, without the change ever being committed or visible to other sessions.
 */
export async function withRollback<T>(
  db: PrismaClient,
  body: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  try {
    await db.$transaction(async (tx) => {
      throw new Rollback(await body(tx));
    }, transactionOptions);
  } catch (error) {
    if (error instanceof Rollback) return error.value as T;
    throw error;
  }
  throw new Error("withRollback: transaction committed unexpectedly");
}
