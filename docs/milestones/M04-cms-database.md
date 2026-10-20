# M04 — Database, CMS and editorial workflows

**Status:** PASS WITH CONDITIONS (production migration awaits owner approval; see the exit gate) · **Depends on:** M03

Neon setup authorized by the owner on 2026-10-20. Backend choices: [ADR 0010](../decisions/0010-neon-managed-backend.md) (Prisma on Neon, Managed Auth, private Object Storage, a liveness Function). Integration tests use the `dev` branch. Setup and operational checks: [Neon verification report](../audits/M04-neon-verification.md). CMS completion and its evidence: [M04 CMS verification report](../audits/M04-cms-verification.md).

## Goal

Let authorised EACH staff manage every applicable piece of public content securely, without code changes, while drafts and unapproved changes stay private.

## Scope

- Custom admin on Prisma + Neon PostgreSQL, Neon Managed Auth and private Neon Object Storage ([ADR 0007](../decisions/0007-cms-editorial-workflow.md), [ADR 0010](../decisions/0010-neon-managed-backend.md)).
- Content models: pages (registry of fixed routes, homepage sections), programmes, projects, articles, resources, partners, team, media, site settings ([ADR 0012](../decisions/0012-cms-page-registry-seo-and-settings.md)).
- Designed sections of every landing page and of the four founding programme pages, edited through typed declarations, not a page builder ([ADR 0013](../decisions/0013-designed-sections-in-the-cms.md)). Scope confirmed by the owner on 2026-10-20: full website integration includes them.
- `requireAdmin()` with server-side role checks on every admin page, action, preview and route handler; CMS membership required in addition to a managed identity.
- Draft → review → published → archived workflow, with pending revisions so unapproved edits to published content never go live ([ADR 0011](../decisions/0011-content-revisions.md)); previews of drafts and pending changes.
- Public routes read only published content; cache tags expire on publish, revision approval, unpublish and archive; sitemap and robots.
- Migration of M03 static content into the CMS (seed and data migrations).

Out of scope: public user accounts, researcher accounts, the Digital Herbarium specimen database, MFA and auth email (operational follow-ups). Kept in code by rule (ADR 0013): the protected brand, integrity statements, notices about website features that do not exist yet, the placeholder register, reference specimens and interface labels.

## Admin routes

| Route                                                                           | Purpose                                                                                                                       | Roles                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `/admin`                                                                        | Dashboard: live figures, quick actions, waiting for review, needs attention, recent audit (administrators), content by status | All                                                         |
| `/admin/reviews`                                                                | Items in review and pending changes to published content                                                                      | All (approval: reviewer, administrator)                     |
| `/admin/pages`, `/admin/pages/[id]`                                             | Homepage sections, landing headers and designed sections, policy text, images, SEO                                            | All (registry-driven editor)                                |
| `/admin/programmes`, `/new`, `/[id]`                                            | Programmes                                                                                                                    | All                                                         |
| `/admin/projects`, `/new`, `/[id]`                                              | Projects                                                                                                                      | All                                                         |
| `/admin/articles`, `/new`, `/[id]`                                              | Articles and publications                                                                                                     | All                                                         |
| `/admin/resources`, `/new`, `/[id]`                                             | Downloadable resources                                                                                                        | All                                                         |
| `/admin/partners`, `/new`, `/[id]`                                              | Partners (independent)                                                                                                        | All                                                         |
| `/admin/team`, `/new`, `/[id]`                                                  | Team members (consent required)                                                                                               | All                                                         |
| `/admin/media`, `/upload`, `/[id]`                                              | Media library                                                                                                                 | Upload: all; metadata and deletion: reviewer, administrator |
| `/admin/preview/{pages,projects,articles}/[id]`                                 | Previews of drafts and pending changes                                                                                        | All                                                         |
| `/admin/settings` and `/contact`, `/branding`, `/navigation`, `/footer`, `/seo` | Site settings                                                                                                                 | Administrator                                               |
| `/admin/users`, `/[id]`                                                         | Staff accounts and roles                                                                                                      | Administrator                                               |
| `/admin/audit`                                                                  | Audit log                                                                                                                     | Administrator                                               |
| `/admin/account`                                                                | Own password                                                                                                                  | All                                                         |

Mapping from the brief's target routes: [integration matrix](../architecture/cms-integration-matrix.md#admin-route-mapping-brief--implemented). Every console route has loading, error and not-found (permission-denied) states.

## Authorisation matrix

Source of truth: `src/services/permissions.ts` (tested in `tests/unit/permissions.test.ts`, enforced in `tests/integration/authorization.test.ts`).

