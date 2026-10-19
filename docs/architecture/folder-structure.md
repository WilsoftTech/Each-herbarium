# Folder structure

This describes the repository **as it is now**. Planned folders are listed separately and are created when the first real file needs them. Do not add empty folders or placeholder code.

## Current

```text
.
├── .github/workflows/ci.yml     CI: format, typecheck, lint, unit, build, e2e
├── docs/                        Engineering knowledge base (see below)
├── public/brand/                Original EACH logo (each-logo.jpeg) and asset rules
├── src/
│   ├── app/
│   │   ├── layout.tsx           Root layout: fonts, metadata (incl. metadataBase), <html>/<body>
│   │   ├── not-found.tsx        Global 404
│   │   ├── globals.css          Tailwind, design tokens, reduced-motion baseline
│   │   ├── favicon.ico          Scaffold favicon (replace in M02)
│   │   ├── (public)/page.tsx    Homepage (placeholder; cinematic homepage in M03)
│   │   └── (admin)/admin/page.tsx  Admin entry, guarded by requireAdmin() (denies all until M04)
│   ├── components/ui/           Shared UI primitives (Container); shadcn/ui components from M02
│   ├── config/
│   │   ├── site.ts              Site identity
│   │   └── env.ts               Validated server environment (server-only)
│   ├── features/README.md       Feature-module contract (no features yet)
│   ├── services/admin-auth.ts   requireAdmin() authorisation guard (server-only)
│   └── validation/env.ts        Env schema and parseServerEnv() (pure, tested)
├── tests/
│   ├── unit/                    Vitest: homepage render, env validation
│   └── e2e/                     Playwright: navigation, 404, security headers, admin denial
├── AGENTS.md  CLAUDE.md  ROADMAP.md  README.md
├── .env.example                 Documented environment variables
├── .gitattributes               LF line endings; binary images
├── .prettierrc.json  .prettierignore
├── next.config.ts               Cache Components, security headers
├── tsconfig.json                strict, noUncheckedIndexedAccess, noFallthroughCasesInSwitch, noImplicitOverride
├── eslint.config.mjs  vitest.config.mts  playwright.config.ts
└── package.json  package-lock.json
```

## Planned

| Folder                             | Purpose                                                | Expected |
| ---------------------------------- | ------------------------------------------------------ | -------- |
| `src/components/layout/`           | Header, footer, page shells                            | M02      |
| `src/components/navigation/`       | Mega menus, mobile navigation                          | M02      |
| `src/components/motion/`           | Shared animation client leaves (ADR 0003)              | M02      |
| `src/components/sections/`         | Reusable page sections                                 | M02–M03  |
| `src/hooks/`                       | Shared client hooks                                    | M02      |
| `src/lib/`                         | Framework-agnostic helpers (for example shadcn `cn()`) | M02      |
| `src/features/<feature>/`          | Business modules                                       | M03–M05  |
| `src/app/(public)/layout.tsx`      | Public shell (header and footer)                       | M02      |
| `src/app/(admin)/admin/layout.tsx` | Admin shell                                            | M04      |
| `public/images/`                   | Optimised, licensed photography                        | M03      |

## Docs

| Folder               | Contents                                       |
| -------------------- | ---------------------------------------------- |
| `docs/architecture/` | Overview, design tokens, tech stack, this file |
| `docs/roadmap/`      | Master roadmap                                 |
| `docs/milestones/`   | One specification per milestone                |
| `docs/decisions/`    | ADRs                                           |
| `docs/components/`   | Component inventory                            |
| `docs/audits/`       | Verification evidence                          |
| `docs/deployment/`   | Deployment expectations                        |

## Import alias

`@/*` maps to `src/*`.
