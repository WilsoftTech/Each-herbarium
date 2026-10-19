# EACH Roadmap

Progress dashboard for the **East African Community Herbariums** website. Detailed plan: [docs/roadmap/master-roadmap.md](docs/roadmap/master-roadmap.md). Milestone specifications: [docs/milestones/](docs/milestones/README.md).

## Status

|                            |                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------ |
| **Current milestone**      | M02 complete (PASS WITH CONDITIONS) — awaiting approval to start M03                 |
| **Overall progress**       | 2 of 7 milestones completed                                                          |
| **Latest verified commit** | `07684f9` — feat(m02): premium design system, animated navigation and cinematic hero |
| **Previous milestone**     | M01 `0de7d2c`, revision 2 `68c4aca`                                                  |
| **Outstanding blockers**   | None blocking M03. Conditions and open risks below.                                  |

## Milestones

Allowed statuses: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `PASS WITH CONDITIONS`, `COMPLETED`. A milestone is `COMPLETED` only when every mandatory exit criterion passes with recorded evidence.

| ID  | Milestone                                   | Status               | Depends on | Spec                                             |
| --- | ------------------------------------------- | -------------------- | ---------- | ------------------------------------------------ |
| M01 | Engineering Foundation                      | COMPLETED            | —          | [M01](docs/milestones/M01-foundation.md)         |
| M02 | Premium UI, Animation System & Mega Menus   | PASS WITH CONDITIONS | M01        | [M02](docs/milestones/M02-design-system.md)      |
| M03 | Cinematic Homepage & Public Pages           | NOT STARTED          | M02        | [M03](docs/milestones/M03-public-website.md)     |
| M04 | Database, CMS & Editorial Workflows         | NOT STARTED          | M03        | [M04](docs/milestones/M04-cms-database.md)       |
| M05 | Forms, Communication & Community Engagement | NOT STARTED          | M03, M04   | [M05](docs/milestones/M05-communications.md)     |
| M06 | Performance, SEO, Accessibility & Security  | NOT STARTED          | M03–M05    | [M06](docs/milestones/M06-quality-audit.md)      |
| M07 | Staging, Deployment & Release Audit         | NOT STARTED          | M06        | [M07](docs/milestones/M07-production-release.md) |

## Exit criteria

Each milestone document lists its own mandatory exit criteria. Every milestone also requires:

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e` pass.
- Documentation matches the code.
- A verified Git commit exists.

## Open risks

| Risk                                                                                                                                                | Impact                                                                                            | Owner milestone |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------- |
| Logo exists only as a 1280×1280 JPEG with a white background. No vector or transparent master.                                                      | The logo always sits on a white plate; small sizes are hard to read. Request a master from EACH.  | M03 (owner)     |
| Photography is openly licensed stand-in material from Wikimedia Commons ([ADR 0005](docs/decisions/0005-interim-photography.md)).                   | Credits must stay visible; replace with EACH photography when available.                          | M03             |
| Navigation links to section pages return 404 (inside the site shell) until M03 builds them. Labels are provisional.                                 | Visitors can reach pending pages from the menus; M03 must build every linked route.               | M03             |
| No manual screen-reader pass of the menus yet.                                                                                                      | Automated role, name and axe checks pass, but real assistive-technology behaviour is unconfirmed. | M06             |
| GSAP adds about 44 KB gzipped on animated routes (homepage initial JS about 272 KB gzipped, including the framework).                               | Watch page weight as M03 adds sections; set budgets.                                              | M06             |
| `npm audit`: 5 high-severity advisories in `braces`, a dev-only transitive dependency of `eslint-config-next`. The suggested fix downgrades to v14. | Dev tooling only; not shipped to browsers.                                                        | M06             |
| Admin identity provider not chosen; `/admin` is deny-all.                                                                                           | No admin access until M04.                                                                        | M04             |
| CI workflow has not run on GitHub (no remote configured).                                                                                           | CI is verified locally only.                                                                      | M07             |
| Globe blue (`#087DB9`) on ivory is 4.20:1, below AA for body text.                                                                                  | Use it for large text or decoration only (current components follow this).                        | Ongoing         |
