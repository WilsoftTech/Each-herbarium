# EACH Roadmap

Progress dashboard for the **East African Community Herbariums** website. Detailed plan: [docs/roadmap/master-roadmap.md](docs/roadmap/master-roadmap.md). Milestone specifications: [docs/milestones/](docs/milestones/README.md).

## Status

|                            |                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Current milestone**      | M04 in progress; Neon backend setup authorized on 2026-10-20                                                                  |
| **Overall progress**       | 3 of 7 milestones completed                                                                                                   |
| **Latest verified commit** | `dc8578f` — feat(m03): cinematic homepage, public pages and typed content contracts                                           |
| **Previous milestone**     | M02 `07684f9`; M01 `0de7d2c`, revision 2 `68c4aca`                                                                            |
| **Outstanding blockers**   | None blocking M04. Content awaiting EACH is listed in [awaiting-approval.md](docs/content/awaiting-approval.md). Risks below. |

## Milestones

Allowed statuses: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `PASS WITH CONDITIONS`, `COMPLETED`. A milestone is `COMPLETED` only when every mandatory exit criterion passes with recorded evidence.

| ID  | Milestone                                   | Status               | Depends on | Spec                                             |
| --- | ------------------------------------------- | -------------------- | ---------- | ------------------------------------------------ |
| M01 | Engineering Foundation                      | COMPLETED            | —          | [M01](docs/milestones/M01-foundation.md)         |
| M02 | Premium UI, Animation System & Mega Menus   | PASS WITH CONDITIONS | M01        | [M02](docs/milestones/M02-design-system.md)      |
| M03 | Cinematic Homepage & Public Pages           | PASS WITH CONDITIONS | M02        | [M03](docs/milestones/M03-public-website.md)     |
| M04 | Database, CMS & Editorial Workflows         | IN PROGRESS          | M03        | [M04](docs/milestones/M04-cms-database.md)       |
| M05 | Forms, Communication & Community Engagement | NOT STARTED          | M03, M04   | [M05](docs/milestones/M05-communications.md)     |
| M06 | Performance, SEO, Accessibility & Security  | NOT STARTED          | M03–M05    | [M06](docs/milestones/M06-quality-audit.md)      |
| M07 | Staging, Deployment & Release Audit         | NOT STARTED          | M06        | [M07](docs/milestones/M07-production-release.md) |

## Exit criteria

Each milestone document lists its own mandatory exit criteria. Every milestone also requires:

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e` pass.
- Documentation matches the code.
- A verified Git commit exists.

## Open risks

Neon backend: see [ADR 0010](docs/decisions/0010-neon-managed-backend.md). Managed identity and CMS writes are not atomic; legacy self-hosted identities/R2 objects need an explicit migration if present. Production auth email configuration remains pending. AI Gateway is excluded with the owner's approval on the Free plan.

| Risk                                                                                                                                                                       | Impact                                                                                                       | Owner milestone |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------- |
| Institutional content is missing or drafted: 14 missing items and 8 drafts ([awaiting-approval.md](docs/content/awaiting-approval.md)). All page copy needs EACH's review. | Pages show labelled placeholders; the site is not ready to launch as institutional fact.                     | EACH (owner)    |
| The medicinal plants page has had no expert review.                                                                                                                        | Must be reviewed by a qualified botanist or ethnobotanist before launch.                                     | EACH (owner)    |
| Logo exists only as a 1280×1280 JPEG with a white background. No vector or transparent master.                                                                             | The logo always sits on a white plate; small sizes are hard to read. Request a master from EACH.             | EACH (owner)    |
| Photography is openly licensed stand-in material from Wikimedia Commons ([ADR 0005](docs/decisions/0005-interim-photography.md)): 16 images.                               | Credits must stay visible; replace with EACH photography when available.                                     | EACH / M04      |
| No manual screen-reader pass yet. The error boundary has not been exercised in a browser.                                                                                  | Automated role, name and axe checks pass on every route; real assistive-technology behaviour is unconfirmed. | M06             |
| About 251 KB of JavaScript per route (compressed, framework included); GSAP loads on every public route through `PageTransition`.                                          | Set budgets; consider loading GSAP only where scroll effects are present.                                    | M06             |
| No sitemap, robots file or CSP yet.                                                                                                                                        | Planned scope of M06.                                                                                        | M06             |
| `npm audit`: 5 high-severity advisories in `braces`, a dev-only transitive dependency of `eslint-config-next`. The suggested fix downgrades to v14.                        | Dev tooling only; not shipped to browsers.                                                                   | M06             |
| Neon Managed Auth and the production administrator are configured; production auth email configuration remains pending.                                                    | Configure identity emails before launch.                                                                     | M04             |
| CI workflow has not run on GitHub (no remote configured).                                                                                                                  | CI is verified locally only.                                                                                 | M07             |
| Globe blue (`#087DB9`) on ivory is 4.20:1, below AA for body text.                                                                                                         | Use it for large text or decoration only (current components follow this).                                   | Ongoing         |
