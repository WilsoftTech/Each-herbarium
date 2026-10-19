# EACH Roadmap

Progress dashboard for the **East African Community Herbariums** website. Detailed plan: [docs/roadmap/master-roadmap.md](docs/roadmap/master-roadmap.md). Milestone specifications: [docs/milestones/](docs/milestones/README.md).

## Status

|                            |                                                                |
| -------------------------- | -------------------------------------------------------------- |
| **Current milestone**      | M01 complete (revision 2) — awaiting approval to start M02     |
| **Overall progress**       | 1 of 7 milestones completed                                    |
| **Latest verified commit** | `0de7d2c` — chore(m01): initialize EACH engineering foundation |
| **M01 revision 2**         | Recorded in the commit after `fca40b7` (`feat(m01): …`)        |
| **Outstanding blockers**   | None blocking M02. Open risks below.                           |

## Milestones

Allowed statuses: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `PASS WITH CONDITIONS`, `COMPLETED`. A milestone is `COMPLETED` only when every mandatory exit criterion passes with recorded evidence.

| ID  | Milestone                                   | Status      | Depends on | Spec                                             |
| --- | ------------------------------------------- | ----------- | ---------- | ------------------------------------------------ |
| M01 | Engineering Foundation                      | COMPLETED   | —          | [M01](docs/milestones/M01-foundation.md)         |
| M02 | Premium UI, Animation System & Mega Menus   | NOT STARTED | M01        | [M02](docs/milestones/M02-design-system.md)      |
| M03 | Cinematic Homepage & Public Pages           | NOT STARTED | M02        | [M03](docs/milestones/M03-public-website.md)     |
| M04 | Database, CMS & Editorial Workflows         | NOT STARTED | M03        | [M04](docs/milestones/M04-cms-database.md)       |
| M05 | Forms, Communication & Community Engagement | NOT STARTED | M03, M04   | [M05](docs/milestones/M05-communications.md)     |
| M06 | Performance, SEO, Accessibility & Security  | NOT STARTED | M03–M05    | [M06](docs/milestones/M06-quality-audit.md)      |
| M07 | Staging, Deployment & Release Audit         | NOT STARTED | M06        | [M07](docs/milestones/M07-production-release.md) |

## Exit criteria

Each milestone document lists its own mandatory exit criteria. Every milestone also requires:

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e` pass.
- Documentation matches the code.
- A verified Git commit exists.

## Open risks

| Risk                                                                                                                                                | Impact                                                                                                                              | Owner milestone |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Logo exists only as a 1280×1280 JPEG with a white background (`public/brand/each-logo.jpeg`). No vector or transparent master.                      | Limits header/hero use on dark or photographic backgrounds; colour tokens remain provisional until checked against official values. | M02             |
| `npm audit`: 5 high-severity advisories in `braces`, a dev-only transitive dependency of `eslint-config-next`. The suggested fix downgrades to v14. | Dev tooling only; not shipped to browsers.                                                                                          | M06             |
| shadcn/ui, GSAP and Motion are planned but not installed.                                                                                           | Animation and shadcn conventions are untested until M02 introduces the first consumer.                                              | M02             |
| Admin identity provider not chosen; `/admin` is deny-all.                                                                                           | No admin access until M04.                                                                                                          | M04             |
| CI workflow has not run on GitHub (no remote configured).                                                                                           | CI is verified locally only.                                                                                                        | M07             |
| Globe blue (`#087DB9`) on ivory is 4.20:1 — below AA for body text.                                                                                 | Use for large text or decoration only.                                                                                              | M02             |
