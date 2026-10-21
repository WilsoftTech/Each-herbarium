# M04 CMS verification — 2026-10-21

- **Environment:** Windows 11 Pro, Node 24.13.0, npm 11.6.2, Git Bash, Playwright Chromium.
- **Database for tests:** Neon branch `dev` (endpoint `ep-aged-bar-…`). Unit and integration tests rebuild their own `each_test` schema from every committed migration and the seed (`tests/global-setup.ts`); the build and browser tests use dev's main schema. Production (endpoint `ep-super-poetry-…`) was only queried read-only (`prisma migrate status`).
- **Tree verified:** the M04 closeout tree, committed as `40ae825` (parent `6dc32ca`). Only documentation changed between the final runs and the commit.
- Backend setup and operational probes: [M04 Neon verification](M04-neon-verification.md).

## Scope decision

The owner confirmed on 2026-10-20 that full website integration includes the designed sections that ADR 0012 had left in code. They are now managed in the CMS ([ADR 0013](../decisions/0013-designed-sections-in-the-cms.md)): the sections of all 15 landing pages, the four founding programme pages, and the homepage landscapes and regional presence. The source of every public section is in the [integration matrix](../architecture/cms-integration-matrix.md), including what stays in code by rule and why.

## Development isolation

| Check                                  | Command or method                                                     | Result                                                                                                                        |
| -------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Local env targets dev                  | `NEON_BRANCH` in `.env.local`; host compared without printing secrets | `NEON_BRANCH=dev`; database endpoint `ep-aged-bar-…`, different from production's `ep-super-poetry-…`                         |
| Test guard                             | `tests/test-database.ts`                                              | Refuses `production`/`main` branches and production environments                                                              |
| Test data                              | `tests/global-setup.ts`                                               | Drops and rebuilds only the `each_test` schema                                                                                |
| Browser fixtures                       | `tests/e2e/fixtures/e2e-data.ts`                                      | Staff accounts and `e2e-` projects removed in teardown; after the final run dev had 0 pending revisions and 0 `e2e-` projects |
| No destructive test against production | —                                                                     | None run. Production was read with `migrate status` only                                                                      |

## Migrations

| Check                       | Command                                                                                  | Result                                                                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Destructive-statement guard | `npm run db:check-migrations`                                                            | "Migrations checked: no unapproved destructive statements."                                                                                            |
| New migration               | `20261022090000_designed_page_content`                                                   | Additive: `programmes.content JSONB NOT NULL DEFAULT '{}'` and a CHECK that it is an object                                                            |
| Dev before                  | `npm run db:status`                                                                      | 6 found; `20261022090000_designed_page_content` not yet applied                                                                                        |
| Dev apply                   | `npm run db:migrate`                                                                     | "All migrations have been successfully applied."                                                                                                       |
| Dev after                   | `npm run db:status`                                                                      | "Database schema is up to date!"                                                                                                                       |
| Fresh schema                | test global setup (`prisma migrate deploy` on an empty `each_test` schema, then seed)    | Applied all 6; every test below depends on it                                                                                                          |
| Production (read-only)      | `node --env-file=.env.neon-production node_modules/prisma/build/index.js migrate status` | **4 not applied:** `content_revisions`, `cms_content_fields`, `programme_seo_descriptions`, `designed_page_content`. Not applied: needs owner approval |

### Seed and backfill on dev

`npm run db:seed` fills designed sections that existing rows and pending revisions lack, without replacing any value (`prisma/seed/fill-content.ts`). On dev the first run added sections to 20 rows (homepage, 15 landing pages, 4 programmes) and wrote one audit event, "Filled missing designed sections (20)". The second run filled nothing. The three prose pages correctly keep empty `content`. Running the independent media and page upserts concurrently cut a full seed on dev from 2 min 24 s to 35 s; the seed-idempotency test had exceeded its 180 s limit under parallel test load.

## Results (final run, same tree)

| Check              | Command                                                  | Result                                                                              |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Format             | `npm run format:check`                                   | Pass. "All matched files use Prettier code style!"                                  |
| Typecheck          | `npm run typecheck`                                      | Pass. "Types generated successfully"; `tsc --noEmit` no errors                      |
| Lint               | `npm run lint`                                           | Pass. No findings                                                                   |
| Migrations         | `npm run db:check-migrations`                            | Pass (above)                                                                        |
| Unit + integration | `npm test`                                               | Pass. Test Files 25 passed (25); Tests 463 passed (463); Duration 945.20 s          |
| Build              | `npm run build`                                          | Pass. "Compiled successfully"; 79/79 pages generated; every public route static (○) |
| E2E                | `E2E_PORT=3129 npm run test:e2e`                         | Pass. 142 passed, 3 skipped (opt-in screenshot specs); 7.4 min                      |
| Runtime deps       | `npm audit --omit=dev`                                   | found 0 vulnerabilities                                                             |
| All deps           | `npm audit`                                              | 5 high severity (dev-only `braces` chain, unchanged since M01)                      |
| Dependencies       | `git diff --stat HEAD -- package.json package-lock.json` | No changes                                                                          |
| Env vars           | `.env.example` vs `src/validation/env.ts`                | No variables added; only platform-provided `VERCEL_*` are undocumented, as before   |

The last web-only change (keeping the "Change status" form mounted) does not affect any Vitest test; the build and E2E above ran after it.

## Editorial end-to-end evidence (Playwright, production build, dev data)

