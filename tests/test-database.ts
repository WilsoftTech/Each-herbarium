import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";

/**
 * The test suite runs against its own PostgreSQL schema on the development
 * database (the Neon dev branch locally, a service container in CI), so it
 * can reset data freely without touching development content.
 */
export const TEST_SCHEMA = "each_test";

export function loadEnvFile(): void {
  if (!existsSync(".env.local")) return;
  for (const [key, value] of Object.entries(parseEnv(readFileSync(".env.local", "utf8")))) {
    process.env[key] ??= value;
  }
}

/** Direct connection string of the development database. Refuses production. */
export function developmentDatabaseUrl(): string {
  loadEnvFile();
  if (process.env.NEON_BRANCH === "production" || process.env.NEON_BRANCH === "main") {
    throw new Error("Refusing database tests on a production Neon branch. Check out dev first.");
  }
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    throw new Error("Refusing to run database tests in a production environment.");
  }
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Tests need a development database. Set DATABASE_URL_UNPOOLED (and DATABASE_URL) in .env.local; see .env.example.",
    );
  }
  return url;
}

/** The same database, with Prisma's schema parameter pointing at the test schema. */
export function testSchemaUrl(): string {
  const url = new URL(developmentDatabaseUrl());
  url.searchParams.set("schema", TEST_SCHEMA);
  return url.toString();
}
