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

## Verification

```bash
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
```

## Verification record

Run on 2026-10-19, Windows 11, Node 24.12.0, npm 11.6.2.

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | Pass. Route types generated; `tsc --noEmit` reported no errors. |
| Lint | `npm run lint` | Pass. No findings. |
| Unit | `npm test` | Pass. 1 file, 3 tests passed. |
| Build | `npm run build` | Pass. `/` and `/_not-found` prerendered as static. |
| E2E | `npm run test:e2e` | Pass. 2 passed (Chromium). |
| CI on GitHub | — | NOT VERIFIED. No remote repository. |

Detailed evidence: [docs/audits/M01-verification.md](../audits/M01-verification.md).

**Milestone commit:** recorded in the follow-up commit (see `git log --grep "chore(m01)"`).

## Risks

- **Logo is raster only** (JPEG, white background). Tokens are provisional (see [overview](../architecture/overview.md#design-tokens)). A vector or transparent master is needed in M02.
- **`npm audit`:** 5 high-severity advisories in `braces` via `eslint-config-next` (dev-only). The auto-fix downgrades Next's ESLint config to v14, so it was not applied. Re-check in M06.
- **CI not run remotely.** Becomes verifiable once a GitHub remote is approved and configured.
- **Default branch is `master`** (local Git default). Rename to `main` before the first push, if preferred. CI triggers on both.
