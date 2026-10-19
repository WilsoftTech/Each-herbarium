# M02 — Premium UI, animation system and mega menus

**Status:** PASS WITH CONDITIONS · **Depends on:** M01 (gate re-verified 2026-10-19)

## Goal

A cinematic, premium design system and navigation for EACH, with an interaction quality comparable to leading automotive brand sites. Use original EACH branding, and never copy Mercedes-Benz assets, code or layouts.

## Scope

- Verify brand colours against the authoritative logo; finalise tokens (colour, type scale, spacing, radius, elevation, motion durations and easings).
- Editorial typography (display and text faces) loaded via `next/font`.
- Core primitives: `Button` (including link variant), `SectionHeading`, responsive media (`next/image` wrapper only if it adds real value).
- Layout: site header, footer and page shell.
- Navigation: a single typed navigation config (`src/config/navigation.ts`); animated desktop mega menus; premium full-screen mobile navigation.
- Animation: install `gsap` + `@gsap/react` (and `motion` only if a menu needs it) with the first component that uses them, following [ADR 0003](../decisions/0003-animation-architecture.md).
- shadcn/ui: run `shadcn init` while keeping the EACH tokens ([ADR 0004](../decisions/0004-platform-and-ui-stack.md)). Add only the components in use.
- Brand favicon and logo placement, using the original logo only.
- Revised brief (2026-10-19): cinematic homepage hero with the agreed headline and copy, animation utilities, screenshots at representative widths.

## Out of scope

Full page content (M03), CMS (M04), forms (M05).

## Tasks

- [ ] **BLOCKED (owner):** Obtain a vector (SVG) or transparent PNG master of the logo. Until then the JPEG original is shown unaltered on a white plate.
- [x] Initialise shadcn/ui (`components.json`, `cn()`) and add `Button`; `Container` now uses `cn()`. `components.json` was written by hand so the CLI could not overwrite the EACH tokens ([tech stack](../architecture/tech-stack.md)).
- [x] First GSAP client leaves (`Reveal`, `HeroMotion`, `PageTransition`) per ADR 0003, with `gsap.matchMedia` reduced-motion branches.
- [x] Finalise tokens (colour, type scale, spacing, radius, motion, animations) and record contrast measurements, including worst-case hero text.
- [x] Build primitives (`Button`, `Eyebrow`, `Section`, `SectionHeading`, `Grid`, `MediaCard`, `PhotoCredit`, icons) and add them to the inventory.
- [x] Build the header, mega menus, mobile navigation and footer from the navigation config.
- [x] Cinematic homepage hero and a first section that exercises the system.
- [x] Install `jsdom` and Testing Library for client component tests.
- [x] Component preview route `/design-system` (`robots: noindex, nofollow`; not linked).
- [x] Brand favicon and Apple icon resized from the original logo.
- [x] Interim licensed photography ([ADR 0005](../decisions/0005-interim-photography.md)).

## Acceptance criteria

- [x] Logo is used unaltered; tokens are verified against it (pixel samples in [design-tokens.md](../architecture/design-tokens.md)). The vector master is still outstanding (see Tasks).
- [x] No global animation initialisation; every GSAP use is scoped with `useGSAP` and cleans up on route change. The e2e test navigates away and back (client navigation and history) with no errors, and parallax works again.
- [x] Content is visible with JavaScript disabled and with `reducedMotion: "reduce"` (e2e).
- [x] Mega menus are operable by keyboard: open/close, arrow and Tab movement, Escape, focus return (unit and e2e).
- [x] Mobile navigation traps focus while open, locks scroll and restores focus on close (unit and e2e).
- [x] All motion respects `prefers-reduced-motion` (CSS baseline, GSAP `matchMedia`, `MotionConfig reducedMotion="user"` plus explicit reduced variants).
- [x] No layout or page file is marked `"use client"` (`grep -rln "use client" src/app` returns nothing).
- [x] Unit tests for the navigation config and interactive components; e2e tests for desktop and mobile navigation.
- [x] Typecheck, lint, unit, build and e2e pass.
- [x] Component inventory and tech stack updated.

### Additional criteria from the revised M02 brief

- [x] Transparent header over the hero, solid on scroll, with smooth colour transitions. Full-width animated mega panels with multi-column groups, featured photography, staggered entrances, image reveals, a sliding active indicator and an animated close.
- [x] Hover and explicit click/tap; touch hover ignored; correct `aria-expanded` and `aria-controls`; no hover-only content (the footer sitemap works without JavaScript).
- [x] Distinctive full-screen mobile menu: clip reveal, large serif type, drill-down with Back, nested accordions, touch targets of 48 px or more.
- [x] Full-viewport hero with the agreed headline and copy: dark overlay, masked text reveal, photo settle and parallax, two actions, scroll cue, seamless dark transition. No video, because none is approved.
- [x] No horizontal overflow from 320 to 1920 px; CLS under 0.05; no critical console errors; axe shows no serious or critical violations.
- [x] Screenshots at mobile, tablet and desktop widths ([m02-screenshots](../audits/m02-screenshots/)).
- [x] Lenis evaluated and not adopted ([ADR 0003 notes](../decisions/0003-animation-architecture.md#m02-implementation-notes-2026-10-19)).
- [ ] **NOT VERIFIED:** manual screen-reader pass (no screen reader available in this environment).

## Verification

Full suite (AGENTS.md §5), plus manual keyboard and screen-reader checks recorded in an audit entry.

## Verification record

Run on 2026-10-19 (Windows 11, Node 24.12.0, npm 11.6.2). Details: [M02-verification.md](../audits/M02-verification.md).

| Check         | Command                                         | Result                                          |
| ------------- | ----------------------------------------------- | ----------------------------------------------- |
| Format        | `npm run format:check`                          | Pass                                            |
| Typecheck     | `npm run typecheck`                             | Pass                                            |
| Lint          | `npm run lint`                                  | Pass, no findings                               |
| Unit          | `npm test`                                      | Pass: 7 files, 45 tests                         |
| Build         | `npm run build`                                 | Pass: all routes static                         |
| E2E           | `npm run test:e2e`                              | Pass: 39 passed, 3 skipped (opt-in screenshots) |
| Screenshots   | `SCREENSHOTS=1 npx playwright test screenshots` | Pass: 3 passed, 15 images                       |
| Screen reader | —                                               | NOT VERIFIED                                    |
| GitHub CI     | —                                               | NOT VERIFIED (no remote)                        |

Milestone commit: recorded in the follow-up `docs(m02)` commit.

### Conditions

1. A logo vector or transparent master is still needed from EACH.
2. Photography is openly licensed stand-in material ([ADR 0005](../decisions/0005-interim-photography.md)); replace it with EACH photography when available.
3. Navigation sub-pages return the 404 page (inside the site shell) until M03 builds them. Link labels and descriptions are provisional information architecture for EACH to confirm.
4. A manual screen-reader pass has not been done.

## Risks

Animation bundle weight (GSAP about 44 KB gzipped on animated routes; budgets in M06). Accessibility of complex menus (automated coverage only; no screen-reader pass yet). Logo availability (JPEG only).
