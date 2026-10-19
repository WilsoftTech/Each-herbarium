# Tech stack

## Installed

Runtime: Node.js 24 (`engines.node >= 24`). Package manager: npm 11 (lockfile committed).

### Dependencies

| Package | Version | Reason |
|---|---|---|
| `next` | 16.4.2 | Application framework (App Router, Turbopack). |
| `react`, `react-dom` | 19.3.0 | UI runtime required by Next.js. |

### Dev dependencies

| Package | Version | Reason | Added |
|---|---|---|---|
| `typescript` | ^5 | Strict type checking. | M01 (scaffold) |
| `@types/node` | ^24 | Node types matching the Node 24 runtime. Raised from the scaffold's `^20` because Vitest 5 requires `>=22`. | M01 |
| `@types/react`, `@types/react-dom` | ^19 | React types. | M01 (scaffold) |
| `tailwindcss` | ^4 | Styling and design tokens. | M01 (scaffold) |
| `@tailwindcss/turbopack` | ^4 | Tailwind's Turbopack CSS loader, configured in `next.config.ts`. | M01 (scaffold) |
| `eslint` | ^9 | Linting. | M01 (scaffold) |
| `eslint-config-next` | 16.4.2 | Next.js, React, a11y and TypeScript lint rules. | M01 (scaffold) |
| `vitest` | ^5 | Unit tests. Runs in a Node environment with `react-dom/server`, so no jsdom or Testing Library is needed yet. | M01 |
| `@playwright/test` | ^1.64 | Browser end-to-end tests (Chromium only). | M01 |

Deliberately **not** installed in M01: `@vitejs/plugin-react` (Vite compiles TSX natively), `vite-tsconfig-paths` (Vite's built-in `resolve.tsconfigPaths` covers it), `jsdom` and `@testing-library/*` (no interactive components yet; add them in M02 when client components need DOM tests).

## Planned (not installed)

| Technology | Milestone | Purpose |
|---|---|---|
| Animation library (Motion / GSAP) | M02 | Menus, transitions, scroll storytelling |
| Lenis | M02 (if justified) | Smooth scrolling |
| `jsdom` + `@testing-library/react` | M02 | DOM tests for client components |
| Prisma + PostgreSQL | M04 | Content persistence |
| Clerk | M04 | Admin authentication |
| Zod (or equivalent) | M04/M05 | Server-side input validation |
| Resend | M05 | Transactional email |
| Cloudflare / Vercel tooling | M07 | Hosting and media |

Each planned item needs an ADR and a stated reason before it is installed.
