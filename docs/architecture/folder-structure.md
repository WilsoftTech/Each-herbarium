# Folder structure

This describes the repository **as it is now**. Planned folders are listed separately and are created when the first real file needs them. Do not add empty folders or placeholder code.

## Current

```text
.
├── .github/workflows/ci.yml     CI: format, typecheck, lint, unit, build, e2e
├── docs/                        Engineering knowledge base (see below)
├── public/
│   ├── brand/                   Original EACH logo (each-logo.jpeg) and asset rules
│   └── images/                  Licensed stand-in photography (README lists licences)
├── src/
│   ├── app/
│   │   ├── layout.tsx           Root layout: fonts (Geist, Fraunces), metadata, <html>/<body>
│   │   ├── not-found.tsx        Global 404, rendered inside the site header and footer
│   │   ├── globals.css          Tailwind, design tokens, keyframes, reduced-motion baseline
│   │   ├── icon.png, apple-icon.png  Favicons resized from the original logo
│   │   ├── (public)/
│   │   │   ├── layout.tsx       Public shell: SiteHeader + page + SiteFooter
│   │   │   ├── template.tsx     Page entrance on client navigation (PageTransition)
│   │   │   ├── page.tsx         Homepage: cinematic hero and focus section (full story in M03)
│   │   │   └── design-system/page.tsx  Design system preview (noindex)
│   │   └── (admin)/admin/page.tsx  Admin entry, guarded by requireAdmin() (denies all until M04)
│   ├── components/
│   │   ├── ui/                  Primitives: Button (shadcn), Container, Section, SectionHeading,
│   │   │                        Eyebrow, Grid, MediaCard, PhotoCredit, icons
│   │   ├── layout/              SiteHeader, SiteFooter, BrandMark
│   │   ├── navigation/          DesktopNav, MegaMenuPanel, MobileNav
│   │   ├── motion/              GSAP client leaves: Reveal, HeroMotion, PageTransition
│   │   └── sections/            Hero
│   ├── config/
│   │   ├── site.ts              Site identity
│   │   ├── navigation.ts        Typed navigation: mega menus, mobile menu, footer
│   │   ├── media.ts             Photography registry with alt text and credits
│   │   └── env.ts               Validated server environment (server-only)
│   ├── hooks/                   useScrolled, useBodyScrollLock
│   ├── lib/                     utils.ts (cn), motion.ts (easings, durations, media queries)
│   ├── features/README.md       Feature-module contract (no features yet)
│   ├── services/admin-auth.ts   requireAdmin() authorisation guard (server-only)
│   └── validation/env.ts        Env schema and parseServerEnv() (pure, tested)
├── tests/
│   ├── unit/                    Vitest (node; jsdom per file): pages, config, Button, navs, Reveal
│   └── e2e/                     Playwright: navigation, header, mega menu, mobile, motion,
│                                layout/axe, platform; screenshots.spec.ts (opt-in evidence)
├── AGENTS.md  CLAUDE.md  ROADMAP.md  README.md
├── components.json              shadcn/ui configuration (aliases, new-york style)
├── .env.example                 Documented environment variables
├── .gitattributes               LF line endings; binary images
├── .prettierrc.json  .prettierignore
├── next.config.ts               Cache Components, security headers
├── tsconfig.json                strict, noUncheckedIndexedAccess, noFallthroughCasesInSwitch, noImplicitOverride
├── eslint.config.mjs  vitest.config.mts  playwright.config.ts
└── package.json  package-lock.json
```

## Planned

| Folder                             | Purpose                                         | Expected |
| ---------------------------------- | ----------------------------------------------- | -------- |
| `src/features/<feature>/`          | Business modules                                | M03–M05  |
| `src/content/`                     | Typed static page content (replaced by the CMS) | M03      |
| `src/app/(admin)/admin/layout.tsx` | Admin shell                                     | M04      |

## Docs

| Folder               | Contents                                                |
| -------------------- | ------------------------------------------------------- |
| `docs/architecture/` | Overview, design tokens, tech stack, this file          |
| `docs/roadmap/`      | Master roadmap                                          |
| `docs/milestones/`   | One specification per milestone                         |
| `docs/decisions/`    | ADRs                                                    |
| `docs/components/`   | Component inventory                                     |
| `docs/audits/`       | Verification evidence (M02 includes `m02-screenshots/`) |
| `docs/deployment/`   | Deployment expectations                                 |

## Import alias

`@/*` maps to `src/*`.