| Flow                                                                                                                                                                                                                    | Test (`tests/e2e/admin.spec.ts`)                                                               | Result |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| Editor creates a draft; it returns 404 publicly                                                                                                                                                                         | publish flow › an editor creates a draft that is not public                                    | ok     |
| Editor submits; cannot approve                                                                                                                                                                                          | publish flow › the editor submits it for review but cannot approve it                          | ok     |
| Reviewer previews and approves; detail page 200, listing shows it, **sitemap contains it**                                                                                                                              | publish flow › a reviewer approves…                                                            | ok     |
| Editor edits the **published** item: pending changes stay private; preview shows them; editor cannot approve                                                                                                            | publish flow › an editor's changes to the published project stay private until approved        | ok     |
| Review queue lists the changes; reviewer approves; detail page, browser title and homepage update on the next request (cache expired)                                                                                   | publish flow › the review queue lists the changes…                                             | ok     |
| **Archive:** detail 404, gone from `/projects` and the homepage, **gone from `/sitemap.xml`**                                                                                                                           | publish flow › archiving removes it from the site immediately                                  | ok     |
| Editor changes a **designed section** of `/herbarium`: public page unchanged; preview renders the real page with the change; submit; editor cannot approve; reviewer approves; public page shows it on the next request | designed page sections › an editor's change to a designed section stays private until approved | ok     |
| Restore the approved wording through the same workflow                                                                                                                                                                  | designed page sections › a reviewer restores the approved wording the same way                 | ok     |
| Founding programme editor shows its designed sections; axe passes                                                                                                                                                       | designed page sections › founding programme editors include the designed sections              | ok     |
| Page headline published without redeployment, then restored                                                                                                                                                             | managed page header › a reviewer publishes a new page headline…                                | ok     |
| Settings, page list and homepage editors pass axe                                                                                                                                                                       | managed page header › settings and page editors are accessible                                 | ok     |

Integration tests cover the same rules on the server: landing sections are private until approval and expire the `pages` tag; editors cannot approve; unapproved links and unknown images are reported beside their fields; a post without the sections is refused; founding programme sections are validated, private until approved, expire the `programmes` tag, and their images count as media usage. Unit tests check every declaration against the registry, validate the seeded copy, round-trip every editor form, and confirm every seeded section word renders on its live route.

## Defects found and fixed during verification

- **Confirmation lost after approving or submitting** (web, pre-existing): the result message lived inside a form that unmounts when the action changes what is allowed. Both workflow forms now stay mounted. Transitions also call `refresh()` (`next/cache`), so the editor shows the new state immediately; before, it updated only when the auth SDK happened to rewrite a session cookie.
- **Nested async views** could not render in the unit renderer: landing views now take their records as props from small loaders, as the rest of the codebase does.
- **Stale test expectations from `f70f097`** (never passed): `admin-input` fixtures lacked fields the schemas had gained; the homepage photograph's file name; navigation ordering ties with Home; a page title passed unescaped to `RegExp`.
- **E2E sign-in rate limit:** the suite made 21 sign-ins from one address (limit 20) and 7 as the editor (limit 5). Flows now share one session per role (12 and 4).
- **Interrupted runs left dev data behind:** the e2e fixture now clears pending changes and the suite's own marked values on the two pages it edits. Dev was repaired the same way (one stale revision removed, one test heading restored) before the final run.
- **Seed duration** (above).

## Open conditions

1. **Production database is 4 migrations behind and not seeded with the M04 content.** Applying them (`prisma migrate deploy`, then `npm run db:seed`) is a production change that needs the owner's approval (AGENTS.md §2.6). The current code must not be deployed against production before that.
2. Production auth email configuration and MFA remain pending (ADR 0010).
3. The dev branch expires on 2026-10-26.
4. Content awaiting EACH: [awaiting-approval.md](../content/awaiting-approval.md). Most placeholders can now be resolved in the CMS.

## Closeout re-verification — 2026-10-21

Run on the tree at `0947f86` (after the approved-content and read-latency follow-ups), Windows 11, Node 24.12.0, npm 11.6.2, against the Neon `dev` branch. Before the run, `node_modules` was incomplete (Prisma packages missing); `npm install` restored it from the unchanged lockfile and regenerated the client.

| Check              | Command                                 | Result                                                                                                                                                          |
| ------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format             | `npm run format:check`                  | Pass                                                                                                                                                            |
| Typecheck          | `npm run typecheck`                     | Pass                                                                                                                                                            |
| Lint               | `npm run lint`                          | Pass, no findings                                                                                                                                               |
| Unit + integration | `npm test`                              | Pass: 27 files, 477 tests                                                                                                                                       |
| Build              | `npm run build`                         | Pass: 85/85 static pages generated                                                                                                                              |
| E2E (full)         | `npm run test:e2e`                      | **NOT VERIFIED**: global setup stopped at `neon neon-auth user set-role` ("Authentication timed out after 60 seconds"); the Neon CLI needs an interactive login |
| E2E (public)       | `E2E_PUBLIC_ONLY=1 npx playwright test` | Pass: 124 passed, 3 skipped (opt-in screenshots)                                                                                                                |

The admin e2e flows last passed at `40ae825`. They are re-run after `npx neon auth` on a machine with a browser. Server-side authorisation and editorial rules for the follow-up commits are covered by the integration tests above.

**Closeout verdict:** PASS WITH CONDITIONS. Conditions: production migration and seeding (owner approval), the admin e2e re-run above, and the open conditions listed earlier.
