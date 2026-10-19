# 0003. Animation architecture and reduced motion

- **Status:** Accepted (libraries installed in M02; implementation notes below)
- **Date:** 2026-10-19
- **Milestone:** M01 (revision 2)

## Context

The site needs cinematic scroll storytelling and animated mega menus. Badly integrated animation causes hydration mismatches, leaked ScrollTriggers after client navigation, content that stays invisible without JavaScript, large bundles and motion sickness.

## Decision

**Libraries and roles.**

- **GSAP + ScrollTrigger**, via `@gsap/react`'s `useGSAP`: scroll-driven storytelling, pinned sections and multi-step timelines.
- **Motion for React**: only where it is clearly simpler, such as presence and exit animations or layout transitions in menus. Use `LazyMotion` with `domAnimation` and the `m` component to limit bundle size.
- **CSS transitions** with the `ease-cinematic` and `ease-standard` tokens and the `--motion-duration-*` variables: hover and focus states and simple reveals. This is the default whenever it suffices.

None of these is installed in M01. GSAP, `@gsap/react` and Motion are installed in M02 with the first component that uses them.

**Rules.**

1. **No global initialisation.** There is no animation provider in the root layout and no `gsap.registerPlugin` in shared entry files. Register plugins inside the client module that uses them.
2. **Client leaves only.** Animated components are small `"use client"` components that wrap server-rendered content passed as `children`. Pages and layouts stay Server Components.
3. **Scoped, self-cleaning GSAP.** Always use `useGSAP(() => { … }, { scope: ref })`. Never call `gsap.to` in render or in a bare `useEffect`. Event-driven animations use `contextSafe`. `useGSAP` reverts tweens and ScrollTriggers on unmount, which prevents leaks across route changes.
4. **No hydration mismatch, no invisible content.** The server renders the final, visible state. Initial "from" states are applied on the client inside `useGSAP` (`gsap.from` / `fromTo`), never through server-rendered inline styles or classes that hide content. Content stays readable without JavaScript.
5. **Reduced motion everywhere.**
   - CSS: a global `prefers-reduced-motion: reduce` rule in `globals.css` collapses transitions and animations (in place since M01).
   - GSAP: build timelines inside `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`. The reduced branch shows the final state or a simple opacity fade.
   - Motion: wrap animated subtrees in `MotionConfig reducedMotion="user"`.
   - Never autoplay parallax, scroll-jacking or large-scale movement for reduced-motion users.
6. **Performance.** Animate only `transform` and `opacity`. Avoid layout thrash. Call `ScrollTrigger.refresh()` after late-loading media changes layout. Do not add smooth-scroll libraries (Lenis) without a separate ADR.
7. **Testing.** Unit-test the reduced-motion branching. Playwright runs key flows with `reducedMotion: "reduce"` and checks that content is visible and controls work.

## Consequences

- Animation bundles load only on routes that use them.
- A no-JavaScript or reduced-motion visitor gets the full content.
- Contributors must follow these rules; reviewers check them for every animated component.

## M02 implementation notes (2026-10-19)

How the rules were applied when the libraries were introduced:

- **Leaves.** GSAP lives in three client leaves in `src/components/motion/`: `Reveal`, `HeroMotion` and `PageTransition`. Each registers its own plugins, uses `useGSAP` with a `scope`, and builds animations only inside `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`. Motion is used only in the header (mega-menu presence, staggered panel content, the mobile dialog), wrapped once in `LazyMotion features={domAnimation} strict` and `MotionConfig reducedMotion="user"`.
- **CSS for entrance reveals that are visible on first paint.** The hero's masked headline, copy fade and photo settle are CSS keyframes (`animate-mask-rise`, `animate-fade-rise`, `animate-settle`). A GSAP `from()` there would flash the server-rendered text, hide it, and then reveal it again after hydration. CSS runs from first paint, needs no JavaScript and ends in the server-rendered state. GSAP handles only scroll-linked effects (parallax, scroll-out), which start from the natural state.
- **Page entrances.** `(public)/template.tsx` wraps pages in `PageTransition`. It skips the first page of a visit (no paint delay) and fades in pages reached by client-side navigation.
- **Reduced motion** is also verified end to end: the hero is static, there is no parallax, reveal content stays at opacity 1, and menus open with opacity only (`tests/e2e/motion.spec.ts`).
- **Lenis: not adopted.** The scroll effects are scrubbed against native scroll and work without smooth scrolling. Lenis would take over keyboard, anchor and assistive-technology scrolling for no demonstrated benefit. Revisit only with a separate ADR.
