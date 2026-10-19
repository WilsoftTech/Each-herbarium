# M03 verification

- **Date:** 2026-10-19
- **Environment:** Windows 11 Pro, Node 24.13.0, npm 11.6.2, Git Bash, Playwright Chromium
- **Entry gate (M02):** the clean tree at `8e1f8d9` had no `node_modules`, so `npm ci` ran first (lockfile unchanged). Then format:check, typecheck and lint passed; unit 7 files, 45 tests passed; build passed (all routes static); e2e 39 passed, 3 skipped.

## Results (final run, after all changes)

| Check                     | Command                                                  | Result                                                                                                                                                  |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format                    | `npm run format:check`                                   | Pass. "All matched files use Prettier code style!"                                                                                                      |
| Typecheck                 | `npm run typecheck`                                      | Pass. "Types generated successfully"; `tsc --noEmit` reported no errors                                                                                 |
| Lint                      | `npm run lint`                                           | Pass. No findings                                                                                                                                       |
| Unit                      | `npm test`                                               | Pass. Test Files 10 passed (10); Tests 216 passed (216)                                                                                                 |
| Build                     | `npm run build`                                          | Pass. "Compiled successfully"; 37 static pages; every public route ○ static; the six known slugs prerendered                                            |
| E2E                       | `npm run test:e2e`                                       | Pass. 121 passed, 3 skipped (the opt-in `screenshots.spec.ts`); 3.0 min                                                                                 |
| Screenshots               | `SCREENSHOTS=1 npx playwright test screenshots`          | Pass. 3 passed; 37 JPEGs in [m03-screenshots/](m03-screenshots/)                                                                                        |
| Runtime deps              | `npm audit --omit=dev`                                   | found 0 vulnerabilities                                                                                                                                 |
| All deps                  | `npm audit`                                              | 5 high (dev-only `braces` chain via `eslint-config-next`, unchanged since M01)                                                                          |
| Dependencies              | `git diff --stat HEAD -- package.json package-lock.json` | No changes. M03 added no packages                                                                                                                       |
| Client files in `src/app` | `grep -rln '"use client"' src/app`                       | `(public)/error.tsx` and `global-error.tsx` only. Next.js requires error boundaries to be Client Components; no layout, page or template is client-side |
| GitHub CI                 | —                                                        | NOT VERIFIED (no remote)                                                                                                                                |

The build validates `ensureStatic = "navigation"` on the public layout, so a route that needed request-time rendering would fail `next build`.

## Routes

All 25 approved routes exist and render: 23 static routes plus `/projects/[slug]` and `/resources/[slug]` (three placeholder slugs each). Status codes were checked with `curl` against `next start`: known routes return 200. `/projects/not-a-project`, `/resources/not-a-resource` and `/about/history` return 404 inside the site shell. The route list matches the brief exactly; nothing was renamed.

## What the tests cover

**Unit (Vitest, 216 tests):**

- `pages.test.tsx`: every one of the 29 public paths is rendered from its page module. Checks:
  - exactly one `h1`, no hidden inline styles, and no `main` (the layout owns it);
  - every `img` has an `alt` attribute;
  - title, description (over 30 characters) and canonical URL equal to the route;
  - `robots: noindex` exactly on placeholder-only pages;
  - well-formed JSON-LD.

  Also: the homepage headline, copy and actions are unchanged; all twelve homepage sections appear in order; Organization and WebSite structured data; credits; no raw hex. Content integrity: Bitwiire's independence is stated wherever it is featured, the herbarium page denies that a database exists, the medicinal plants page carries the medical notice, the impact page shows no figures, and placeholders are labelled.

- `content.test.ts`: every media entry satisfies the schema and has a licence README row; projects and resources validate with unique slugs; placeholders carry no location, dates, authors, partners or story; Bitwiire is listed only as an independent partner; every pending key is documented in [awaiting-approval.md](../content/awaiting-approval.md) and shown on the site.
- `navigation.test.ts`: the top-level order; unique ids and hrefs; no link repeated across menus; the header and footer link exactly the approved route list; `isActiveSection` marks exactly one section on each route.
- `structured-data.test.ts`: `<` is escaped; the organisation has only verified fields; breadcrumb positions; `pageMetadata` canonical and `noindex`.
- `program-explorer.test.tsx` (jsdom): links and summaries always present; focus and mouse hover switch the photograph; touch does not; panel images are decorative and the active credit is reachable. Also `PendingContent` labels and screen-reader text.
- `reveal.test.tsx`: adds "animates each element once when reveals are nested". This test failed on the M02 `Reveal` and passes on the fix.
- M02 suites (`button`, `desktop-nav`, `mobile-nav`, `env`) were updated for the new menu labels.

**E2E (Playwright, production build, 121 tests):**

- `routes`: each of the 29 paths returns 200 and has:
  - one visible `h1`, one `main`, the primary and footer navigation, and a breadcrumb on inner pages;
  - a description, a canonical URL, `og:title` and parseable JSON-LD;
  - `noindex` on placeholder pages only;
  - no console errors, page errors or HTTP errors.

  Titles and descriptions are unique across routes. Unknown slugs return 404 in the site shell.

