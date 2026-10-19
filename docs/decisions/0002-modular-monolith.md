# 0002. Modular monolith, route groups and environment validation

- **Status:** Accepted
- **Date:** 2026-10-19
- **Milestone:** M01 (revision 2)

## Context

EACH will grow from a marketing site into a site with content management, forms and an admin area. The team is small and deploys to a single platform, and the brief rules out microservices.

## Decision

1. **One deployable Next.js app, organised as a modular monolith.** Business capabilities live in `src/features/<feature>/` and expose a public `index.ts`. Shared layers (`components`, `services`, `validation`, `config`, `lib`) never import from features. See [src/features/README.md](../../src/features/README.md).
2. **Route groups.** `src/app/(public)/` holds the public site. `src/app/(admin)/admin/` holds the admin area. The root `layout.tsx` and `not-found.tsx` stay at `src/app/`. Each group can get its own layout later without affecting URLs.
3. **Admin authorisation is enforced on the server, close to the data.** Every admin page, Server Action and Route Handler calls `requireAdmin()` from `src/services/admin-auth.ts` (`server-only`). Layout checks are not relied on, following the Next.js authentication guide. Until an identity provider is chosen (M04 ADR), `requireAdmin()` denies every request with a 404, so the area's existence is not revealed. Admin pages set no title and are `noindex`.
4. **Services** (`src/services/`) are server-only adapters for infrastructure: auth now; database, storage and email later.
5. **Environment validation.** `src/validation/env.ts` holds a Zod schema and a pure `parseServerEnv()`, which is unit-tested. `src/config/env.ts` (`server-only`) validates `process.env` once at module load, so invalid configuration fails the build. Only `SITE_URL` (optional, with Vercel fallbacks) exists today.
6. **Baseline security headers** are set in `next.config.ts`: `nosniff`, `strict-origin-when-cross-origin`, frame denial and a restrictive `Permissions-Policy`. `X-Powered-By` is disabled. A CSP follows in M06.

## Consequences

- Clear seams for future extraction, without the cost of distributed systems.
- `zod` and `server-only` become runtime dependencies now, since both are used.
- Developers must remember to call `requireAdmin()` in every admin entry point. M04 adds tests for each one.
