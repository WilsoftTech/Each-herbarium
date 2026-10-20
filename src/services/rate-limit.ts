import "server-only";
import { getDb } from "@/services/db";

export type RateLimitRule = {
  /** Stable name of the protected operation, e.g. "sign-in:ip". */
  name: string;
  /** Maximum attempts per window. */
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * Fixed-window limiter stored in PostgreSQL, so limits hold across serverless
 * instances. One atomic upsert per check: the counter resets when the window
 * has passed, otherwise it increments.
 *
 * `subject` identifies who is limited (an IP address, user id or email). It is
 * stored in the key, so pass identifiers, never secrets.
 */
export async function checkRateLimit(
  rule: RateLimitRule,
  subject: string,
  now: number = Date.now(),
): Promise<RateLimitResult> {
  const key = `app:${rule.name}:${subject}`.slice(0, 255);
  const windowMs = rule.windowSeconds * 1000;
  const windowStart = now - windowMs;

  const rows = await getDb().$queryRaw<{ count: number; last_request: bigint }[]>`
    INSERT INTO "rate_limits" ("id", "key", "count", "last_request")
    VALUES (gen_random_uuid()::text, ${key}, 1, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "rate_limits"."last_request" <= ${windowStart} THEN 1 ELSE "rate_limits"."count" + 1 END,
      "last_request" = CASE WHEN "rate_limits"."last_request" <= ${windowStart} THEN ${now} ELSE "rate_limits"."last_request" END
    RETURNING "count", "last_request"`;

  const row = rows[0];
  if (!row) return { allowed: true, retryAfterSeconds: 0 };

  const resetAt = Number(row.last_request) + windowMs;
  return {
    allowed: row.count <= rule.limit,
    retryAfterSeconds: Math.max(0, Math.ceil((resetAt - now) / 1000)),
  };
}

/** Limits used by the admin area. Generous for real use, tight enough to stop guessing. */
export const rateLimits = {
  signInByIp: { name: "sign-in:ip", limit: 20, windowSeconds: 15 * 60 },
  signInByEmail: { name: "sign-in:email", limit: 5, windowSeconds: 15 * 60 },
  upload: { name: "media:upload", limit: 30, windowSeconds: 10 * 60 },
  passwordChange: { name: "password:change", limit: 5, windowSeconds: 15 * 60 },
  userManagement: { name: "users:manage", limit: 30, windowSeconds: 10 * 60 },
} as const satisfies Record<string, RateLimitRule>;
