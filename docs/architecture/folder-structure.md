# Folder structure

This describes the repository **as it is now**. Planned folders are listed separately and are created when the first real file needs them. Do not add empty folders or placeholder code.

## Current

```text
.
├── .github/workflows/ci.yml     CI: PostgreSQL service; format, migration check, typecheck, lint,
│                                migrate, seed, tests, build, e2e
├── docs/                        Engineering knowledge base (see below)
├── prisma/
│   ├── schema.prisma            Data model (ADR 0007); client generated to src/generated/prisma
│   ├── migrations/              Versioned SQL migrations (init + hand-written CHECKs and audit trigger)
│   ├── seed.ts                  Create-only migration of the M03 content into the CMS; fills
│   │                            designed sections that existing rows lack (never overwrites)
│   └── seed/                    Seed data: programmes, projects, articles, partners, pages, landing
│                                and programme sections, fill-content.ts (backfill), types
├── scripts/                     tsx command-line tools: create-admin, cleanup-media,
│                                check-migrations (safeguard), script-env (env + client)
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
│   │   ├── (admin)/admin/
│   │   │   ├── layout.tsx       noindex, instant = false (per-request rendering)
│   │   │   ├── sign-in/         Sign-in page (outside the console)
│   │   │   ├── (console)/       AdminShell layout with loading, error and not-found states; dashboard,
│   │   │   │                    reviews, enquiries, account, pages, programmes, projects, articles,
│   │   │   │                    resources, partners, team, media, settings (+ contact, branding,
│   │   │   │                    navigation, footer, forms, seo), users, audit
│   │   │   └── preview/         Draft and pending-change previews (projects, articles, pages)
│   │   ├── media/[...key]/route.ts  Streams uploaded files from the private Neon Object Storage bucket
│   │   ├── sitemap.ts           Published, indexable content only (cached, tag-invalidated)
│   │   └── robots.ts            Allows the public site, disallows /admin
│   ├── components/
│   │   ├── admin/               Admin UI: AdminShell, ActionForm, form fields, ContentTable, CollectionList,
│   │   │                        StatusBadge, Pagination, PreviewFrame
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
│   │   ├── navigation.ts        Typed navigation: mega menus, mobile menu, footer, policy links;
│   │   │                        CMS overrides (labels, order, visibility) and applyNavigation
│   │   ├── routes.ts            Approved public routes; isApprovedHref validates CMS links
│   │   ├── media.ts             Photography registry with alt text and credits
│   │   └── env.ts               Validated server environment (server-only)
│   ├── content/                 Typed static copy that is not CMS-bound
│   │   ├── pending.ts           Register of content awaiting EACH (placeholders name these keys)
│   │   ├── programmes.ts        Programmes and the herbarium
│   │   └── specimens.ts         Reference specimens (Kew-imaged, collected in Uganda)
│   ├── features/                Business modules (ADR 0002, 0006, 0007)
│   │   ├── cms/                 Workflow and revision rules, shared save/transition/delete, revision
│   │   │                        editor and preview loaders, action results, form parsing, list params,
│   │   │                        dashboard, WorkflowPanel, EditorTarget, SeoFields, StatusFilter,
│   │   │                        sections.ts + SectionFields (designed-section declarations, ADR 0013)
│   │   ├── auth/                Sign-in, sign-out and password Server Actions and forms
│   │   ├── users/               Staff accounts and roles (administrators only)
│   │   ├── media/               Upload rules, mapping, references, admin actions and forms
│   │   ├── programmes/  projects/  resources/  partners/  team/  pages/  settings/
│   │   │                        Each: schema.ts, queries.ts (published, cached), components/,
│   │   │                        admin/ (adapter, save operations, editor loaders, actions, form),
│   │   │                        index.ts. pages/ also: registry.ts (managed fixed pages),
│   │   │                        home-content.ts (homepage sections), landing-content.ts and
│   │   │                        components/landing/ (landing sections and views), metadata.ts.
│   │   │                        programmes/ also: designed-content.ts (founding programme pages)
│   │   ├── enquiries/           Public forms (M05, ADR 0015): schema.ts, submit.ts (public Server
│   │   │                        Action), delivery.ts (Resend emails), components/enquiry-form.tsx,
│   │   │                        admin/ (queries, status and retry actions, panels), index.ts
│   ├── hooks/                   useScrolled, useBodyScrollLock
│   ├── lib/                     utils.ts (cn), motion.ts, metadata.ts (pageMetadata), structured-data.ts
│   ├── generated/prisma/        Prisma client (generated, git-ignored)
│   ├── services/                db (Prisma), auth (Neon Managed Auth), admin-auth (requireAdmin), permissions
│   │                            (role matrix), audit, rate-limit, storage (Neon S3), email (Resend)
│   └── validation/              env.ts (env schema), content.ts (media, status, slug contracts)
├── tests/
│   ├── routes.ts                The approved public route list, shared by unit and e2e tests
│   ├── global-setup.ts          Rebuilds the each_test schema: migrate deploy + seed
│   ├── test-database.ts         Test database URL and schema (refuses production)
│   ├── unit/                    Vitest (node; jsdom per file): every page, content contracts and
│   │                            register, navigation, metadata, components, permissions, workflow,
│   │                            upload rules, rich text, env, admin input, migration safeguard,
│   │                            designed sections (declarations, seed copy, backfill)
│   ├── integration/             Vitest against the test schema: authorisation, editorial workflow and
│   │                            revisions, CMS pages/settings/sitemap, database constraints and drift,
│   │                            media, sign-in; auth test double
│   └── e2e/                     Playwright: routes, links, interactions, navigation, header, mega menu,
│                                mobile, motion, layout/axe, platform, admin (publish flow,
│                                designed-section edits);
│                                global-setup + fixtures/e2e-data.ts (e2e staff accounts)
├── AGENTS.md  CLAUDE.md  ROADMAP.md  README.md
├── components.json              shadcn/ui configuration (aliases, new-york style)
├── .env.example                 Documented environment variables
├── prisma.config.ts             Prisma 7 config (schema, migrations, seed; loads .env.local)
├── .gitattributes               LF line endings; binary images
├── .prettierrc.json  .prettierignore
├── next.config.ts               Cache Components, partial prefetching, security headers
├── tsconfig.json                strict, noUncheckedIndexedAccess, noFallthroughCasesInSwitch, noImplicitOverride
├── eslint.config.mjs  vitest.config.mts  playwright.config.ts
└── package.json  package-lock.json
```

## Planned

| Folder                           | Purpose                       | Expected |
| -------------------------------- | ----------------------------- | -------- |
| `src/features/<feature>/` (more) | As later milestones need them | M06+     |

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
