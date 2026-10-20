# Architecture overview

## Summary

EACH is a **modular monolith**: a single Next.js App Router application, deployed as one unit (Vercel). It is server-rendered by default and statically prerendered where possible. There are no microservices, no separate API server and no client-side global state. Decision records: [0002](../decisions/0002-modular-monolith.md), [0003](../decisions/0003-animation-architecture.md), [0004](../decisions/0004-platform-and-ui-stack.md), and for the CMS [0007](../decisions/0007-cms-editorial-workflow.md), [0008](../decisions/0008-admin-authentication.md), [0009](../decisions/0009-media-storage.md).

```text
Browser ──► Next.js on Vercel
              ├─ app/(public)          public site — Server Components, prerendered from the CMS
              ├─ app/(admin)/admin     CMS — every page and action calls requireAdmin()
              ├─ app/media/[...key]    uploaded files, streamed from the private Neon Object Storage bucket
              ├─ features/<feature>    content modules (public queries + admin), cms core, auth, users
              ├─ content/              typed static copy and the pending-content register
              ├─ components/           shared UI (public and admin); client leaves for interaction
              ├─ services/             server-only adapters: db, auth, audit, rate limit, storage
              ├─ validation/           Zod schemas (env, content contracts)
              └─ config/               site identity, navigation, validated env
                    └─► Neon PostgreSQL (Prisma 7, pg adapter), Neon Object Storage (aws4fetch); Resend [M05]
```

## Module boundaries

| Layer      | Location               | May import                                     | Rule                                                |
| ---------- | ---------------------- | ---------------------------------------------- | --------------------------------------------------- |
| Routes     | `src/app/`             | everything                                     | Thin: compose features and sections, set metadata.  |
| Features   | `src/features/<name>/` | shared layers, other features' `index.ts` only | Own their components, actions, queries and schemas. |
| Shared UI  | `src/components/`      | `lib`, `config`, `services/permissions`        | Presentational and reusable; no data access.        |
| Services   | `src/services/`        | `validation`, `config`, `lib`                  | `server-only` adapters; `permissions.ts` is pure.   |
| Validation | `src/validation/`      | `zod`                                          | Pure and side-effect free, so it is unit-testable.  |
| Config     | `src/config/`          | `validation`                                   | Static site data; `env.ts` is `server-only`.        |

## Rendering strategy

- **Server Components by default.** `"use client"` goes only on the smallest leaf that needs state, effects, browser APIs or animation.
- **Cache Components** (`cacheComponents: true`) and **partial prefetching** are enabled, as Next.js 16 defaults. Routes are prerendered unless they read request data. Request-time reads (sessions, cookies) go behind `<Suspense>` and follow `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`.
- All public routes are static. `(public)/layout.tsx` sets `ensureStatic = "navigation"`, so the build fails if one needs request-time rendering, and unknown slugs return a real 404. Content published after the build renders on its first request and is then cached.
- **Content** comes from the CMS database through `server-only` feature queries (`"use cache"`, `cacheLife("max")`, one tag per collection) that return only published rows and validate them against the Zod contracts. Admin changes expire the affected tags with `updateTag` ([ADR 0007](../decisions/0007-cms-editorial-workflow.md)). Designed copy that is not CMS-bound stays in `src/content/`. Missing content is shown as labelled placeholders from one register ([ADR 0006](../decisions/0006-content-contracts-and-placeholders.md)).
- **Admin** pages render per request (`instant = false` on the admin layout). Drafts are previewed at `/admin/preview/…`, never through public routes.
- **Loading and errors:** there is no route `loading.tsx`, because every route is prerendered and a loading boundary would hide content without JavaScript. `(public)/error.tsx` shows a retry inside the site shell; `global-error.tsx` covers root-layout failures; `not-found.tsx` serves 404s inside the shell.
- **SEO:** every route sets its title, description, canonical URL and Open Graph through `pageMetadata()`. Structured data covers verified facts only: Organization and WebSite on `/`, and BreadcrumbList on inner pages. Placeholder-only pages are `noindex`. A sitemap and robots file are part of M06.

## Security baseline

- Admin: Neon Managed Auth identities and sessions; application-owned staff membership and three roles, with `requireAdmin()` on every page and action ([ADR 0010](../decisions/0010-neon-managed-backend.md)). The app has no public signup UI or mounted auth HTTP API. Managed identities without CMS membership have no admin access. Sign-in, uploads and user changes are rate-limited in PostgreSQL, and security/editorial changes are audited.
- All input is validated with Zod on the server; database CHECK constraints back up slugs, roles, consent and publication rules. Errors shown to users are generic; details go to server logs.
- Uploads: server-side size, type and signature checks, random keys, private bucket, sandboxed `/media` responses ([ADR 0009](../decisions/0009-media-storage.md)).
- Environment variables are validated (site URL at start-up; database, auth and storage on first use). Secrets are never `NEXT_PUBLIC_`, and server modules import `server-only`.
- Response headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY` and `Permissions-Policy`. `X-Powered-By` is disabled. CSP comes in M06.

## Design system

Tokens, typography (Fraunces display, Geist text), contrast measurements and their verification status are in [design-tokens.md](design-tokens.md). Primitives and navigation are listed in the [component inventory](../components/inventory.md). The public shell is `(public)/layout.tsx`: `SiteHeader` (desktop mega menus from `xl`, a full-screen mobile dialog below it), the page, and `SiteFooter`. All navigation renders from the typed `src/config/navigation.ts`.

## Animation

GSAP + ScrollTrigger and Motion are used only in client leaf components, with scoped cleanup and reduced-motion handling, and are never initialised globally. Full rules and the M02 implementation notes: [ADR 0003](../decisions/0003-animation-architecture.md). Entrance reveals visible on first paint are CSS keyframes; GSAP handles scroll-linked effects; Motion handles menu presence.

## Dependency philosophy

Install only what the current milestone's code uses, prefer native features, and record every dependency's purpose in [tech-stack.md](tech-stack.md). See [AGENTS.md §3](../../AGENTS.md#3-dependencies).