- `links`: every internal link on every route returns 200, and every in-page anchor target exists. External links are well-formed `https` URLs; their reachability is NOT VERIFIED, because it depends on the network. A breadth-first crawl from `/` reaches all 29 paths; `/design-system` stays unlinked.
- `interactions`:
  - the programme explorer follows keyboard focus and mouse hover, and its links navigate;
  - the pinned story panel stays in view and shows chapter 03 at the wetlands chapter;
  - statement words reach full opacity, and photographs drift on scroll;
  - client navigation through links, breadcrumbs and history works without errors;
  - under reduced motion, no `data-reveal` or `data-word` element is below opacity 1 and no parallax element is transformed (`/`, `/herbarium`, `/our-work/plant-conservation`, `/projects`), and the explorer still responds;
  - with JavaScript disabled, every route shows its `h1`, all reveal targets at opacity 1, and the footer sitemap.
- `layout`:
  - no horizontal overflow on all 29 paths and `/design-system` at 320, 390, 768, 1024, 1280, 1440 and 1920 px, at the top and bottom of each page;
  - CLS under 0.05 on `/`, `/herbarium` and `/our-work/plant-conservation`;
  - axe (WCAG 2.0, 2.1 and 2.2 A and AA tags) reports no serious or critical violations on every route at 1440 px, after scrolling so entrances finish, on four routes at 390 px, and on the open mega menu and mobile menu.
- `header`: transparent on all five hero routes, solid with content below it on typographic routes, and the current section is announced ("(current section)").
- M02 suites (`navigation`, `mega-menu`, `mobile-nav`, `motion`, `platform`) were updated to the final routes and still pass.

## Issues found and fixed during verification

| Issue                                                                                                                                           | Fix                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| React hydration error #418 on `/`: `PhotoCredit` (a `<p>`) was nested inside a `<p>` in the explorer and story panels                           | Wrappers changed to `<div>`; dev-mode sweep of all 25 routes shows no nesting or hydration warnings |
| Volunteer and partnership panels stayed invisible: a page `Reveal` and `ActionPanels`' own `Reveal` both ran `gsap.from()` on the same elements | `Reveal` animates only targets whose nearest `[data-reveal-scope]` is itself; regression unit test  |
| A route `loading.tsx` put every page's content in a hidden streamed boundary: invisible without JavaScript (all routes), and CLS on `/`         | `loading.tsx` removed (ADR 0006). Prerendered routes need no loading state                          |
| Unknown slugs returned 200 (Partial Prerender fallback shell streamed before `notFound()`)                                                      | `ensureStatic = "navigation"` on the public layout; unknown slugs now 404                           |
| axe `link-in-text-block` on every page: the footer's Bitwiire link was distinguished by colour only                                             | Underlined at rest                                                                                  |
| Badge screen-reader text lowercased "EACH" to "each"                                                                                            | Label rendered as written                                                                           |
| Placeholder card text overlapped by the decorative fern; fern over the lead text on phones                                                      | Opaque card background; fern shown from `md` up                                                     |
| Partnerships page implied Bitwiire educates the public (unverified)                                                                             | Sentence rewritten without the claim                                                                |

## Manual checks

| Check                                     | Result                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual review                             | Done at full page for the desktop `/`, `/herbarium`, `/our-work/medicinal-plants` and `/projects/placeholder-montane-forest`, and the mobile `/`. Contact sheets of all 18 tablet and desktop viewport captures; mobile viewport `/` and `/bitwiire-herbarium-cafe`. The other evidence images were not opened individually |
| Responsive (mobile, tablet, desktop)      | Pixel 7 at 1×, 820×1180 and 1440×900 in [m03-screenshots/](m03-screenshots/). Desktop full-page images were downscaled to 960 px wide to keep the repository small                                                                                                                                                          |
| Reduced motion                            | Automated (above). Not repeated by hand                                                                                                                                                                                                                                                                                     |
| Error boundary (`error.tsx`)              | **NOT VERIFIED** in a browser. No page throws in production; type-checked and built only                                                                                                                                                                                                                                    |
| Screen reader (NVDA, VoiceOver, TalkBack) | **NOT VERIFIED.** No screen reader was available in this environment                                                                                                                                                                                                                                                        |

## Brand asset and photography

`public/brand/each-logo.jpeg` is unchanged (SHA-256 `e2cef34e…7036187`, the same as M02). Eleven Wikimedia Commons photographs were added under CC BY 4.0, CC BY-SA 4.0 and CC BY-SA 3.0. Their licence metadata was read from the Commons API, and they were only resized and re-encoded (`sharp`). They are recorded in `src/config/media.ts` and [public/images/README.md](../../public/images/README.md), with credits shown wherever they appear.

## Bundle

Initial-load JavaScript was measured in Chromium against `next start`: every script response until network idle, compressed body plus headers, including link prefetches. The result is about 251 KB on `/`, `/herbarium`, `/about` and `/privacy`, and 252 KB on a project page. GSAP loads on every public route because `PageTransition` (in the public template) uses it. Budgets are set in M06.

## Engineering defects outstanding

None known. Content awaiting EACH is tracked separately in [docs/content/awaiting-approval.md](../content/awaiting-approval.md).
