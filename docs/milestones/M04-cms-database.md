# M04 — Database, CMS and editorial workflows

**Status:** IN PROGRESS · **Depends on:** M03

Neon setup authorized by the owner on 2026-10-20. Current backend choices are recorded in [ADR 0010](../decisions/0010-neon-managed-backend.md): Prisma on Neon, Managed Auth, private Object Storage and a liveness Function. AI Gateway was omitted with approval on the Free plan. Integration tests use the `dev` branch. See the [Neon verification report](../audits/M04-neon-verification.md) for setup, checks and remaining operational risks.

## Goal

Let authorised EACH staff manage content securely without code changes.

## Scope

- Custom admin on Prisma + Neon PostgreSQL, Neon Managed Auth and private Neon Object Storage ([ADR 0010](../decisions/0010-neon-managed-backend.md)).
- Content models: conservation projects, articles and news, resources, partners, team, media assets, page sections where justified.
- Admin authentication: implement `requireAdmin()` (`src/services/admin-auth.ts`) against the chosen provider, with server-side role checks on every page, action and mutation. Add a `(admin)/admin/layout.tsx` shell.
- Draft, review and publish workflow; preview of drafts.
- Migration of M03 static content into the CMS.
- Caching strategy with Cache Components (`"use cache"`, tags, revalidation on publish).

## Out of scope

Public user accounts, researcher accounts, Digital Herbarium specimen database.

## Acceptance criteria

- [ ] Every mutation is authorised on the server; unauthenticated and unauthorised requests are rejected (tested).
- [ ] Inputs are validated on the server.
- [ ] Migrations are reviewed; no destructive migration runs without approval.
- [ ] Publishing revalidates the affected public pages.
- [ ] Secrets only in environment variables; `.env.example` updated.
- [ ] Unit tests for validation and authorisation; e2e for the publish flow.
- [ ] Full verification suite passes.

## Risks

Data loss; authorisation gaps; vendor lock-in; cost.

Managed Auth and CMS writes are not atomic. Production identity email configuration remains pending; existing self-hosted identities and R2 objects require an explicit migration if present. The generated dev branch expires after seven days. SDK timeout warnings and verification details are recorded in the [Neon report](../audits/M04-neon-verification.md).
