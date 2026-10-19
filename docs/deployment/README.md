# Deployment

**Status: not configured.** No hosting, staging, domain, remote repository or production environment exists yet. Deployment is planned for [M07](../milestones/M07-production-release.md).

## Expectations

- **Environments:** local → staging → production. Staging mirrors production configuration.
- **Build:** `npm ci && npm run build`. Run with `npm run start` on Node 24 or a platform-native Next.js runtime.
- **Gate:** CI (typecheck, lint, unit, build, e2e) must pass on the exact commit being deployed.
- **Secrets:** stored in the hosting platform's secret store per environment, never in Git. Every variable is documented in `.env.example`.
- **Approval:** production deploys, DNS changes and database migrations require explicit human approval.
- **Rollback:** every release must be revertible to the previous build. Database migrations must be backward-compatible or have a documented recovery path.
- **Candidates:** Vercel (native Next.js support) or Cloudflare (Workers via OpenNext, plus R2 for media). Decided by ADR in M07.

This document is replaced with the real configuration once M07 delivers it.
