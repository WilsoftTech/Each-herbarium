# Tech stack

## Installed

Runtime: Node.js 24 (`engines.node >= 24`). Package manager: npm 11, with the lockfile committed.

### Dependencies

| Package                    | Version    | Reason                                                                                                                                            | Added     |
| -------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `next`                     | 16.4.2     | Application framework (App Router, Turbopack)                                                                                                     | M01       |
| `react`, `react-dom`       | 19.3.1     | UI runtime (patch update from the scaffold's 19.3.0)                                                                                              | M01       |
| `zod`                      | ^4.6       | Environment validation; content contracts since M03 ([ADR 0006](../decisions/0006-content-contracts-and-placeholders.md)); forms later            | M01 rev 2 |
| `server-only`              | ^0.0.1     | Build-time guard that keeps server modules (`config/env`, `services/*`) out of client bundles                                                     | M01 rev 2 |
| `gsap`                     | ^3.15      | Scroll-linked animation: hero parallax, scroll reveals, page entrances ([ADR 0003](../decisions/0003-animation-architecture.md))                  | M02       |
| `@gsap/react`              | ^2.1       | `useGSAP`: scoped GSAP contexts that clean up on unmount                                                                                          | M02       |
| `motion`                   | ^14.4      | Presence and exit animation for mega menus and the mobile dialog (`LazyMotion` + `domAnimation`)                                                  | M02       |
| `class-variance-authority` | ^0.7       | `Button` variants (shadcn/ui convention)                                                                                                          | M02       |
| `clsx`, `tailwind-merge`   | ^2.1, ^3.7 | `cn()` in `src/lib/utils.ts`: conditional classes with Tailwind conflict resolution                                                               | M02       |
| `@radix-ui/react-slot`     | ^1.5       | `Button asChild`, so links can be styled as buttons                                                                                               | M02       |
| `@prisma/client`           | ^7.10.1    | Typed database client generated from `prisma/schema.prisma` into `src/generated/prisma` ([ADR 0007](../decisions/0007-cms-editorial-workflow.md)) | M04       |
| `@prisma/adapter-pg`       | ^7.10.1    | Prisma 7 driver adapter over `pg` (Neon pooled connection at runtime, plain PostgreSQL in CI); brings `pg`                                        | M04       |
| `better-auth`              | ^1.7.11    | Server Action error type; credentials and sessions use Neon Managed Auth ([ADR 0008](../decisions/0008-admin-authentication.md))                  | M04       |
| `aws4fetch`                | ^1.0.20    | SigV4 signing for the Neon S3 API on `fetch`; ~3 KB instead of the AWS SDK ([ADR 0009](../decisions/0009-media-storage.md))                       | M04       |
| `image-size`               | ^2.0.4     | Reads uploaded image dimensions (and that they decode) without native code                                                                        | M04       |

shadcn/ui setup: `components.json` was written by hand rather than with `shadcn init`, so the CLI could not replace the EACH tokens in `globals.css`. `Button` was then generated with `npx shadcn@4.22.1 add button` and restyled. The CLI also tried to add the `radix-ui` umbrella package and an unrelated npm package called `cn` (a misread alias). Both were removed. Only `@radix-ui/react-slot` is kept. No icon library is installed: the few icons are inline SVGs in `src/components/ui/icons.tsx`.

### Dev dependencies

| Package                                          | Version      | Reason                                                                       | Added     |
| ------------------------------------------------ | ------------ | ---------------------------------------------------------------------------- | --------- |
| `typescript`                                     | ^5           | Strict type checking                                                         | M01       |
| `@types/node`                                    | ^24          | Node types for the Node 24 runtime (Vitest 5 needs `>=22`)                   | M01       |
| `@types/react`, `@types/react-dom`               | ^19          | React types                                                                  | M01       |
| `tailwindcss`, `@tailwindcss/turbopack`          | ^4           | Styling, design tokens, Turbopack CSS loader                                 | M01       |
| `eslint`, `eslint-config-next`                   | ^9, 16.4.2   | Linting (Next.js, React, accessibility, TypeScript rules)                    | M01       |
| `prettier`                                       | ^3.9         | Consistent formatting across human and AI contributors                       | M01 rev 2 |
| `prettier-plugin-tailwindcss`                    | ^0.8         | Deterministic Tailwind class order, which reduces diff noise                 | M01 rev 2 |
| `vitest`                                         | ^5           | Unit tests (Node by default; jsdom per file for interactive components)      | M01       |
| `@playwright/test`                               | ^1.64        | Browser tests (Chromium; desktop, Pixel 7 and tablet emulation)              | M01       |
| `jsdom`                                          | ^30.1        | DOM environment for client component tests (`// @vitest-environment jsdom`)  | M02       |
| `@testing-library/react`, `@testing-library/dom` | ^16.3, ^10.4 | Render and query client components by role                                   | M02       |
| `@testing-library/user-event`                    | ^14.6        | Realistic keyboard and pointer interaction in component tests                | M02       |
| `@axe-core/playwright`                           | ^4.14        | Automated WCAG checks in e2e (every public route, open menus)                | M02       |
| `prisma`                                         | ^7.10.1      | Schema, migrations (`migrate diff` / `migrate deploy`) and client generation | M04       |
| `tsx`                                            | ^4.23        | Runs the seed and command-line scripts with the `@/` path aliases            | M04       |

Deliberately not installed: `@vitejs/plugin-react` and `vite-tsconfig-paths` (Vite covers both natively), `eslint-config-prettier` (`eslint-config-next` has no conflicting formatting rules), `lenis` (native scrolling is kept; [ADR 0003](../decisions/0003-animation-architecture.md)), `lucide-react` (only seven icons are needed), and the `radix-ui` umbrella package.

## Bundle notes (M02 production build)

The homepage's initial JavaScript is about 272 KB gzipped, including the Next.js and React runtime. GSAP and ScrollTrigger account for about 44 KB of that and load only on routes that render a motion leaf. The 404 page loads no GSAP (227 KB). Motion's `domAnimation` feature set is loaded once by the header. Budgets are set in M06.

## Bundle notes (M03 production build)

M03 added no dependencies. Measured in Chromium against `next start`: every script response until network idle, compressed body plus headers, including link prefetches. The result is about 251 KB on `/`, `/herbarium`, `/about` and `/privacy`, and 252 KB on a project page. This method differs from the M02 figure, so do not compare the two directly. GSAP loads on every public route because `PageTransition` in the public template uses it. M06 sets budgets ([M03 verification](../audits/M03-verification.md#bundle)).

## M04 notes

- Neon CLI initialization added `@neon/config` (^1.9.2) for `neon.ts` and `@neon/env` (^1.6.3) for the configuration-aware, read-only `npm run neon:check` probes. `@neondatabase/auth` (0.6.0-beta) supplies the Managed Auth Next server API; its Next peer supports version 16. The requested AI Gateway is omitted with the owner's approval on the Free plan. See [ADR 0010](../decisions/0010-neon-managed-backend.md).
- **Prisma 7.10.1, not `latest`.** On 2026-10-20 the npm `latest` tag of `prisma` pointed at `8.0.0-rc.23`, a release candidate. The stable 7.10.1 is pinned for the CLI and client; move to 8 once it is stable. Prisma 7 needs a driver adapter and does not read `.env` files: `prisma.config.ts` loads `.env.local` itself.
- **Auth:** Neon Managed Auth owns credentials and sessions. The direct `better-auth` dependency remains for the existing Server Action `APIError` contract. The self-hosted Prisma adapter and hooks are no longer used (ADR 0010).
- **`npm audit --omit=dev`: 0 vulnerabilities** after the M04 installs. The 5 high-severity dev-only `braces` advisories from M01 remain (see ROADMAP risks).
- `npm install` warns that `jsdom`'s dependencies want Node ≥ 24.15 (local Node is 24.13). It does not block installation; upgrade Node when convenient.
- Not installed: `@aws-sdk/client-s3` (aws4fetch covers the four S3 calls used), `sharp` (no server-side re-encoding yet), `dotenv` (Node's `util.parseEnv`), `@prisma/adapter-neon` (TCP pooling suits Vercel functions).

## Planned (not installed)

| Technology                   | Milestone | Purpose                                                          |
| ---------------------------- | --------- | ---------------------------------------------------------------- |
| Further shadcn/ui components | M03+      | Added with the CLI only when a page uses them                    |
| Resend                       | M05       | Transactional email                                              |
| Vercel                       | M07       | Hosting ([ADR 0004](../decisions/0004-platform-and-ui-stack.md)) |

Prisma relation reads use the `relationJoins` generator preview feature to avoid repeated network round trips (no model/migration change). See [ADR 0014](../decisions/0014-cms-relation-loading.md); keep this preview setting under review during ORM upgrades.
