# M01 — Engineering foundation

**Status:** COMPLETED

## Goal

A clean, lightweight, verified Next.js foundation with engineering rules, documentation, tests and CI, ready for incremental development by Claude Code and Codex.

## Scope

- Next.js App Router project in the repository root, using npm, TypeScript strict mode, Tailwind CSS and ESLint.
- Provisional semantic design tokens.
- Minimal homepage placeholder and 404 page.
- Vitest unit test and Playwright browser test.
- GitHub Actions CI workflow.
- AGENTS.md, CLAUDE.md, ROADMAP.md and the `docs/` knowledge base.

## Out of scope

Animations, mega menus, real page content, database, CMS, authentication, forms, email, deployment.

## Tasks

- [x] Audit the folder: empty, no Git repository, Node 24.12.0, npm 11.6.2, global Git identity present.
- [x] Scaffold with `create-next-app` (Next 16.4.2). The folder name `Each-herbarium` is not a valid npm package name, so the app was scaffolded as `each` in a temporary folder and copied in. No nested app folder.
- [x] Initialise Git (`master` branch). No remote.
- [x] Remove unused scaffold assets (Next.js and Vercel SVGs) and the unused Geist Mono font.
- [x] Add design tokens, `siteConfig`, `Container`, homepage placeholder and `not-found`.
- [x] Add Vitest and Playwright with one meaningful test each.
- [x] Add `typecheck`, `test` and `test:e2e` scripts; change `lint` to `eslint .`.
- [x] Add CI workflow.
- [x] Write documentation.
- [x] Logo: the original file was added to `public/images/logo.jpeg` during the session. It was moved, byte-identical (SHA-256 verified), to `public/brand/each-logo.jpeg`, and its colours were sampled against the provisional tokens.

## Acceptance criteria

- [x] Next.js initialises successfully inside the existing project folder.
- [x] npm is the only package manager (only `package-lock.json` exists).
- [x] `package-lock.json` exists and is committed.
- [x] TypeScript strict mode is enabled (`"strict": true`).
- [x] Tailwind CSS is operational (token utilities such as `text-primary` compile and render).
- [x] Folder architecture is established and documented.
- [x] `AGENTS.md` exists and is complete.
- [x] `CLAUDE.md` exists and is complete.
- [x] `ROADMAP.md` exists and reflects real status.
- [x] `docs/` contains the required architecture and milestone documents.
- [x] Component reuse policy documented (AGENTS.md §4, inventory).
- [x] Dependency installation policy documented (AGENTS.md §3, tech-stack.md).
- [x] Git initialised.
- [x] CI configuration exists (`.github/workflows/ci.yml`). It has not run on GitHub yet; see Risks.
- [x] Baseline tests run successfully.
- [x] Lint passes.
- [x] Typecheck passes.
- [x] Production build passes.
- [x] No unnecessary packages installed (see [tech-stack.md](../architecture/tech-stack.md)).
- [x] No credentials committed (no `.env` files; `.env.example` has no values).
- [x] Documentation reflects the implemented foundation.
- [x] M01 marked completed only after verification.
- [x] Verified M01 Git commit exists (see Verification record).

## Revision 2 (revised M01 brief, 2026-10-19)

The owner issued a revised M01 brief: a modular monolith, route groups, environment validation, formatting, animation architecture, and the shadcn/ui, GSAP, Motion, Neon, R2, Resend and Vercel stack. It was applied as a delta on top of `fca40b7`.

### Tasks

