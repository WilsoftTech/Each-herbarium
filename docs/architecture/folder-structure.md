# Folder structure

This describes the repository **as it is now**. Planned folders are listed separately and are created only when the first real file needs them. Never add empty folders or placeholder files.

## Current

```text
.
├── .github/workflows/ci.yml   CI: install, typecheck, lint, unit, build, e2e
├── docs/                      Engineering knowledge base (see below)
├── public/
│   └── brand/                 Authoritative brand assets (each-logo.jpeg; see README)
├── src/
│   ├── app/                   App Router routes
│   │   ├── layout.tsx         Root layout: fonts, metadata, <html>/<body>
│   │   ├── page.tsx           Homepage (M01 placeholder)
│   │   ├── not-found.tsx      404 page
│   │   ├── globals.css        Tailwind import and design tokens
│   │   └── favicon.ico        Scaffold favicon; replace with brand favicon in M02
│   ├── components/
│   │   └── ui/                Shared UI primitives (Container)
│   └── config/
│       └── site.ts            Site identity: name, short name, region, description
├── tests/
│   ├── unit/                  Vitest (*.test.ts[x])
│   └── e2e/                   Playwright (*.spec.ts)
├── AGENTS.md  CLAUDE.md  ROADMAP.md  README.md
├── .env.example               Documented environment variables (none yet)
├── .gitattributes             LF line endings in Git; binary images
├── next.config.ts  tsconfig.json  eslint.config.mjs
├── vitest.config.mts  playwright.config.ts
└── package.json  package-lock.json
```

## Planned

| Folder | Purpose | Expected |
|---|---|---|
| `src/components/layout/` | Header, footer, page shells | M02 |
| `src/components/navigation/` | Mega menus, mobile navigation | M02 |
| `src/components/sections/` | Reusable page sections (hero, feature grid, story) | M02–M03 |
| `src/hooks/` | Shared client hooks (e.g. reduced motion) | M02 |
| `src/lib/` | Shared utilities and server-only modules | M02+ |
| `src/types/` | Cross-feature types | When first shared |
| `src/features/` | Feature modules (cms, inquiries, volunteering) | M04–M05 |
| `src/styles/` | Extra stylesheets if `globals.css` outgrows one file | If needed |
| `public/images/` | Optimised photography | M03 |

## Docs

| Folder | Contents |
|---|---|
| `docs/architecture/` | Overview, tech stack, this file |
| `docs/roadmap/` | Detailed master roadmap |
| `docs/milestones/` | One executable specification per milestone |
| `docs/decisions/` | Architecture decision records (ADRs) |
| `docs/components/` | Component inventory |
| `docs/audits/` | Verification evidence and audit reports |
| `docs/deployment/` | Deployment expectations |

## Import alias

`@/*` maps to `src/*`, for example `import { siteConfig } from "@/config/site"`.
