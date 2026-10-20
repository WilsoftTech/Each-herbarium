import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/** SHA-256 hex digest; rate-limit keys and audit metadata never store raw emails or IPs. */
export function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

/**
 * The client's IP address. On Vercel the platform sets x-forwarded-for (the
 * first entry is the client). Elsewhere it may be absent; "unknown" then
 * shares one bucket, which errs on the side of limiting.
 */
export async function clientIp(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || list.get("x-real-ip")?.trim() || "unknown";
}
