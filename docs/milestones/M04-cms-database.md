# M04 — Database, CMS and editorial workflows

**Status:** NOT STARTED · **Depends on:** M03

## Goal

Let authorised EACH staff manage content securely without code changes.

## Scope

- ADR: CMS approach (custom admin on Prisma + PostgreSQL, or a headless CMS), hosting of the database and media.
- Content models: conservation projects, articles and news, resources, partners, team, media assets, page sections where justified.
- Admin authentication (planned: Clerk) with server-side role checks on every mutation.
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
