import { z } from "zod";

const optionalHost = z.string().trim().min(1).optional();

/** Server environment schema. Add each variable here when code first uses it, and document it in `.env.example`. */
export const serverEnvSchema = z.object({
  SITE_URL: z.url({ protocol: /^https?$/ }).optional(),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  VERCEL_PROJECT_PRODUCTION_URL: optionalHost,
  VERCEL_URL: optionalHost,
});

export type ServerEnv = {
  /** Absolute origin of the site, without a trailing slash. */
  siteUrl: string;
};

type EnvSource = Record<string, string | undefined>;

/** Validates raw environment variables. Throws with a readable message when any are invalid. */
export function parseServerEnv(source: EnvSource): ServerEnv {
  const result = serverEnvSchema.safeParse(source);

  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }

  return { siteUrl: resolveSiteUrl(result.data) };
}

function resolveSiteUrl(env: z.infer<typeof serverEnvSchema>): string {
  if (env.SITE_URL) return new URL(env.SITE_URL).origin;
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
}
