"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActionError, formData, parseInput, runAction, type ActionState } from "@/features/cms";
import { getAdminSession, requireAdmin, SIGN_IN_PATH } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { getAuth } from "@/services/auth";
import { getDb } from "@/services/db";
import { checkRateLimit, rateLimits } from "@/services/rate-limit";
import { clientIp, fingerprint } from "./request-identity";
import { changePasswordSchema, signInSchema } from "./schema";

const INVALID_CREDENTIALS = "The email address or password is incorrect.";

/**
 * Signs a staff member in. Limited per IP and per email (hashed). Every
 * failure, including a deactivated account, gets the same message so the
 * response does not reveal which accounts exist.
 */
export async function signIn(_state: ActionState, form: FormData): Promise<ActionState> {
  const state = await runAction(async () => {
    const parsed = signInSchema.safeParse({
      email: formData.text(form, "email").toLowerCase(),
      password: typeof form.get("password") === "string" ? form.get("password") : "",
    });
    if (!parsed.success) throw new ActionError("Enter your email address and password.");
    const { email, password } = parsed.data;

    const ip = fingerprint(await clientIp());
    const byIp = await checkRateLimit(rateLimits.signInByIp, ip);
    const byEmail = await checkRateLimit(rateLimits.signInByEmail, fingerprint(email));
    if (!byIp.allowed || !byEmail.allowed) {
      await recordAudit(getDb(), {
        actorId: null,
        action: "auth.rate-limited",
        entityType: "user",
        summary: "Sign-in attempts limited",
        metadata: { email: fingerprint(email), ip },
      });
      const minutes = Math.ceil(Math.max(byIp.retryAfterSeconds, byEmail.retryAfterSeconds) / 60);
      throw new ActionError(
        `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      );
    }

    try {
      await getAuth().api.signInEmail({ body: { email, password }, headers: await headers() });
      const user = await getDb().user.findUniqueOrThrow({ where: { email } });
      await recordAudit(getDb(), {
        actorId: user.id,
        action: "auth.sign-in",
        entityType: "user",
        entityId: user.id,
        summary: "Signed in through Neon Managed Auth",
      });
    } catch (error) {
      if (!(error instanceof APIError)) throw error;
      await recordAudit(getDb(), {
        actorId: null,
        action: "auth.sign-in-failed",
        entityType: "user",
        summary: "Failed sign-in",
        metadata: { email: fingerprint(email), ip },
      });
      throw new ActionError(INVALID_CREDENTIALS);
    }
  });
  if (!state.ok) return state;
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const session = await getAdminSession();
  await getAuth().api.signOut({ headers: await headers() });
  if (session) {
    await recordAudit(getDb(), {
      actorId: session.userId,
      actorEmail: session.email,
      action: "auth.sign-out",
      entityType: "user",
      entityId: session.userId,
      summary: "Signed out",
    });
  }
  redirect(SIGN_IN_PATH);
}

/** Changes the signed-in user's password and ends their other sessions. */
export async function changePassword(_state: ActionState, form: FormData): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    const limit = await checkRateLimit(rateLimits.passwordChange, session.userId);
    if (!limit.allowed) throw new ActionError("Too many attempts. Try again later.");

    const raw = (name: string) =>
      typeof form.get(name) === "string" ? String(form.get(name)) : "";
    const input = parseInput(changePasswordSchema, {
      currentPassword: raw("currentPassword"),
      newPassword: raw("newPassword"),
      confirmPassword: raw("confirmPassword"),
    });

    try {
      await getAuth().api.changePassword({
        body: {
          currentPassword: input.currentPassword,
          newPassword: input.newPassword,
          revokeOtherSessions: true,
        },
        headers: await headers(),
      });
    } catch (error) {
      if (!(error instanceof APIError)) throw error;
      throw new ActionError("Check the highlighted fields.", {
        currentPassword: "Your current password is incorrect.",
      });
    }

    await recordAudit(getDb(), {
      actorId: session.userId,
      actorEmail: session.email,
      action: "auth.password-change",
      entityType: "user",
      entityId: session.userId,
      summary: "Changed own password",
    });
    return { ok: true, message: "Password changed. Your other sessions have been signed out." };
  });
}
