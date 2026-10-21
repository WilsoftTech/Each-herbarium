import "server-only";
import type { EmailEnv } from "@/validation/env";

export type EmailMessage = {
  to: string;
  subject: string;
  /** Plain text only: no HTML is built from submitted values. */
  text: string;
  replyTo?: string;
};

export type EmailResult = { ok: true; id: string } | { ok: false; error: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Sends one email through Resend's HTTP API. Never throws: network errors,
 * timeouts and rejected requests come back as `{ ok: false }` with a short
 * reason for staff, so callers can record the outcome.
 */
export async function sendEmail(config: EmailEnv, message: EmailMessage): Promise<EmailResult> {
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const detail =
        body && typeof body === "object" && "message" in body ? String(body.message) : "";
      return {
        ok: false,
        error: `Email service returned ${response.status}${detail ? `: ${detail}` : ""}`.slice(
          0,
          500,
        ),
      };
    }
    const id = body && typeof body === "object" && "id" in body ? String(body.id) : "";
    return { ok: true, id };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown error";
    return { ok: false, error: `Email service unreachable (${reason})` };
  }
}
