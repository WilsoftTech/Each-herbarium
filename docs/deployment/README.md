# Deployment

**Status: not configured.** No Vercel project, domain, GitHub remote, database or production environment exists yet. Setup happens in [M07](../milestones/M07-production-release.md). Earlier preview deployments need explicit approval.

## Target platform ([ADR 0004](../decisions/0004-platform-and-ui-stack.md))

| Concern                | Platform                                                        |
| ---------------------- | --------------------------------------------------------------- |
| Hosting, previews, CDN | Vercel (native Next.js 16 support, including Cache Components)  |
| Database               | Neon PostgreSQL. Use a Neon branch per preview where practical. |
| Media                  | Cloudflare R2                                                   |
| Email                  | Resend                                                          |
| CI                     | GitHub Actions (`.github/workflows/ci.yml`)                     |

## Assumptions

- **Build:** Vercel runs `npm ci` and `npm run build` on Node 24 (`engines.node`). No `vercel.json` is needed yet.
- **Environments:** local → Vercel preview (per pull request) → production. Preview uses its own database branch and storage prefix, and never production data.
- **Site URL:** set `SITE_URL` in production once the domain exists. Until then, `src/validation/env.ts` falls back to `VERCEL_PROJECT_PRODUCTION_URL` in production and `VERCEL_URL` for previews.
- **Secrets:** stored in Vercel environment variables, scoped per environment, never in Git. Every variable is documented in `.env.example` and validated at build time.
- **Gate:** CI (format, typecheck, lint, unit, build, e2e) must pass on the commit being promoted.
- **Approval:** production deploys, DNS changes and database migrations require explicit human approval.
- **Rollback:** Vercel instant rollback to the previous deployment. Database migrations must be backward-compatible or have a documented recovery path.
