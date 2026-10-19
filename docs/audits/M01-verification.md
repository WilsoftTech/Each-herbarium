# M01 verification

- **Date:** 2026-10-19
- **Environment:** Windows 11 Pro, Node 24.12.0, npm 11.6.2, Git Bash
- **Install:** `node_modules` deleted, then `npm ci`. Success.

## Results

| Check                           | Command                                              | Result                                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean install                   | `npm ci`                                             | Pass                                                                                                                                                                 |
| Lockfile on Linux (CI platform) | `npm ci --dry-run --os=linux --cpu=x64 --libc=glibc` | Pass (exit 0)                                                                                                                                                        |
| Typecheck                       | `npm run typecheck`                                  | Pass (exit 0) — "Types generated successfully"; `tsc --noEmit` no errors                                                                                             |
| Lint                            | `npm run lint`                                       | Pass (exit 0), no findings                                                                                                                                           |
| Unit                            | `npm test`                                           | Pass — Test Files 1 passed (1); Tests 3 passed (3)                                                                                                                   |
| Build                           | `npm run build`                                      | Pass (exit 0) — "Compiled successfully"; `/` and `/_not-found` static                                                                                                |
| E2E                             | `npm run test:e2e`                                   | Pass — 2 passed (Chromium)                                                                                                                                           |
| Tailwind tokens                 | built CSS in `.next/static`                          | `.text-primary{color:var(--color-botanical-green)}` and `--color-botanical-green:#176b28` present                                                                    |
| Runtime dependency audit        | `npm audit --omit=dev`                               | found 0 vulnerabilities                                                                                                                                              |
| Full dependency audit           | `npm audit`                                          | 5 high (dev-only): `braces` via `micromatch` → `fast-glob` → `@next/eslint-plugin-next` → `eslint-config-next`. Not fixed; the only automatic fix downgrades to v14. |
| GitHub Actions                  | —                                                    | NOT VERIFIED (no remote)                                                                                                                                             |

## Tests

- `tests/unit/home-page.test.tsx`: renders the homepage on the server. It asserts a single `<main>`, a single `h1` containing the organisation name, and that semantic token classes are used with no raw hex colours.
- `tests/e2e/navigation.spec.ts`: checks the homepage title and heading. It then requests an unknown route, asserts HTTP 404 and the not-found heading, follows "Return to the homepage", and asserts it arrives back at `/`.

## Brand asset

`public/images/logo.jpeg` was added during the session. It was moved unmodified to `public/brand/each-logo.jpeg`; the SHA-256 is identical before and after (`e2cef34e…7036187`). Colour samples are recorded in [design-tokens.md](../architecture/design-tokens.md).

## Issues found and fixed during verification

- `npm ci` initially failed: the lockfile, built incrementally, was missing optional `@emnapi/*` WASM entries. The lockfile was regenerated from scratch, and `npm ci` then passed on Windows and in a simulated Linux run.
- `npm install -D vitest` conflicted with the scaffold's `@types/node@^20`. Resolved by moving to `@types/node@^24` (matching the runtime), not by `--legacy-peer-deps`.

## Revision 2 (revised brief)

- **Date:** 2026-10-19, same environment. Clean `npm ci` (Windows) and Linux dry run: pass.
- `npm run format:check`: all files formatted. `npm run typecheck`: exit 0. `npm run lint`: no findings.
- `npm test`: Test Files 2 passed (2); Tests 10 passed (10). Homepage render (3) and env validation (7: defaults, explicit URL, Vercel production, Vercel preview, 3 rejection cases).
- `npm run build`: compiled successfully; `/`, `/_not-found` and `/admin` prerendered static.
- `npm run test:e2e`: 4 passed. Navigation (2), security headers, admin denial (404, no admin heading, no admin title, all robots tags `noindex`).
- `SITE_URL="not a url" npm run build`: exit 1, `Invalid environment variables: ✖ Invalid URL → at SITE_URL`.
- Client bundles (`.next/static`): 0 files contain env-validation or `requireAdmin` identifiers.
- `npm audit --omit=dev`: 0 vulnerabilities. Full audit: the same 5 high, dev-only `braces` advisories as before.

### Issues found and fixed

- The first admin e2e run showed the page's `<title>` ("Administration | EACH") in the 404 response. Page metadata is resolved even when the page calls `notFound()`. The title was removed, and an e2e assertion now guards against it; a rebuild confirmed 0 occurrences of "administration" in the prerendered admin output.
- The robots assertion was tightened. Next.js adds its own `noindex` tag on 404s, so the test now checks that no robots tag lacks `noindex`.
