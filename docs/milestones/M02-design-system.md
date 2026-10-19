# M02 — Premium UI, animation system and mega menus

**Status:** NOT STARTED · **Depends on:** M01

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

## Out of scope

Full page content (M03), CMS (M04), forms (M05).

## Tasks

- [ ] Obtain a vector (SVG) or transparent PNG master of the logo. The JPEG original is already in `public/brand/`.
- [ ] Initialise shadcn/ui and add `Button`; replace manual class joining with `cn()`.
- [ ] First GSAP client leaf (for example a section reveal) per ADR 0003, with reduced-motion branches.
- [ ] Finalise tokens and record contrast measurements.
- [ ] Build primitives and add them to the component inventory.
- [ ] Build header, mega menus, mobile navigation and footer from the navigation config.
- [ ] Install `jsdom` and `@testing-library/react` for client component tests.
- [ ] A component preview route, if useful, excluded from production indexing.

## Acceptance criteria

- [ ] Logo is used unaltered; tokens are verified against it.
- [ ] No global animation initialisation; every GSAP use is scoped with `useGSAP` and cleans up on route change (e2e navigates away and back without errors).
- [ ] Content is visible with JavaScript disabled and with `reducedMotion: "reduce"` (e2e).
- [ ] Mega menus are operable by keyboard: open/close, arrow or tab movement, Escape, focus return.
- [ ] Mobile navigation traps focus while open, locks scroll and restores focus on close.
- [ ] All motion respects `prefers-reduced-motion`.
- [ ] No layout or page file is marked `"use client"`.
- [ ] Unit tests for navigation config and interactive components; e2e tests for desktop and mobile navigation.
- [ ] Typecheck, lint, unit, build and e2e pass.
- [ ] Component inventory and tech stack updated.

## Verification

Full suite (AGENTS.md §5), plus manual keyboard and screen-reader checks recorded in an audit entry.

## Risks

Animation bundle weight; accessibility of complex menus; logo availability.
