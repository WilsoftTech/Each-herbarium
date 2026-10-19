# Component inventory

Registry of implemented reusable components. **Check this before creating a component** ([AGENTS.md §4](../../AGENTS.md#components)). Update it in the same commit as any component change. A live preview of the primitives is at `/design-system`.

## UI primitives (`src/components/ui/`)

| Component        | Type   | Purpose                                                          | Key props                                                                                                     | Used by                                     | Since |
| ---------------- | ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----- |
| `Container`      | Server | Centred `max-w-7xl` wrapper with page gutters                    | `<div>` props; `className` merged with `cn()`                                                                 | All pages, header, footer, sections         | M01   |
| `Button`         | Server | The only button style (shadcn/ui, EACH tokens)                   | `variant`: primary, contrast, outline, ghost, link; `size`: sm, md, lg, icon; `asChild`                       | Hero, 404, design system                    | M02   |
| `Eyebrow`        | Server | Uppercase label above a heading                                  | `<p>` props                                                                                                   | Hero, SectionHeading, MediaCard, mega menus | M02   |
| `Section`        | Server | `<section>` with vertical rhythm and surface                     | `surface`: light, muted, dark; `spacing`: default, compact, none                                              | Homepage, design system                     | M02   |
| `SectionHeading` | Server | Eyebrow + display heading + lead; a `Reveal` target              | `eyebrow`, `title`, `description`, `as` (h1–h3), `id`, `align`                                                | Homepage, design system                     | M02   |
| `Grid`           | Server | Responsive content grid                                          | `columns`: 2, 3, 4                                                                                            | Homepage, design system                     | M02   |
| `MediaCard`      | Server | Photographic link card; whole card clickable; hover zoom; credit | `href`, `title`, `description`, `eyebrow`, `image` (MediaAsset), `aspect`, `headingLevel`, `sizes`            | Homepage, design system                     | M02   |
| `PhotoCredit`    | Server | Author and licence links required by image licences              | `image`                                                                                                       | Hero, MediaCard, MegaMenuPanel              | M02   |
| Icons            | Server | Inline stroke SVGs, `aria-hidden`, default `size-4`              | `ArrowRightIcon`, `ArrowLeftIcon`, `ChevronDownIcon`, `ChevronRightIcon`, `MenuIcon`, `CloseIcon`, `PlusIcon` | Buttons, navigation                         | M02   |

## Layout and navigation

| Component       | Path                                            | Type   | Purpose                                                                                                                                                    | Since |
| --------------- | ----------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `SiteHeader`    | `src/components/layout/site-header.tsx`         | Client | Fixed header and skip link. Transparent over hero routes, solid on scroll or when a menu is open; spacer on other routes; `notFound` prop for the 404 page | M02   |
| `SiteFooter`    | `src/components/layout/site-footer.tsx`         | Server | Dark footer with identity and a full sitemap from the navigation config (works without JavaScript)                                                         | M02   |
| `BrandMark`     | `src/components/layout/brand-mark.tsx`          | Server | The original logo, unaltered, on a white plate, plus the organisation name; links home                                                                     | M02   |
| `DesktopNav`    | `src/components/navigation/desktop-nav.tsx`     | Client | `xl`+ primary navigation: disclosure mega menus, hover intent, click to pin, keyboard model, sliding indicator, sheet and scrim                            | M02   |
| `MegaMenuPanel` | `src/components/navigation/mega-menu-panel.tsx` | Client | One full-width panel: summary, link groups, optional featured photograph; staggered entrance; Up/Down between links                                        | M02   |
| `MobileNav`     | `src/components/navigation/mobile-nav.tsx`      | Client | Below `xl`: full-screen modal dialog, drill-down sections with Back, accordion groups, focus trap, inert page, scroll lock                                 | M02   |

## Sections and motion

| Component        | Path                                        | Type   | Purpose                                                                                                        | Since |
| ---------------- | ------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------- | ----- |
| `Hero`           | `src/components/sections/hero.tsx`          | Server | Full-viewport photographic hero: CSS masked headline, two actions, scroll cue, credit; wraps `HeroMotion`      | M02   |
| `Reveal`         | `src/components/motion/reveal.tsx`          | Client | GSAP ScrollTrigger: staggers `[data-reveal]`, clip-reveals `[data-reveal-media]`; nothing under reduced motion | M02   |
| `HeroMotion`     | `src/components/motion/hero-motion.tsx`     | Client | GSAP scrubbed parallax and scroll-out for `[data-hero-media]`, `[data-hero-content]`, `[data-hero-shade]`      | M02   |
| `PageTransition` | `src/components/motion/page-transition.tsx` | Client | Fades in pages reached by client navigation (skips the first page of a visit); used by `(public)/template.tsx` | M02   |

## Shared modules

| Module                                                                      | Path                                | Purpose                                                                           |
| --------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------- |
| `siteConfig`                                                                | `src/config/site.ts`                | Organisation name, short name, region, description                                |
| `primaryNavigation`, `hasMenu`, `isActivePath`, `megaMenuPanelId`           | `src/config/navigation.ts`          | Single typed navigation source for mega menus, mobile menu and footer             |
| `media`, `MediaAsset`                                                       | `src/config/media.ts`               | Photography registry: src, size, alt, caption, credit                             |
| `env`                                                                       | `src/config/env.ts`                 | Validated server environment (`server-only`)                                      |
| `parseServerEnv`, `serverEnvSchema`                                         | `src/validation/env.ts`             | Pure env validation, unit-tested                                                  |
| `requireAdmin`                                                              | `src/services/admin-auth.ts`        | Server-side admin authorisation (`server-only`). Denies all until M04             |
| `cn`                                                                        | `src/lib/utils.ts`                  | Class joining with Tailwind conflict resolution                                   |
| `MOTION_OK`, `MOTION_REDUCED`, `EASE_*`, `DURATION`, `prefersReducedMotion` | `src/lib/motion.ts`                 | Animation constants shared by GSAP and Motion code (no library imports)           |
| `useScrolled`                                                               | `src/hooks/use-scrolled.ts`         | rAF-throttled "scrolled past N px"; `false` until mounted (no hydration mismatch) |
| `useBodyScrollLock`                                                         | `src/hooks/use-body-scroll-lock.ts` | Locks document scroll for overlays, with scrollbar compensation                   |

## Styling hooks

| Hook                                    | Defined in    | Purpose                                          |
| --------------------------------------- | ------------- | ------------------------------------------------ |
| `data-surface="dark"`                   | `globals.css` | Switches a subtree to the dark token set         |
| `data-reveal`, `data-reveal-media`      | `Reveal`      | Opt elements into scroll reveals                 |
| `data-hero-media`, `-content`, `-shade` | `HeroMotion`  | Hero scroll-animation targets                    |
| `data-appearance` on `header`           | `SiteHeader`  | `transparent` / `solid` (also used by e2e tests) |
