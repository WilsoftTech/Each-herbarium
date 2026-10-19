# M02 verification

- **Date:** 2026-10-19
- **Environment:** Windows 11 Pro, Node 24.12.0, npm 11.6.2, Git Bash, Playwright Chromium
- **Entry gate:** M01 suite re-run on the clean tree at `9180930` before any change. format:check, typecheck and lint passed; unit 10/10; build passed; e2e 4/4 (exit 0).

## Results (final run, after all changes)

| Check        | Command                                         | Result                                                                                              |
| ------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Format       | `npm run format:check`                          | Pass. "All matched files use Prettier code style!"                                                  |
| Typecheck    | `npm run typecheck`                             | Pass. "Types generated successfully"; `tsc --noEmit` reported no errors                             |
| Lint         | `npm run lint`                                  | Pass. No findings                                                                                   |
| Unit         | `npm test`                                      | Pass. Test Files 7 passed (7); Tests 45 passed (45)                                                 |
| Build        | `npm run build`                                 | Pass. "Compiled successfully"; `/`, `/design-system`, `/admin`, `/_not-found`, icons all static (○) |
| E2E          | `npm run test:e2e`                              | Pass. 39 passed, 3 skipped (the opt-in `screenshots.spec.ts`)                                       |
| Screenshots  | `SCREENSHOTS=1 npx playwright test screenshots` | Pass. 3 passed; 15 JPEGs in [m02-screenshots/](m02-screenshots/)                                    |
| Runtime deps | `npm audit --omit=dev`                          | found 0 vulnerabilities                                                                             |
| All deps     | `npm audit`                                     | 5 high (dev-only `braces` chain via `eslint-config-next`, unchanged since M01)                      |
| GitHub CI    | —                                               | NOT VERIFIED (no remote)                                                                            |

## What the tests cover

**Unit (Vitest):**

- `navigation.test.ts`: the required top-level items in order, unique ids, internal hrefs, a menu on every item except Home, no duplicate links per menu, credited featured images, `isActivePath`, `megaMenuPanelId`.
- `home-page.test.tsx`: one `main`, the headline as the only `h1`, supporting copy, both calls to action, no hidden inline styles in server HTML, hero credit, no raw hex colours.
- `button.test.tsx`: default variant, `asChild` renders a link, class overrides merge.
- `desktop-nav.test.tsx` (jsdom):
  - click open/close/switch, with `aria-expanded` and an `aria-controls` that resolves to the panel;
  - Enter, Tab into the panel, and Escape returning focus;
  - ArrowDown into a menu; Left/Right/Home/End between items;
  - closes on focus leaving, on an outside pointer press and on a route change;
  - hover intent, click-to-pin, hover-leave close; touch hover ignored.
- `mobile-nav.test.tsx` (jsdom): dialog semantics, focus on Close, scroll lock, inert background, Escape restoring focus and scroll, a Tab/Shift+Tab trap, drill-down with Back and focus return, accordions, and close on route change.
- `reveal.test.tsx` (jsdom): under reduced motion no start state is applied; with motion allowed, the start state is applied on the client.

**E2E (Playwright, production build):**

- `navigation`: hero identity; 404 inside the site shell. Route navigation: design system → logo (client) → back/forward → hero parallax live again → menu link to a pending route → home, with no console errors, page errors or unexpected HTTP errors.
- `header`: transparent over the hero, solid on scroll and back again, solid while a menu is open, solid with a spacer on other routes, skip link.
- `mega-menu`:
  - hover opens with featured photography and its credit, moving across switches menus, leaving closes;
  - click pins and an outside click closes;
  - keyboard: Enter, Tab, Escape with focus return; arrows and ArrowDown;
  - visible focus outline; Tab past the last link closes; selecting a link navigates and closes.
- `mobile-nav` (Pixel 7):
  - Menu hidden on desktop; target height of at least 44 px;
  - full-screen dialog, `html` overflow hidden, wheel does not scroll, 15 Tabs stay inside;
  - Escape restores focus and unlocks scroll;
  - drill-down, accordion, Back with focus return;
  - a link navigates and closes; resizing to desktop closes.
- `motion`: under `reducedMotion: "reduce"` the hero words are untransformed, there is no parallax, reveal opacity is 1 and menus work. With motion allowed, cards reveal. With JavaScript disabled, the headline, actions, cards (opacity 1) and footer sitemap are all visible.
- `layout`:
  - no horizontal overflow at 320, 390, 768, 1024, 1280, 1440 and 1920 px on `/`, `/design-system` and a 404 route, top and bottom, and with a mega menu open;
  - CLS under 0.05 after load;
  - axe (WCAG 2.0/2.1/2.2 A and AA tags): no serious or critical violations on `/`, `/design-system`, the open mega menu and the open mobile menu.
- `platform`: security headers and admin denial (from M01, still passing).

**Console errors.** `trackErrors` fails a test on any console error, page error or HTTP ≥ 400, except 404s for section routes listed in `src/config/navigation.ts`. Those are built in M03, and Next.js logs their prefetch requests as failed resources.

## Issues found and fixed during verification

| Issue                                                                                                                                         | Fix                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Hydration error #418 on 404s under navigation paths: the prerendered 404 highlighted no section, but the client highlighted the URL's section | `SiteHeader notFound` disables route highlighting on the 404 page            |
| Hovering another trigger while a menu was pinned kept it pinned, so the next click closed it                                                  | Hover switches count as hover-opened, so a click pins                        |
| Accessible names such as "Backto main menu" and "Research & Learning , open section"                                                          | Spaces moved outside `sr-only` spans; `aria-label` on the drill-down buttons |
| CLS 0.22 when web fonts arrive late (headline rewraps)                                                                                        | Fraunces `display: "optional"`; measured 0.0002 with fonts delayed 1.2 s     |
| Hero eyebrow (light green) at 3.08:1 worst case; mobile eyebrow at 3.18:1                                                                     | Ivory eyebrow; extra 35% shade below `md` (now ≥ 5.6:1)                      |
| Icons outside `Button` rendered at full width                                                                                                 | Default `size-4` on every icon                                               |

## Manual checks

| Check                                     | Result                                                                                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual review of screenshots              | Done for every file in `m02-screenshots/` (desktop 1440×900, tablet 820×1180, mobile Pixel 7 at 1×)                                                                   |
| Keyboard operation                        | Covered by the automated keyboard tests above. Not separately repeated by hand                                                                                        |
| Screen reader (NVDA, VoiceOver, TalkBack) | **NOT VERIFIED.** No screen reader was available in this environment. Accessible names and roles are checked by Testing Library, Playwright role queries and axe only |

## Brand asset

`public/brand/each-logo.jpeg` is unchanged (SHA-256 `e2cef34e…7036187`). `src/app/icon.png` (512 px) and `apple-icon.png` (180 px) were resized from it with `sharp`, with no other changes. The logo is displayed on a white plate, unaltered. A vector or transparent master is still outstanding.

## Bundle

The homepage's initial JS is about 272 KB gzipped, including the framework. The GSAP chunks (about 44 KB gzipped) load on `/` and `/design-system` only, not on the 404 page.
