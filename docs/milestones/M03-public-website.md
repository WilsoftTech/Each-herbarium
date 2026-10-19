# M03 — Cinematic homepage and public pages

**Status:** PASS WITH CONDITIONS · **Depends on:** M02 (gate re-verified 2026-10-19)

## Goal

Tell the EACH story through a cinematic homepage and a complete set of public pages, built from M02 primitives, against typed content contracts that M04 can connect to the CMS. Never present invented institutional information as fact.

## Scope

Revised brief (2026-10-19):

- **Homepage, twelve sections:** cinematic hero; introduction; programmes; East Africa's plant heritage; featured projects; regional presence; research; community and indigenous knowledge; Bitwiire Herbarium Cafe partnership; volunteer and partnership; latest stories and publications; institutional footer.
- **Routes (agreed list, adopted unchanged):** `/`, `/about`, `/about/mission`, `/about/leadership`, `/about/partners`, `/our-work` and its four programme pages, `/herbarium`, `/research`, `/resources`, `/resources/[slug]`, `/projects`, `/projects/[slug]`, `/impact`, `/get-involved`, `/volunteer`, `/partnerships`, `/bitwiire-herbarium-cafe`, `/contact`, `/privacy`, `/terms`, `/accessibility`.
- **Page-specific compositions:**
  - conservation: immersive heroes, interludes and project stories;
  - herbarium: a specimen aesthetic and line illustrations;
  - medicinal plants: a scientific context and a medical notice;
  - research: publication-led typography;
  - projects: image-led case studies with location facts;
  - About: verified details;
  - Bitwiire: a warm partner surface.
- **Selective interactions:** scroll text reveals, full-width photographic interludes, parallax, one pinned story, staggered lists, image masks, card hovers, interactive programme navigation and page transitions. All of them respect reduced motion.
- **Content integrity:** typed contracts, a single source per type, labelled placeholders, and no invented facts.
- **SEO and accessibility:** metadata on every route, semantic headings, structured data for verified facts, and loading and error states.

## Out of scope

CMS and database (M04). Working forms (M05; pages show a "not available yet" notice). Sitemap, robots file, CSP and performance budgets (M06).

## Tasks

- [x] Navigation rebuilt for the agreed routes (six top-level sections; policy links in the footer); `isActiveSection` for sections that span several prefixes.
- [x] Content contracts and feature modules (`projects`, `resources`, `partners`), plus `src/content/` for programme, ecosystem, specimen and pending-content copy ([ADR 0006](../decisions/0006-content-contracts-and-placeholders.md)).
- [x] Pending-content register, the `PendingContent` marker, and [awaiting-approval.md](../content/awaiting-approval.md).
- [x] New primitives, sections and motion leaves (see the [inventory](../components/inventory.md)); `Hero`, `MediaCard`, `Section`, `Reveal` and `SiteFooter` extended.
- [x] All 25 routes built, with unique metadata, breadcrumbs and structured data.
- [x] Error states (`(public)/error.tsx`, `global-error.tsx`); 404 for unknown slugs.
- [x] Eleven more licensed photographs, recorded in the media registry and `public/images/README.md`.
- [x] Warm partner surface tokens with measured contrast.
- [x] Unit and e2e coverage for routes, links, interactions, reduced motion, no-JavaScript, layout and axe.
- [x] Screenshots at mobile, tablet and desktop ([m03-screenshots](../audits/m03-screenshots/)).
- [ ] **Owner:** supply the content listed in [awaiting-approval.md](../content/awaiting-approval.md).

## Acceptance criteria

- [x] All agreed routes render statically with unique metadata. The build shows every public route as static (○), and `ensureStatic = "navigation"` makes the build enforce it. Uniqueness of titles and descriptions is tested in e2e.
- [x] Sections are reused across pages, with no duplicate section components. Shared sections are listed in the inventory; `MediaCard` was extended rather than copied for project cards.
- [x] Each page has one `h1` and a logical heading order, and every image has meaningful alt text or is marked decorative. Unit tests render every route; axe runs on every route.
- [x] Image licences recorded (`src/config/media.ts`, `public/images/README.md`; unit test).
- [x] Partner wording reviewed: Bitwiire is stated as independent wherever it is featured (unit test). One unverified claim was found and removed.
- [x] E2E: every route loads, and navigation reaches every route. Header and footer links equal the route list (unit test); a crawl from `/` reaches all 29 paths (e2e).
- [x] Full verification suite passes ([M03 verification](../audits/M03-verification.md)).

### Additional criteria from the revised M03 brief

- [x] Homepage with all twelve sections, in order (unit test).
- [x] Interactions are selective, with one pinned section (CSS sticky, no scroll hijacking). Reduced motion leaves nothing hidden or moved, and content is fully visible without JavaScript on every route (e2e).
- [x] No invented staff, affiliations, publications, impact figures, funding partners, facilities or efficacy claims. Placeholders are labelled, not indexed and kept out of structured data. The herbarium page states that no specimen database exists (unit tests).
- [x] Pages are built against typed content contracts behind async queries, with one source per type (ADR 0006).
- [x] Loading and error states: prerendered routes need no loading state (a `loading.tsx` was tried and removed; see ADR 0006). Error boundaries are present. Unknown slugs return 404.
- [x] No broken internal links or anchors on any route (e2e). External link reachability: **NOT VERIFIED** (network-dependent).
- [x] Responsive: no horizontal overflow from 320 to 1920 px on every route; mobile, tablet and desktop screenshots.
- [ ] **NOT VERIFIED:** error boundary behaviour in a browser; manual screen-reader pass.

## Verification

Full suite (AGENTS.md §5) and screenshots (`SCREENSHOTS=1 npx playwright test screenshots`).

## Verification record

Run on 2026-10-19 (Windows 11, Node 24.13.0, npm 11.6.2). Details: [M03-verification.md](../audits/M03-verification.md).

| Check         | Command                                         | Result                                           |
| ------------- | ----------------------------------------------- | ------------------------------------------------ |
| Format        | `npm run format:check`                          | Pass                                             |
| Typecheck     | `npm run typecheck`                             | Pass                                             |
| Lint          | `npm run lint`                                  | Pass, no findings                                |
| Unit          | `npm test`                                      | Pass: 10 files, 216 tests                        |
| Build         | `npm run build`                                 | Pass: all public routes static                   |
| E2E           | `npm run test:e2e`                              | Pass: 121 passed, 3 skipped (opt-in screenshots) |
| Screenshots   | `SCREENSHOTS=1 npx playwright test screenshots` | Pass: 3 passed, 37 images                        |
| Screen reader | —                                               | NOT VERIFIED                                     |
| GitHub CI     | —                                               | NOT VERIFIED (no remote)                         |

Milestone commit: recorded in a follow-up `docs(m03)` commit.

### Conditions

1. **Content awaiting EACH** (not engineering defects): 14 missing items and 8 drafts, listed in [awaiting-approval.md](../content/awaiting-approval.md). All page copy needs EACH's review before launch.
2. Photography is still openly licensed stand-in material ([ADR 0005](../decisions/0005-interim-photography.md)); a logo vector or transparent master is still outstanding.
3. No manual screen-reader pass; error boundary not exercised in a browser.
4. The medicinal plants page needs review by a qualified botanist or ethnobotanist (`medicinalReview`).

## Risks

Content accuracy and approval (all copy is drafted). Photography licensing (CC BY-SA images need visible credits). Page weight: about 251 KB of JavaScript per route, with GSAP on every route through `PageTransition` (budgets in M06).
