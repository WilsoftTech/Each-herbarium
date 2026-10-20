import { z } from "zod";

/** Treats an empty value (`NAME=` in an env file) as not set. */
function optional<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => (value === "" ? undefined : value), schema.optional());
}

const optionalHost = optional(z.string().trim().min(1));

/** Server environment schema. Add each variable here when code first uses it, and document it in `.env.example`. */
export const serverEnvSchema = z.object({
  SITE_URL: optional(z.url({ protocol: /^https?$/ })),
  VERCEL_ENV: optional(z.enum(["production", "preview", "development"])),
  VERCEL_PROJECT_PRODUCTION_URL: optionalHost,
  VERCEL_URL: optionalHost,
});

export type ServerEnv = {
  /** Absolute origin of the site, without a trailing slash. */
  siteUrl: string;
};

type EnvSource = Record<string, string | undefined>;

function parse<T extends z.ZodType>(schema: T, source: EnvSource): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/** Validates raw environment variables. Throws with a readable message when any are invalid. */
export function parseServerEnv(source: EnvSource): ServerEnv {
  return { siteUrl: resolveSiteUrl(parse(serverEnvSchema, source)) };
}

function resolveSiteUrl(env: z.infer<typeof serverEnvSchema>): string {
  if (env.SITE_URL) return new URL(env.SITE_URL).origin;
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// The groups below are validated on first use, not at import, so code that
// never touches the database, auth or storage (and its tests) needs none of
// their variables.

const postgresUrl = z.url({ protocol: /^postgres(ql)?$/ });
/** A PostgreSQL schema name; used only to isolate the test suite. */
const schemaName = z.string().regex(/^[a-z_][a-z0-9_]{0,62}$/);

export const databaseEnvSchema = z.object({
  /** Pooled connection string used at runtime. */
  DATABASE_URL: postgresUrl,
  DATABASE_SCHEMA: optional(schemaName),
});

export type DatabaseEnv = { url: string; schema: string | undefined };

export function parseDatabaseEnv(source: EnvSource): DatabaseEnv {
  const env = parse(databaseEnvSchema, source);
  return { url: withExplicitSslMode(env.DATABASE_URL), schema: env.DATABASE_SCHEMA };
}

/**
 * node-postgres 8 treats `sslmode=prefer|require|verify-ca` as `verify-full`
 * (certificate and host name checked) and warns that v9 will switch them to
 * weaker libpq semantics. Naming `verify-full` keeps today's behaviour, now
 * and after the upgrade. Neon's certificates are publicly trusted, so no CA
 * file is needed. Other modes (e.g. `disable` for local CI) are untouched.
 */
export function withExplicitSslMode(connectionString: string): string {
  const url = new URL(connectionString);
  const mode = url.searchParams.get("sslmode");
  if (mode === "prefer" || mode === "require" || mode === "verify-ca") {
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}

export const authEnvSchema = z.object({
  /** At least 32 characters; generate with `openssl rand -base64 32`. */
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
  NEON_AUTH_BASE_URL: z.url({ protocol: /^https$/ }),
});

export type AuthEnv = { secret: string; baseUrl: string };

/** Managed identity endpoint and the application cookie signing secret. */
export function parseAuthEnv(source: EnvSource): AuthEnv {
  const env = parse(authEnvSchema, source);
  return {
    secret: env.NEON_AUTH_COOKIE_SECRET,
    baseUrl: env.NEON_AUTH_BASE_URL,
  };
}

export const storageEnvSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_ENDPOINT_URL_S3: z.url({ protocol: /^https$/ }),
  AWS_REGION: z.string().min(1),
});

export type StorageEnv = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  /** Path-style Neon bucket URL without a trailing slash. */
  bucketUrl: string;
};

export function parseStorageEnv(source: EnvSource): StorageEnv {
  const env = parse(storageEnvSchema, source);
  return {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    bucketUrl: `${env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/assets`,
  };
}

export function parseFunctionEnv(source: EnvSource): { url: string } {
  const env = parse(
    z.object({ NEON_FUNCTION_HELLO_BASE_URL: z.url({ protocol: /^https$/ }) }),
    source,
  );
  return { url: env.NEON_FUNCTION_HELLO_BASE_URL };
}