- [x] Re-audit the repository: clean tree at `fca40b7`, no changes since the M01 commit.
- [x] Modular monolith: `features/` (module contract), `services/`, `validation/`, `config/` ([ADR 0002](../decisions/0002-modular-monolith.md)).
- [x] Route groups: `(public)` for the homepage; `(admin)/admin` guarded by server-side `requireAdmin()`, which denies with 404 and no revealing metadata.
- [x] Environment validation: Zod schema plus `parseServerEnv()`, `server-only` `config/env.ts`, `SITE_URL` with Vercel fallbacks, `metadataBase`, `.env.example`.
- [x] Stricter TypeScript: `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `noImplicitOverride`.
- [x] Formatting: Prettier with Tailwind class sorting; `format` and `format:check` scripts; added to CI.
- [x] Tokens: shadcn/ui-compatible semantic names, a dark cinematic surface (`data-surface="dark"`), motion easings and durations, measured contrast ([design-tokens.md](../architecture/design-tokens.md)).
- [x] Animation architecture and reduced-motion conventions ([ADR 0003](../decisions/0003-animation-architecture.md)); CSS reduced-motion baseline.
- [x] Baseline security headers; `X-Powered-By` disabled.
- [x] Platform and UI stack recorded ([ADR 0004](../decisions/0004-platform-and-ui-stack.md)); deployment assumptions updated for Vercel.
- [x] Tests: env validation unit tests, security-header and admin-denial e2e tests.

### Deliberately deferred (per "introduce dependencies when needed")

- **shadcn/ui, GSAP, `@gsap/react`, Motion:** no component uses them yet. They are installed in M02 with the first consumer; conventions and token compatibility are ready now.
- **Prisma/Neon, R2, Resend, Vercel project:** M04, M05 and M07.

### Additional acceptance criteria

- [x] Public and admin route groups exist; admin is denied server-side and reveals nothing (e2e).
- [x] Invalid environment configuration fails with a readable error (unit).
- [x] `.env.example` documents every variable; no secrets committed.
- [x] Formatting enforced locally and in CI.
- [x] Animation and reduced-motion conventions documented; CSS baseline in place.
- [x] ADRs recorded for architecture, animation and platform.
- [x] No critical configuration or security issue remains (see risks for non-critical items).

## Verification

```bash
npm run format:check && npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
```

## Verification record

Run on 2026-10-19, Windows 11, Node 24.12.0, npm 11.6.2.

| Check        | Command             | Result                                                          |
| ------------ | ------------------- | --------------------------------------------------------------- |
| Typecheck    | `npm run typecheck` | Pass. Route types generated; `tsc --noEmit` reported no errors. |
| Lint         | `npm run lint`      | Pass. No findings.                                              |
| Unit         | `npm test`          | Pass. 1 file, 3 tests passed.                                   |
| Build        | `npm run build`     | Pass. `/` and `/_not-found` prerendered as static.              |
| E2E          | `npm run test:e2e`  | Pass. 2 passed (Chromium).                                      |
| CI on GitHub | —                   | NOT VERIFIED. No remote repository.                             |

### Revision 2

Run on 2026-10-19 after deleting `node_modules` and `.next` and running `npm ci`.

| Check                                  | Command                                              | Result                                                                  |
| -------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Clean install                          | `npm ci`                                             | Pass (exit 0)                                                           |
| Linux lockfile                         | `npm ci --dry-run --os=linux --cpu=x64 --libc=glibc` | Pass (exit 0)                                                           |
| Format                                 | `npm run format:check`                               | Pass. "All matched files use Prettier code style!"                      |
| Typecheck                              | `npm run typecheck`                                  | Pass (exit 0)                                                           |
| Lint                                   | `npm run lint`                                       | Pass. No findings.                                                      |
| Unit                                   | `npm test`                                           | Pass. 2 files, 10 tests passed.                                         |
| Build                                  | `npm run build`                                      | Pass. `/`, `/_not-found`, `/admin` static.                              |
| E2E                                    | `npm run test:e2e`                                   | Pass. 4 passed (Chromium).                                              |
| Invalid env fails build                | `SITE_URL="not a url" npm run build`                 | Fails as intended (exit 1, "Invalid environment variables … SITE_URL"). |
| Server code absent from client bundles | grep `.next/static` for env and auth identifiers     | 0 matches                                                               |
| Runtime dependency audit               | `npm audit --omit=dev`                               | 0 vulnerabilities                                                       |
| CI on GitHub                           | —                                                    | NOT VERIFIED. No remote repository.                                     |

Detailed evidence: [docs/audits/M01-verification.md](../audits/M01-verification.md).

**Milestone commits:** `0de7d2c` (initial). Revision 2 is in the commit `feat(m01): …`, recorded in [ROADMAP.md](../../ROADMAP.md).

## Risks

- **Logo is raster only** (JPEG, white background). Tokens are provisional (see [design-tokens.md](../architecture/design-tokens.md)). A vector or transparent master is needed in M02.
- **`npm audit`:** 5 high-severity advisories in `braces` via `eslint-config-next` (dev-only). The auto-fix downgrades Next's ESLint config to v14, so it was not applied. Re-check in M06.
- **CI not run remotely.** Becomes verifiable once a GitHub remote is approved and configured.
- **shadcn/ui, GSAP and Motion are not installed yet** (deferred to first use in M02). The conventions are documented and untested until then.
- **Admin identity provider undecided.** `/admin` is deny-all until M04.
- **Default branch is `master`** (local Git default). Rename to `main` before the first push, if preferred. CI triggers on both.