| Permission                                                        | Administrator | Reviewer | Editor |
| ----------------------------------------------------------------- | :-----------: | :------: | :----: |
| Open the admin, view the review queue                             |       ✓       |    ✓     |   ✓    |
| Create content, edit drafts, propose changes to published content |       ✓       |    ✓     |   ✓    |
| Submit drafts and changes for review                              |       ✓       |    ✓     |   ✓    |
| Edit content or changes waiting for review                        |       ✓       |    ✓     |   —    |
| Approve (publish), return, unpublish, archive, restore            |       ✓       |    ✓     |   —    |
| Delete draft or archived content                                  |       ✓       |    —     |   —    |
| Upload media                                                      |       ✓       |    ✓     |   ✓    |
| Edit media metadata, delete unused media                          |       ✓       |    ✓     |   —    |
| Site settings, navigation, footer, branding text, SEO defaults    |       ✓       |    —     |   —    |
| Users and roles; audit log                                        |       ✓       |    —     |   —    |

## Editorial transitions

| Item            | Transition                  | From → to                                                         | Who                                      |
| --------------- | --------------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| Item            | Submit for review           | Draft → In review                                                 | All                                      |
| Item            | Approve and publish         | In review → Published                                             | Reviewer, administrator                  |
| Item            | Return to draft             | In review → Draft                                                 | Reviewer, administrator                  |
| Item            | Unpublish                   | Published → Draft (blocked while changes are pending)             | Reviewer, administrator                  |
| Item            | Archive                     | Draft or Published → Archived (blocked while changes are pending) | Reviewer, administrator                  |
| Item            | Restore                     | Archived → Draft                                                  | Reviewer, administrator                  |
| Item            | Delete                      | Draft or Archived → removed                                       | Administrator                            |
| Pending changes | Save                        | (none) → Draft, or Draft → Draft                                  | All (in review: reviewer, administrator) |
| Pending changes | Submit changes              | Draft → In review                                                 | All                                      |
| Pending changes | Approve and publish changes | In review → applied to the live item                              | Reviewer, administrator                  |
| Pending changes | Return changes              | In review → Draft                                                 | Reviewer, administrator                  |
| Pending changes | Discard                     | Draft (any role) or In review (reviewer, administrator) → removed | as stated                                |

Every transition and save runs in a transaction with an optimistic-lock check and writes an audit event.

## Acceptance criteria

See the [CMS verification report](../audits/M04-cms-verification.md) for the commands and their output.

- [x] Every mutation is authorised on the server; unauthenticated and unauthorised requests are rejected (tested).
- [x] Inputs are validated on the server.
- [x] Migrations are reviewed; no destructive migration runs without approval.
- [x] Publishing revalidates the affected public pages.
- [x] Editing published content never exposes unapproved changes.
- [x] Every applicable public page is connected to its authoritative CMS source (including designed sections, ADR 0013).
- [x] Secrets only in environment variables; `.env.example` updated (no variables added in the closeout).
- [x] Unit tests for validation and authorisation; integration and e2e for the publish and revision flows.
- [x] Full verification suite passes.
- [ ] **BLOCKED (owner approval):** production database migrated and seeded. Read-only check on 2026-10-21: 4 of 6 migrations not applied.

## Verification record

Run on 2026-10-21 (Windows 11, Node 24.13.0, npm 11.6.2) against the Neon `dev` branch. Details: [M04 CMS verification](../audits/M04-cms-verification.md).

| Check              | Command                             | Result                                             |
| ------------------ | ----------------------------------- | -------------------------------------------------- |
| Format             | `npm run format:check`              | Pass                                               |
| Typecheck          | `npm run typecheck`                 | Pass                                               |
| Lint               | `npm run lint`                      | Pass, no findings                                  |
| Migrations         | `npm run db:check-migrations`       | Pass; dev up to date                               |
| Unit + integration | `npm test`                          | Pass: 25 files, 463 tests                          |
| Build              | `npm run build`                     | Pass: 79/79 pages, public routes static            |
| E2E                | `npm run test:e2e`                  | Pass: 142 passed, 3 skipped (opt-in screenshots)   |
| Production         | `prisma migrate status` (read-only) | 4 migrations pending; not applied (needs approval) |
| Milestone commit   | `git log`                           | `40ae825`                                          |

## Risks

Data loss; authorisation gaps; vendor lock-in; cost. Managed Auth and CMS writes are not atomic. Production auth email configuration remains pending; self-hosted identities and R2 objects need an explicit migration if present. The dev branch expires after seven days (2026-10-26). Remaining risks are listed in the verification report and `ROADMAP.md`.
