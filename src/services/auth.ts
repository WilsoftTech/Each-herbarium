import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";
import {
  createAuthServer,
  NEON_AUTH_SESSION_COOKIE_NAME,
  NEON_AUTH_SESSION_DATA_COOKIE_NAME,
} from "@neondatabase/auth/server";
import { APIError } from "better-auth/api";
import { connection } from "next/server";
import { getAuthEnv } from "@/config/env";
import { getDb } from "@/services/db";

/** Translate managed API errors for the existing Server Action error handling. */
export function authResult<T>(result: {
  data: T;
  error: { message?: string } | null;
}): NonNullable<T> {
  if (result.error || result.data == null) {
    throw new APIError("BAD_REQUEST", {
      message: result.error?.message ?? "Authentication failed.",
    });
  }
  return result.data;
}

function createAuth() {
  const { secret, baseUrl } = getAuthEnv();
  const managed = createNeonAuth({ baseUrl, cookies: { secret, sessionDataTtl: 1 } });
  return {
    managed,
    api: {
      async getSession(_options?: { headers: Headers }) {
        if (!_options?.headers.get("cookie")?.includes(`${NEON_AUTH_SESSION_COOKIE_NAME}=`))
          return null;
        await connection();
        // Invalid/revoked sessions can return deletion cookies. RSCs cannot
        // write them; the SDK's read-only context discards those headers.
        // Mutating auth calls below retain the Next adapter's cookie writer.
        const requestHeaders = _options.headers;
        // SDK 0.6 compares its local-cache bypass flag to the string "true",
        // although its public API types the flag as boolean. Exclude the
        // optional cache cookie so revocation always reaches the identity service.
        const identityCookies = (requestHeaders.get("cookie") ?? "")
          .split(";")
          .filter((cookie) => cookie.trim().split("=", 1)[0] !== NEON_AUTH_SESSION_DATA_COOKIE_NAME)
          .join(";");
        const reader = createAuthServer({
          baseUrl,
          cookieSecret: secret,
          sessionDataTtl: 1,
          context: () => ({
            getCookies: () => identityCookies,
            setCookie: () => undefined,
            getHeader: (name) => requestHeaders.get(name),
            getOrigin: () =>
              requestHeaders.get("origin") ||
              requestHeaders.get("referer")?.split("/").slice(0, 3).join("/") ||
              "",
            getFramework: () => "nextjs",
          }),
        });
        const result = await reader.getSession({
          query: { disableCookieCache: true, disableRefresh: true },
        });
        if (result.error) throw new Error("The identity service is unavailable.");
        if (!result.data?.user) return null;
        // Identity is managed; membership, roles and deactivation stay local.
        const user = await getDb().user.findUnique({ where: { id: result.data.user.id } });
        if (!user) return null;
        return { session: result.data.session, user };
      },
      async signInEmail(options: { body: { email: string; password: string }; headers: Headers }) {
        const user = await getDb().user.findUnique({ where: { email: options.body.email } });
        if (!user?.active) throw new APIError("UNAUTHORIZED");
        return authResult(await managed.signIn.email(options.body));
      },
      async signOut(_options?: { headers: Headers }) {
        void _options;
        return authResult(await managed.signOut());
      },
      async changePassword(options: {
        body: { currentPassword: string; newPassword: string; revokeOtherSessions: boolean };
        headers: Headers;
      }) {
        return authResult(await managed.changePassword(options.body));
      },
    },
  };
}

export type Auth = ReturnType<typeof createAuth>;
const globalForAuth = globalThis as typeof globalThis & { eachAuth?: Auth };
export function getAuth(): Auth {
  return (globalForAuth.eachAuth ??= createAuth());
}
