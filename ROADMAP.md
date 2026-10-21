# EACH Roadmap

Progress dashboard for the **East African Community Herbariums** website. Detailed plan: [docs/roadmap/master-roadmap.md](docs/roadmap/master-roadmap.md). Milestone specifications: [docs/milestones/](docs/milestones/README.md).

## Status

|                            |                                                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Current milestone**      | M05 IN PROGRESS: public enquiry forms built, off by default ([verification](docs/audits/M05-verification.md)). M04 closed PASS WITH CONDITIONS             |
| **Overall progress**       | 4 of 7 milestones passed (M01 completed; M02–M04 pass with conditions)                                                                                     |
| **M04 verified core hash** | `40ae825` — feat(m04): designed page sections in the CMS and verified milestone closeout                                                                   |
| **Previous milestone**     | M03 `dc8578f`; M02 `07684f9`; M01 `0de7d2c`, revision 2 `68c4aca`                                                                                          |
| **Outstanding blockers**   | Production database: 4 migrations and the M04 seed await owner approval. Content awaiting EACH: [awaiting-approval.md](docs/content/awaiting-approval.md). |

## Milestones

Allowed statuses: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `PASS WITH CONDITIONS`, `COMPLETED`. A milestone is `COMPLETED` only when every mandatory exit criterion passes with recorded evidence.

| ID  | Milestone                                   | Status               | Depends on | Spec                                             |
| --- | ------------------------------------------- | -------------------- | ---------- | ------------------------------------------------ |
| M01 | Engineering Foundation                      | COMPLETED            | —          | [M01](docs/milestones/M01-foundation.md)         |
| M02 | Premium UI, Animation System & Mega Menus   | PASS WITH CONDITIONS | M01        | [M02](docs/milestones/M02-design-system.md)      |
| M03 | Cinematic Homepage & Public Pages           | PASS WITH CONDITIONS | M02        | [M03](docs/milestones/M03-public-website.md)     |
| M04 | Database, CMS & Editorial Workflows         | PASS WITH CONDITIONS | M03        | [M04](docs/milestones/M04-cms-database.md)       |
| M05 | Forms, Communication & Community Engagement | IN PROGRESS          | M03, M04   | [M05](docs/milestones/M05-communications.md)     |
| M06 | Performance, SEO, Accessibility & Security  | NOT STARTED          | M03–M05    | [M06](docs/milestones/M06-quality-audit.md)      |
| M07 | Staging, Deployment & Release Audit         | NOT STARTED          | M06        | [M07](docs/milestones/M07-production-release.md) |

## Exit criteria

