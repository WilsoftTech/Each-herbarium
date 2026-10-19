# Architecture overview

## Summary

EACH is a single Next.js App Router application. It is server-rendered by default, statically prerendered where possible, and deployed as one unit. There are no microservices, no separate API server and no client-side global state.

```text
Browser ──► Next.js (App Router)
              ├─ Server Components (default): pages, layouts, data access
              ├─ Client Components (leaf only): menus, animation, form state
              └─ Route Handlers / Server Actions (from M04/M05): CMS, forms, email
                       └─ Database, email provider, media storage (planned)
```

## Rendering strategy

- **Server Components by default.** Pages and layouts render on the server and ship no component JavaScript unless they need interactivity.
- **Client Components at the leaves.** `"use client"` goes only on the smallest component that needs state, effects, browser APIs or animation (for example a mega-menu panel, not the header that contains it).
- **Cache Components enabled.** `next.config.ts` sets `cacheComponents: true`, the Next.js 16 default from `create-next-app`. Routes are prerendered statically unless they read request data. Dynamic data from M04 onward must use `"use cache"` or `<Suspense>` correctly. See `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`.
- **Partial prefetching** (`partialPrefetching: true`) is also a scaffold default and is kept.
- Current routes (`/`, 404) are fully static.

## Application boundaries

| Layer | Location | Rule |
|---|---|---|
| Routes | `src/app/` | Thin: compose sections, set metadata. |
| Shared UI | `src/components/` | Presentational and reusable; no data fetching. |
| Features | `src/features/<name>/` | Feature-owned components, logic and validation. |
| Configuration | `src/config/` | Static site data (identity, navigation). |
| Server utilities | `src/lib/` | Framework-agnostic helpers; server-only modules import `server-only`. |

## Design tokens

Tokens are defined in `src/app/globals.css` with Tailwind CSS v4 `@theme`. Components use **semantic** tokens only.

| Semantic token | Utility | Maps to | Value |
|---|---|---|---|
| background | `bg-background` | warm ivory | `#F6F7F2` |
| foreground | `text-foreground` | charcoal | `#151A18` |
| primary | `text-primary` | botanical green | `#176B28` |
| accent | `text-accent` | globe blue | `#087DB9` |
| muted | `text-muted` | moss grey | `#4A524E` |

Measured contrast on ivory: charcoal 16.35:1, moss grey 7.48:1, botanical green 6.15:1, globe blue **4.20:1**. Globe blue is AA-compliant only for large text (≥24px, or ≥18.66px bold) and non-text use.

**Status: provisional.** The authoritative logo is at `public/brand/each-logo.jpeg`. Median colours sampled from it during M01 (JPEG, so approximate):

| Logo element | Sampled | Provisional token |
|---|---|---|
| "EACH" wordmark | `#1E6000` | botanical green `#176B28` |
| Leaf | `#3F9003` | — |
| Globe ocean (gradient) | `#069BD5` (light) → `#0D2D76` (dark) | globe blue `#087DB9` (within range) |
| Tagline text | near-black `#010101` | charcoal `#151A18` |

The tokens are in the right family but not exact matches. Finalise them in M02, preferably from a vector master or official brand values, and re-measure contrast.

Typography uses Geist Sans via `next/font` (self-hosted at build time) as a neutral placeholder. Editorial typography is chosen in M02.

## Dependency philosophy

Install only what the current milestone's code uses, prefer native platform features, and record every dependency's purpose in [tech-stack.md](tech-stack.md). See [AGENTS.md §3](../../AGENTS.md#3-dependencies).

## Planned integrations

These are planned, not installed. Each will be decided by an ADR when its milestone starts.

| Concern | Milestone | Candidate |
|---|---|---|
| Animation / scroll | M02 | Motion and/or GSAP, Lenis (choose the minimum) |
| Database and ORM | M04 | Prisma with PostgreSQL |
| Authentication (admin) | M04 | Clerk |
| CMS | M04 | Decided in M04 ADR |
| Transactional email | M05 | Resend |
| Hosting, media, CDN | M07 | Decided in M07 (Cloudflare or Vercel) |
