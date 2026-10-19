# Tech stack

## Installed

Runtime: Node.js 24 (`engines.node >= 24`). Package manager: npm 11, with the lockfile committed.

### Dependencies

| Package              | Version | Reason                                                                                        | Added     |
| -------------------- | ------- | --------------------------------------------------------------------------------------------- | --------- |
| `next`               | 16.4.2  | Application framework (App Router, Turbopack)                                                 | M01       |
| `react`, `react-dom` | 19.3.1  | UI runtime (patch update from the scaffold's 19.3.0)                                          | M01       |
| `zod`                | ^4.6    | Environment validation now; form and content validation later                                 | M01 rev 2 |
| `server-only`        | ^0.0.1  | Build-time guard that keeps server modules (`config/env`, `services/*`) out of client bundles | M01 rev 2 |

### Dev dependencies

| Package                                 | Version    | Reason                                                       | Added     |
| --------------------------------------- | ---------- | ------------------------------------------------------------ | --------- |
| `typescript`                            | ^5         | Strict type checking                                         | M01       |
| `@types/node`                           | ^24        | Node types for the Node 24 runtime (Vitest 5 needs `>=22`)   | M01       |
| `@types/react`, `@types/react-dom`      | ^19        | React types                                                  | M01       |
| `tailwindcss`, `@tailwindcss/turbopack` | ^4         | Styling, design tokens, Turbopack CSS loader                 | M01       |
| `eslint`, `eslint-config-next`          | ^9, 16.4.2 | Linting (Next.js, React, accessibility, TypeScript rules)    | M01       |
| `prettier`                              | ^3.9       | Consistent formatting across human and AI contributors       | M01 rev 2 |
| `prettier-plugin-tailwindcss`           | ^0.8       | Deterministic Tailwind class order, which reduces diff noise | M01 rev 2 |
| `vitest`                                | ^5         | Unit tests (Node environment, `react-dom/server` rendering)  | M01       |
| `@playwright/test`                      | ^1.64      | Browser tests (Chromium)                                     | M01       |

Deliberately not installed: `@vitejs/plugin-react`, `vite-tsconfig-paths` (Vite covers both natively), `jsdom` and Testing Library (no interactive components yet), `eslint-config-prettier` (`eslint-config-next` has no conflicting formatting rules).

## Planned (not installed)

| Technology                                    | Milestone       | Purpose                                                                                  |
| --------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------- |
| shadcn/ui (and the dependencies its CLI adds) | M02             | Accessible UI primitives                                                                 |
| `gsap`, `@gsap/react`                         | M02             | Scroll storytelling, timelines ([ADR 0003](../decisions/0003-animation-architecture.md)) |
| `motion`                                      | M02 (if useful) | Presence and layout animation in menus                                                   |
| `jsdom`, `@testing-library/react`             | M02             | DOM tests for client components                                                          |
| Prisma + Neon PostgreSQL                      | M04             | Content persistence                                                                      |
| Cloudflare R2 (S3-compatible client)          | M04             | Media storage                                                                            |
| Admin identity provider                       | M04             | To be decided by ADR                                                                     |
| Resend                                        | M05             | Transactional email                                                                      |
| Vercel                                        | M07             | Hosting ([ADR 0004](../decisions/0004-platform-and-ui-stack.md))                         |
