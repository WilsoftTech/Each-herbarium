# 0001. Foundation stack and minimal test tooling

- **Status:** Accepted
- **Date:** 2026-10-19
- **Milestone:** M01

## Context

EACH needs a lightweight, server-first foundation that AI agents can extend safely. The project brief requires npm, Next.js App Router, TypeScript strict mode, Tailwind CSS, ESLint, Vitest and Playwright, and forbids installing dependencies before they are used.

## Decision

1. **Scaffold** with `create-next-app@latest` (Next.js 16.4.2, React 19.3, Tailwind CSS 4, ESLint 9), keeping its defaults: Turbopack, `cacheComponents`, `partialPrefetching` and the `@tailwindcss/turbopack` loader.
2. **Tokens** live in `globals.css` via Tailwind v4 `@theme`. Raw brand colours are wrapped in semantic tokens, and components use only the semantic ones. There is no `tailwind.config` file.
3. **Unit tests** run Vitest in a Node environment and render Server Components with `react-dom/server`. Vite handles TSX and `tsconfig` paths natively, so `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom` and Testing Library are not installed. DOM tooling is added in M02, when client components need it.
4. **E2E tests** use Playwright with Chromium only, against a production build (`next start` on port 3100).
5. **`@types/node` is `^24`** to match the Node 24 runtime and satisfy Vitest 5's peer range, instead of `--legacy-peer-deps`.
6. **Typecheck** runs `next typegen` before `tsc`, because the route types (`LayoutProps`, `PageProps`) are generated.

## Consequences

- The dependency footprint is small. Interactive DOM testing requires adding `jsdom` and Testing Library later (planned for M02).
- Async Server Components cannot be unit-tested with this setup; cover them with Playwright.
- Cache Components semantics apply to all future data fetching. Agents must follow the bundled Next.js docs, not older patterns.
