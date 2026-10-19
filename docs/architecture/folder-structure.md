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
│   │   ├── global-error.tsx     Last-resort error page (client; renders its own document)
│   │   ├── globals.css          Tailwind, design tokens, surfaces, keyframes, reduced-motion baseline
│   │   ├── icon.png, apple-icon.png  Favicons resized from the original logo
│   │   ├── (public)/
│   │   │   ├── layout.tsx       Public shell: SiteHeader + <main> + SiteFooter; ensureStatic = "navigation"
│   │   │   ├── template.tsx     Page entrance on client navigation (PageTransition)
│   │   │   ├── error.tsx        Error state inside the site shell (client, Next.js requirement)
│   │   │   ├── page.tsx         Homepage (12 sections)
│   │   │   ├── about/           page.tsx, mission/, leadership/, partners/
│   │   │   ├── our-work/        page.tsx, plant-conservation/, environmental-conservation/,
│   │   │   │                    medicinal-plants/, indigenous-knowledge/
│   │   │   ├── herbarium/  research/  impact/  get-involved/  volunteer/  partnerships/
│   │   │   ├── bitwiire-herbarium-cafe/  contact/  privacy/  terms/  accessibility/
│   │   │   ├── projects/        page.tsx, [slug]/page.tsx (generateStaticParams)
│   │   │   ├── resources/       page.tsx, [slug]/page.tsx (generateStaticParams)
│   │   │   └── design-system/page.tsx  Design system preview (noindex, not linked)
│   │   └── (admin)/admin/page.tsx  Admin entry, guarded by requireAdmin() (denies all until M04)
│   ├── components/
│   │   ├── ui/                  Primitives: Button (shadcn), Container, Section, SectionHeading, Eyebrow,
│   │   │                        Grid, MediaCard, PhotoCredit, icons, PendingContent, Notice, Breadcrumbs,
│   │   │                        JsonLd, KeyFacts, Prose, BotanicalIllustration
│   │   ├── layout/              SiteHeader, SiteFooter, BrandMark
│   │   ├── navigation/          DesktopNav, MegaMenuPanel, MobileNav
│   │   ├── motion/              GSAP client leaves: Reveal, HeroMotion, PageTransition, Parallax, ScrollText
│   │   └── sections/            Hero, PageHeader, Statement, SplitFeature, FullBleedImage, ProgramExplorer,
│   │                            StoryScroller, RegionPresence, NumberedList, ActionPanels, SequenceNav,
│   │                            SpecimenSheet
│   ├── config/
│   │   ├── site.ts              Site identity
│   │   ├── navigation.ts        Typed navigation: mega menus, mobile menu, footer, policy links
│   │   ├── media.ts             Photography registry with alt text and credits
│   │   └── env.ts               Validated server environment (server-only)
│   ├── content/                 Typed static copy that is not CMS-bound
│   │   ├── pending.ts           Register of content awaiting EACH (placeholders name these keys)
│   │   ├── programmes.ts        Programmes and the herbarium
│   │   ├── ecosystems.ts        Landscape chapters for the scroll story
│   │   └── specimens.ts         Reference specimens (Kew-imaged, collected in Uganda)
│   ├── features/                Business modules (ADR 0002, ADR 0006)
│   │   ├── projects/            schema.ts, data.ts, queries.ts (server-only), components/, index.ts
│   │   ├── resources/           schema.ts, data.ts, queries.ts (server-only), components/, index.ts
│   │   └── partners/            schema.ts, data.ts, queries.ts (server-only), components/, index.ts
│   ├── hooks/                   useScrolled, useBodyScrollLock
│   ├── lib/                     utils.ts (cn), motion.ts, metadata.ts (pageMetadata), structured-data.ts
│   ├── services/admin-auth.ts   requireAdmin() authorisation guard (server-only)
│   └── validation/              env.ts (env schema), content.ts (media, status, slug contracts)
├── tests/
│   ├── routes.ts                The approved public route list, shared by unit and e2e tests
│   ├── unit/                    Vitest (node; jsdom per file): every page, content contracts and
│   │                            register, navigation, structured data, metadata, components
│   └── e2e/                     Playwright: routes, links, interactions, navigation, header, mega menu,
│                                mobile, motion, layout/axe, platform; screenshots.spec.ts (opt-in evidence)
├── AGENTS.md  CLAUDE.md  ROADMAP.md  README.md
├── components.json              shadcn/ui configuration (aliases, new-york style)
├── .env.example                 Documented environment variables
├── .gitattributes               LF line endings; binary images
├── .prettierrc.json  .prettierignore
├── next.config.ts               Cache Components, partial prefetching, security headers
├── tsconfig.json                strict, noUncheckedIndexedAccess, noFallthroughCasesInSwitch, noImplicitOverride
├── eslint.config.mjs  vitest.config.mts  playwright.config.ts
└── package.json  package-lock.json
```

## Planned

| Folder                               | Purpose                                    | Expected |
| ------------------------------------ | ------------------------------------------ | -------- |
| `src/features/<feature>/` (more)     | Inquiries, volunteering and other modules  | M04–M05  |
| `src/app/(admin)/admin/layout.tsx`   | Admin shell                                | M04      |
| `src/services/` database and storage | Prisma, R2 adapters behind feature queries | M04      |

## Docs

| Folder               | Contents                                                       |
| -------------------- | -------------------------------------------------------------- |
| `docs/architecture/` | Overview, design tokens, tech stack, this file                 |
| `docs/content/`      | Content awaiting approval from EACH                            |
| `docs/roadmap/`      | Master roadmap                                                 |
| `docs/milestones/`   | One specification per milestone                                |
| `docs/decisions/`    | ADRs                                                           |
| `docs/components/`   | Component inventory                                            |
| `docs/audits/`       | Verification evidence (`m02-screenshots/`, `m03-screenshots/`) |
| `docs/deployment/`   | Deployment expectations                                        |

## Import alias

`@/*` maps to `src/*`.
