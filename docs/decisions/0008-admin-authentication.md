# 0008. Admin authentication with Better Auth, roles in application code

> Identity hosting and session details superseded by [ADR 0010](0010-neon-managed-backend.md). Current code uses Neon Managed Auth and retains application-owned CMS membership and permissions.

- **Status:** Accepted (provider chosen by EACH on 2026-10-20)
- **Date:** 2026-10-20
- **Milestone:** M04

## Context

ADR 0004 left the admin identity provider open. EACH needs a handful of staff accounts with three roles, no public sign-up, and authorisation enforced on the server for every page and action. Options considered: Better Auth (library, data in our database), Clerk (hosted service), hand-written sessions.

## Decision

**Better Auth 1.7** with email and password, its Prisma adapter and the `nextCookies` plugin. Users, sessions and credentials live in EACH's Neon database.

- **No HTTP auth API.** Better Auth's `/api/auth/*` handler is not mounted. Sign-in, sign-out and password changes are Server Actions that call `auth.api.*` on the server, so the public attack surface is the sign-in form only, and no auth client ships to browsers. Server Actions reject cross-origin requests.
- **No public sign-up** (`disableSignUp`). Administrators create accounts on the Users page (a temporary password is shown once) or with `npm run admin:create`.
- **Roles in our code.** `role` (`admin`, `reviewer`, `editor`) and `active` are user columns that Better Auth never accepts from input (`input: false`); a CHECK constraint restricts the role. The permission matrix is `src/services/permissions.ts`. Better Auth's admin plugin is not used, to avoid its impersonation and role endpoints.
- **`requireAdmin(permission)`** (`src/services/admin-auth.ts`) reads the session from the database on every call (no cookie cache), rejects deactivated users and unknown roles, redirects to sign-in without a session, and returns 404 when the role lacks the permission. Every admin page, Server Action and the media actions call it; actions then `authorize()` specific permissions and return a readable error.
- **Sessions** last eight hours and are not silently extended; cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` on HTTPS. Role changes, deactivation and password resets delete the user's sessions.
- **Brute force.** Sign-in is limited to 5 attempts per email and 20 per IP in 15 minutes, in PostgreSQL (`rate_limits`), so limits hold across serverless instances. Emails and IPs are stored only as SHA-256 fingerprints. Failures get one generic message.
- **Deactivation** blocks new sessions in a Better Auth `session.create.before` hook. The last active administrator cannot be demoted or deactivated, and nobody can change their own role.

## Consequences

- No password reset by email until M05 (Resend); administrators reset passwords from the Users page.
- No multi-factor authentication yet. Better Auth's two-factor plugin is the natural follow-up (M06 security review).
- Temporary passwords are shown on screen once; administrators must pass them on securely.
