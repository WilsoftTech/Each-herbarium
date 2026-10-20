import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getAuth } from "@/services/auth";
import { can, roleSchema, type Permission, type Role } from "@/services/permissions";

export type AdminSession = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};

export const SIGN_IN_PATH = "/admin/sign-in";

/**
 * The signed-in, active staff member for this request, or null. Reads the
 * session from the database every time (no cookie cache), so deactivation
 * and role changes apply immediately. Deduplicated per request.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const result = await getAuth().api.getSession({ headers: await headers() });
  if (!result) return null;

  const role = roleSchema.safeParse(result.user.role);
  if (!role.success || result.user.active !== true) return null;

  return {
    userId: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: role.data,
  };
});

/**
 * Authorises an admin page, Server Action or Route Handler. Call it before
 * reading or changing data; layouts are not enough.
 *
 * - No valid session: redirects to the sign-in page.
 * - Signed in without `permission`: responds 404, so the page's existence is
 *   not confirmed to a role that cannot use it.
 *
 * Server Actions that should report a readable error instead call
 * `requireAdmin()` and then `authorize()`.
 */
export async function requireAdmin(permission: Permission = "admin:access"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect(SIGN_IN_PATH);
  if (!can(session.role, permission)) notFound();
  return session;
}

/** Thrown when a signed-in user lacks a permission; actions turn it into a message. */
export class AuthorizationError extends Error {
  constructor(readonly permission: Permission) {
    super("You do not have permission to do that.");
    this.name = "AuthorizationError";
  }
}

/** Throws AuthorizationError unless the session's role grants `permission`. */
export function authorize(session: AdminSession, permission: Permission): void {
  if (!can(session.role, permission)) throw new AuthorizationError(permission);
}
