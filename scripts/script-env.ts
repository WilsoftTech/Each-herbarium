import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { z } from "zod";
import { parseAuthEnv, parseServerEnv, withExplicitSslMode } from "../src/validation/env";

/**
 * Shared setup for command-line scripts (seed, create-admin, media cleanup).
 * They run outside Next.js, so they load .env.local themselves (without
 * overriding variables already set) and create their own Prisma client.
 */
export function loadLocalEnv(): void {
  if (!existsSync(".env.local")) return;
  for (const [key, value] of Object.entries(parseEnv(readFileSync(".env.local", "utf8")))) {
    process.env[key] ??= value;
  }
}

/** Content preparation is explicitly restricted to the local development target. */
export function assertContentReviewDevelopment(): void {
  loadLocalEnv();
  z.literal("dev").parse(process.env.NEON_BRANCH);
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    throw new Error("Content review preparation refuses a production environment.");
  }
}

/** Managed CLI operations must target the same branch as the loaded app env. */
export function managedScriptEnv() {
  loadLocalEnv();
  return {
    ...parseAuthEnv(process.env),
    siteUrl: parseServerEnv(process.env).siteUrl,
    // Passed through Windows' npm launcher; forbid shell metacharacters.
    branch: z
      .string()
      .regex(/^[a-zA-Z0-9][a-zA-Z0-9/_-]{0,100}$/)
      .parse(process.env.NEON_BRANCH),
  };
}

/** A client on the direct connection (scripts are long-running, not serverless). */
export function createScriptClient(): PrismaClient {
  loadLocalEnv();
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set.");
  const schema = process.env.DATABASE_SCHEMA;
  const adapter = new PrismaPg(
    {
      connectionString: withExplicitSslMode(url),
      ...(schema ? { options: `-c search_path=${schema}` } : {}),
    },
    schema ? { schema } : undefined,
  );
  return new PrismaClient({ adapter });
}

/** Host of the target database, for confirmation messages (never the credentials). */
export function databaseHost(): string {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
  try {
    return new URL(url).host;
  } catch {
    return "(unknown)";
  }
}
