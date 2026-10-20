import { describe, expect, it } from "vitest";
import { parseAuthEnv, parseDatabaseEnv, parseServerEnv, parseStorageEnv } from "@/validation/env";

describe("parseServerEnv", () => {
  it("defaults the site URL to localhost when nothing is configured", () => {
    expect(parseServerEnv({}).siteUrl).toBe("http://localhost:3000");
  });

  it("treats empty values from an env file as not set", () => {
    expect(parseServerEnv({ SITE_URL: "", VERCEL_ENV: "" }).siteUrl).toBe("http://localhost:3000");
  });

  it("prefers an explicit SITE_URL and normalises it to an origin", () => {
    const env = parseServerEnv({
      SITE_URL: "https://each.example/some/path/",
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "each.vercel.app",
    });
    expect(env.siteUrl).toBe("https://each.example");
  });

  it("uses the Vercel production domain in production", () => {
    const env = parseServerEnv({
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "each.vercel.app",
      VERCEL_URL: "each-abc123.vercel.app",
    });
    expect(env.siteUrl).toBe("https://each.vercel.app");
  });

  it("uses the deployment URL for Vercel previews", () => {
    const env = parseServerEnv({
      VERCEL_ENV: "preview",
      VERCEL_PROJECT_PRODUCTION_URL: "each.vercel.app",
      VERCEL_URL: "each-abc123.vercel.app",
    });
    expect(env.siteUrl).toBe("https://each-abc123.vercel.app");
  });

  it.each([
    ["a non-URL SITE_URL", { SITE_URL: "not a url" }],
    ["a non-HTTP SITE_URL", { SITE_URL: "ftp://each.example" }],
    ["an unknown VERCEL_ENV", { VERCEL_ENV: "staging" }],
  ])("rejects %s", (_label, source) => {
    expect(() => parseServerEnv(source)).toThrow(/Invalid environment variables/);
  });
});

describe("database, auth and storage environment", () => {
  it("accepts a PostgreSQL URL and an optional schema", () => {
    expect(parseDatabaseEnv({ DATABASE_URL: "postgresql://u:p@host/db?sslmode=require" })).toEqual({
      url: "postgresql://u:p@host/db?sslmode=verify-full",
      schema: undefined,
    });
    expect(
      parseDatabaseEnv({ DATABASE_URL: "postgres://h/db", DATABASE_SCHEMA: "each_test" }).schema,
    ).toBe("each_test");
  });

  it("names verify-full explicitly so pg keeps full TLS verification", () => {
    const url = (sslmode: string) =>
      parseDatabaseEnv({
        DATABASE_URL: `postgresql://u:p@ep-x-pooler.neon.tech/db?sslmode=${sslmode}&channel_binding=require`,
      }).url;
    for (const mode of ["prefer", "require", "verify-ca", "verify-full"]) {
      expect(url(mode)).toBe(
        "postgresql://u:p@ep-x-pooler.neon.tech/db?sslmode=verify-full&channel_binding=require",
      );
    }
    expect(url("disable")).toContain("sslmode=disable");
    expect(parseDatabaseEnv({ DATABASE_URL: "postgres://localhost:5432/each" }).url).toBe(
      "postgres://localhost:5432/each",
    );
  });

  it.each([
    ["a missing DATABASE_URL", {}],
    ["a non-Postgres URL", { DATABASE_URL: "mysql://h/db" }],
    ["an unsafe schema name", { DATABASE_URL: "postgres://h/db", DATABASE_SCHEMA: 'x"; drop' }],
  ])("rejects %s", (_label, source) => {
    expect(() => parseDatabaseEnv(source)).toThrow(/Invalid environment variables/);
  });

  it("requires a long cookie secret and preserves the managed auth URL path", () => {
    expect(() => parseAuthEnv({ NEON_AUTH_COOKIE_SECRET: "short" })).toThrow(/Invalid environment/);
    const secret = "x".repeat(32);
    expect(
      parseAuthEnv({
        NEON_AUTH_COOKIE_SECRET: secret,
        NEON_AUTH_BASE_URL: "https://auth.example/neondb/auth",
      }),
    ).toEqual({
      secret,
      baseUrl: "https://auth.example/neondb/auth",
    });
  });

  it("builds a path-style Neon bucket URL and validates its parts", () => {
    const env = parseStorageEnv({
      AWS_ENDPOINT_URL_S3: "https://storage.example/",
      AWS_ACCESS_KEY_ID: "key",
      AWS_SECRET_ACCESS_KEY: "secret",
      AWS_REGION: "us-east-2",
    });
    expect(env.bucketUrl).toBe("https://storage.example/assets");
    expect(() =>
      parseStorageEnv({
        AWS_ENDPOINT_URL_S3: "http://storage.example",
        AWS_ACCESS_KEY_ID: "k",
        AWS_SECRET_ACCESS_KEY: "s",
        AWS_REGION: "us-east-2",
      }),
    ).toThrow(/Invalid environment/);
  });
});
