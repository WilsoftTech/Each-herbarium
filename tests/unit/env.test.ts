import { describe, expect, it } from "vitest";
import { parseServerEnv } from "@/validation/env";

describe("parseServerEnv", () => {
  it("defaults the site URL to localhost when nothing is configured", () => {
    expect(parseServerEnv({}).siteUrl).toBe("http://localhost:3000");
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
