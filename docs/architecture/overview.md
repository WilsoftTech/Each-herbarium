# Architecture overview

## Summary

EACH is a **modular monolith**: a single Next.js App Router application, deployed as one unit (Vercel). It is server-rendered by default and statically prerendered where possible. There are no microservices, no separate API server and no client-side global state. Decision records: [0002](../decisions/0002-modular-monolith.md), [0003](../decisions/0003-animation-architecture.md), [0004](../decisions/0004-platform-and-ui-stack.md).

```text
Browser ──► Next.js on Vercel
              ├─ app/(public)          public site — Server Components
              ├─ app/(admin)/admin     admin — every entry point calls requireAdmin()
              ├─ features/<feature>    business modules: projects, resources, partners (M03)
              ├─ content/              typed static copy and the pending-content register
              ├─ components/           shared UI; client leaves for interaction and animation
              ├─ services/             server-only adapters: auth (now); db, storage, email (later)
              ├─ validation/           Zod schemas (env, content contracts; forms later)
              └─ config/               site identity, validated env
                    └─► Neon PostgreSQL (Prisma), Cloudflare R2, Resend   [planned]
```

## Module boundaries

| Layer      | Location               | May import                                     | Rule                                                |
| ---------- | ---------------------- | ---------------------------------------------- | --------------------------------------------------- |
| Routes     | `src/app/`             | everything                                     | Thin: compose features and sections, set metadata.  |
| Features   | `src/features/<name>/` | shared layers, other features' `index.ts` only | Own their components, actions, queries and schemas. |
| Shared UI  | `src/components/`      | `lib`, `config`                                | Presentational and reusable; no data access.        |
| Services   | `src/services/`        | `validation`, `config`, `lib`                  | `server-only`. Infrastructure adapters.             |
| Validation | `src/validation/`      | `zod`                                          | Pure and side-effect free, so it is unit-testable.  |
| Config     | `src/config/`          | `validation`                                   | Static site data; `env.ts` is `server-only`.        |

## Rendering strategy

- **Server Components by default.** `"use client"` goes only on the smallest leaf that needs state, effects, browser APIs or animation.
- **Cache Components** (`cacheComponents: true`) and **partial prefetching** are enabled, as Next.js 16 defaults. Routes are prerendered unless they read request data. Request-time reads (sessions, cookies) go behind `<Suspense>` and follow `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`.
- All 25 public routes are static. `(public)/layout.tsx` sets `ensureStatic = "navigation"`, so the build fails if one needs request-time rendering, and unknown project or resource slugs return a real 404. `/admin` returns 404 until M04.
- **Content** comes from typed feature modules (`projects`, `resources`, `partners`) through async `server-only` queries validated by Zod schemas, and from typed copy in `src/content/`. In M04 the query bodies switch to the database; pages do not change. Missing content is shown as labelled placeholders from one register ([ADR 0006](../decisions/0006-content-contracts-and-placeholders.md)).
- **Loading and errors:** there is no route `loading.tsx`, because every route is prerendered and a loading boundary would hide content without JavaScript. `(public)/error.tsx` shows a retry inside the site shell; `global-error.tsx` covers root-layout failures; `not-found.tsx` serves 404s inside the shell.
- **SEO:** every route sets its title, description, canonical URL and Open Graph through `pageMetadata()`. Structured data covers verified facts only: Organization and WebSite on `/`, and BreadcrumbList on inner pages. Placeholder-only pages are `noindex`. A sitemap and robots file are part of M06.

## Security baseline

- Admin is deny-by-default: `requireAdmin()` returns 404 until M04 adds identity. Admin metadata reveals nothing.
- Environment variables are validated at build time. Secrets are never `NEXT_PUBLIC_`, and server modules import `server-only`.
- Response headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY` and `Permissions-Policy`. `X-Powered-By` is disabled. CSP comes in M06.

## Design system

Tokens, typography (Fraunces display, Geist text), contrast measurements and their verification status are in [design-tokens.md](design-tokens.md). Primitives and navigation are listed in the [component inventory](../components/inventory.md). The public shell is `(public)/layout.tsx`: `SiteHeader` (desktop mega menus from `xl`, a full-screen mobile dialog below it), the page, and `SiteFooter`. All navigation renders from the typed `src/config/navigation.ts`.

## Animation

GSAP + ScrollTrigger and Motion are used only in client leaf components, with scoped cleanup and reduced-motion handling, and are never initialised globally. Full rules and the M02 implementation notes: [ADR 0003](../decisions/0003-animation-architecture.md). Entrance reveals visible on first paint are CSS keyframes; GSAP handles scroll-linked effects; Motion handles menu presence.

## Dependency philosophy

Install only what the current milestone's code uses, prefer native features, and record every dependency's purpose in [tech-stack.md](tech-stack.md). See [AGENTS.md §3](../../AGENTS.md#3-dependencies).
