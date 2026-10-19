# M01 verification

- **Date:** 2026-10-19
- **Environment:** Windows 11 Pro, Node 24.12.0, npm 11.6.2, Git Bash
- **Install:** `node_modules` deleted, then `npm ci`. Success.

## Results

| Check | Command | Result |
|---|---|---|
| Clean install | `npm ci` | Pass |
| Lockfile on Linux (CI platform) | `npm ci --dry-run --os=linux --cpu=x64 --libc=glibc` | Pass (exit 0) |
| Typecheck | `npm run typecheck` | Pass (exit 0) — "Types generated successfully"; `tsc --noEmit` no errors |
| Lint | `npm run lint` | Pass (exit 0), no findings |
| Unit | `npm test` | Pass — Test Files 1 passed (1); Tests 3 passed (3) |
| Build | `npm run build` | Pass (exit 0) — "Compiled successfully"; `/` and `/_not-found` static |
| E2E | `npm run test:e2e` | Pass — 2 passed (Chromium) |
| Tailwind tokens | built CSS in `.next/static` | `.text-primary{color:var(--color-botanical-green)}` and `--color-botanical-green:#176b28` present |
| Runtime dependency audit | `npm audit --omit=dev` | found 0 vulnerabilities |
| Full dependency audit | `npm audit` | 5 high (dev-only): `braces` via `micromatch` → `fast-glob` → `@next/eslint-plugin-next` → `eslint-config-next`. Not fixed; the only automatic fix downgrades to v14. |
| GitHub Actions | — | NOT VERIFIED (no remote) |

## Tests

- `tests/unit/home-page.test.tsx`: renders the homepage on the server. It asserts a single `<main>`, a single `h1` containing the organisation name, and that semantic token classes are used with no raw hex colours.
- `tests/e2e/navigation.spec.ts`: checks the homepage title and heading. It then requests an unknown route, asserts HTTP 404 and the not-found heading, follows "Return to the homepage", and asserts it arrives back at `/`.

## Brand asset

`public/images/logo.jpeg` was added during the session. It was moved unmodified to `public/brand/each-logo.jpeg`; the SHA-256 is identical before and after (`e2cef34e…7036187`). Colour samples are recorded in [overview.md](../architecture/overview.md#design-tokens).

## Issues found and fixed during verification

- `npm ci` initially failed: the lockfile, built incrementally, was missing optional `@emnapi/*` WASM entries. The lockfile was regenerated from scratch, and `npm ci` then passed on Windows and in a simulated Linux run.
- `npm install -D vitest` conflicted with the scaffold's `@types/node@^20`. Resolved by moving to `@types/node@^24` (matching the runtime), not by `--legacy-peer-deps`.
