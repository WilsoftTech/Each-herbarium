# Architecture overview

## Summary

EACH is a **modular monolith**: a single Next.js App Router application, deployed as one unit (Vercel). It is server-rendered by default and statically prerendered where possible. There are no microservices, no separate API server and no client-side global state. Decision records: [0002](../decisions/0002-modular-monolith.md), [0003](../decisions/0003-animation-architecture.md), [0004](../decisions/0004-platform-and-ui-stack.md).

```text
Browser ──► Next.js on Vercel
              ├─ app/(public)          public site — Server Components
              ├─ app/(admin)/admin     admin — every entry point calls requireAdmin()
              ├─ features/<feature>    business modules (from M03)
              ├─ components/           shared UI; client leaves for interaction and animation
              ├─ services/             server-only adapters: auth (now); db, storage, email (later)
              ├─ validation/           Zod schemas (env now; forms and content later)
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
- Current routes (`/`, `/admin` → 404, not-found) are all static.

## Security baseline

- Admin is deny-by-default: `requireAdmin()` returns 404 until M04 adds identity. Admin metadata reveals nothing.
- Environment variables are validated at build time. Secrets are never `NEXT_PUBLIC_`, and server modules import `server-only`.
- Response headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY` and `Permissions-Policy`. `X-Powered-By` is disabled. CSP comes in M06.

## Design system

Tokens and their verification status are in [design-tokens.md](design-tokens.md). Typography is currently Geist Sans (via `next/font`) as a placeholder; editorial typefaces are chosen in M02.

## Animation

GSAP + ScrollTrigger and Motion are used only in client leaf components, with scoped cleanup and reduced-motion handling, and are never initialised globally. Full rules: [ADR 0003](../decisions/0003-animation-architecture.md). The CSS reduced-motion baseline is already in `globals.css`.

## Dependency philosophy

Install only what the current milestone's code uses, prefer native features, and record every dependency's purpose in [tech-stack.md](tech-stack.md). See [AGENTS.md §3](../../AGENTS.md#3-dependencies).