Each milestone document lists its own mandatory exit criteria. Every milestone also requires:

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e` pass.
- Documentation matches the code.
- A verified Git commit exists.

## Open risks

M04 approved-content implementation (2026-10-21): the owner reports client approval and delegates selection of starter projects. All 22 original keys are reconciled: 18 approved editorial resolutions and four notices covering only EACH/partner contacts, accessibility contact and locations. Three starter projects are published as Planned, with no outcomes, dates, assigned partners or locations invented; three educational website guides are provided with attributed references. [Approved copy](docs/content/CLIENT-CONTENT-REVIEW.md), [current ledger](docs/content/awaiting-approval.md), [implementation and verification](docs/content/CONTENT-APPROVAL-IMPLEMENTATION.md). Production remains untouched; M05–M07 are not started.

Neon backend: see [ADR 0010](docs/decisions/0010-neon-managed-backend.md). Designed sections in the CMS: [ADR 0013](docs/decisions/0013-designed-sections-in-the-cms.md); evidence in the [M04 CMS verification](docs/audits/M04-cms-verification.md). Managed identity and CMS writes are not atomic; legacy self-hosted identities/R2 objects need an explicit migration if present. Production auth email configuration remains pending. AI Gateway is excluded with the owner's approval on the Free plan.

| Risk                                                                                                                                                                                      | Impact                                                                                                                 | Owner milestone |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------- |
| Approved copy is implemented; official contacts (including partner contacts/visiting hours) and locations remain pending ([ledger](docs/content/awaiting-approval.md)).                   | Contact and location notices remain; unverified identities, historical claims and results are omitted.                 | EACH (owner)    |
| Client-approved medicinal education does not establish independent botanical or clinical review.                                                                                          | No efficacy or certification is claimed; qualified review remains a scientific verification requirement.               | EACH (owner)    |
| Logo source is a JPEG; a transparent PNG derivative is available. No vector or official transparent master.                                                                               | Transparent PNG uses a light edge shadow; small sizes retain JPEG limits. Request a master from EACH.                  | EACH (owner)    |
| Approved photography uses openly licensed reference material from Wikimedia Commons ([ADR 0005](docs/decisions/0005-interim-photography.md)): 16 images.                                  | Credits must stay visible; replace with EACH photography when available.                                               | EACH / M04      |
| No manual screen-reader pass yet. The error boundary has not been exercised in a browser.                                                                                                 | Automated role, name and axe checks pass on every route; real assistive-technology behaviour is unconfirmed.           | M06             |
| About 251 KB of JavaScript per route (compressed, framework included); GSAP loads on every public route through `PageTransition`.                                                         | Set budgets; consider loading GSAP only where scroll effects are present.                                              | M06             |
| Sitemap and robots were delivered in M04; CSP and the broader quality audit remain pending.                                                                                               | Planned scope of M06.                                                                                                  | M06             |
| `npm audit`: 5 high-severity advisories in `braces`, a dev-only transitive dependency of `eslint-config-next`. The suggested fix downgrades to v14.                                       | Dev tooling only; not shipped to browsers.                                                                             | M06             |
| Production database is 5 migrations behind (`content_revisions`, `cms_content_fields`, `programme_seo_descriptions`, `designed_page_content`, `public_enquiries`) and lacks the M04 seed. | Current code must not run against production until `prisma migrate deploy` and `npm run db:seed` are approved and run. | Owner / M04     |
| Neon Managed Auth and the production administrator are configured; production auth email configuration remains pending.                                                                   | Configure identity emails before launch.                                                                               | M04             |
| The Neon `dev` branch expires on 2026-10-26 (CLI branch policy).                                                                                                                          | Recreate or extend it before further database or browser tests.                                                        | Owner / M05     |
| Admin e2e flows were not re-run at the M04 closeout: the e2e setup needs an interactive Neon CLI login (`npx neon auth`).                                                                 | Admin UI regressions after `40ae825` are covered only by integration tests until re-run.                               | Owner / M05     |
| Public forms are off until the owner approves privacy-notice wording, sets up Resend (verified domain, staff inbox) and sets a retention period.                                          | Forms cannot be used publicly yet; enquiries have no automatic deletion.                                               | Owner / M05     |
| Long local test runs lose network I/O (`ERR_NETWORK_IO_SUSPENDED`, dropped Neon connections).                                                                                             | M05 suite results are incomplete until re-run on a stable connection.                                                  | Owner / M05     |
| CI workflow has not run on GitHub (no remote configured).                                                                                                                                 | CI is verified locally only.                                                                                           | M07             |
| Globe blue (`#087DB9`) on ivory is 4.20:1, below AA for body text.                                                                                                                        | Use it for large text or decoration only (current components follow this).                                             | Ongoing         |

M04 request-latency follow-up: configured the existing hero image quality, reduced Prisma relation round trips and removed duplicate/sequential page reads. [Decision](docs/decisions/0014-cms-relation-loading.md) and [measurements/verification](docs/audits/M04-request-latency.md). M05–M07 statuses are unchanged.

M04 closeout (2026-10-21): re-verified at `0947f86` and closed PASS WITH CONDITIONS; full e2e not verified because its setup needs an interactive Neon CLI login ([record](docs/audits/M04-cms-verification.md#closeout-re-verification--2026-10-21)). The owner approved starting M05.
