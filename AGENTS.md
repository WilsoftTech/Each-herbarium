<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — EACH engineering rules

Rules for every AI coding agent (Codex, Claude Code, others) working in this repository. They are mandatory. Claude Code also follows [CLAUDE.md](CLAUDE.md).

## 1. Repository

- **Project:** EACH — East African Community Herbariums. An independent conservation, herbarium and botanical-knowledge initiative for East Africa, operating first in Uganda.
- **Partner brand:** Bitwiire Herbarium Cafe is an _independent_ partner. Never imply either organisation owns the other. Keep the brands visually and verbally distinct.
- **Stack (installed):** Next.js 16 (App Router, Turbopack, Cache Components), React 19, TypeScript 5 (strict), Tailwind CSS 4, Zod, ESLint 9, Prettier, Vitest, Playwright. npm only.
- **Stack (planned, install only at first use):** shadcn/ui, GSAP + ScrollTrigger, Motion (M02); Prisma + Neon, Cloudflare R2 (M04); Resend (M05); Vercel hosting. See [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) and [ADR 0004](docs/decisions/0004-platform-and-ui-stack.md).
- **Architecture:** a modular monolith ([overview](docs/architecture/overview.md), [ADR 0002](docs/decisions/0002-modular-monolith.md)). **Folders:** [docs/architecture/folder-structure.md](docs/architecture/folder-structure.md).
- **Current phase:** see [ROADMAP.md](ROADMAP.md). Work only on the current milestone.

## 2. Operating rules

1. **Inspect before editing.** Read the files you will change and their callers.
2. **Reuse before creating.** Check [docs/components/inventory.md](docs/components/inventory.md) and `src/components/` first.
3. **Smallest safe change.** No unrelated refactors, renames or formatting churn.
4. **Validate before committing.** Run the checks in §5.
5. **Never invent results.** Report only what a command actually printed. Use `NOT VERIFIED` when something was not run.
6. **No production changes** (deploys, DNS, databases, third-party dashboards, GitHub settings) without explicit approval.
7. **No destructive operations** (data deletion, migrations that drop data, `git reset --hard`, force-push) without explicit approval.

## 3. Dependencies

- **npm only.** Never use pnpm, yarn or bun. Commit `package-lock.json`.
- Install a package only when code in the **current** milestone imports it. Planned is not a reason.
- Before installing, confirm: no existing package or native API covers it; it supports the installed Next/React versions; it is the smallest reasonable option.
- Record every new dependency and its reason in [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) in the same commit.
- Never use `npm audit fix --force` or `--legacy-peer-deps` without approval; resolve conflicts properly.

## 4. Code rules

### Components

- Search before creating. Extend an existing component when the change is natural; create a new one only for a genuinely different responsibility.
- One primitive per job: one `Button`, one `Container`, one `SectionHeading`, one navigation config. No near-duplicates.
- Do not build "universal" components with sprawling conditional props to avoid a justified specialised component.
- Style with semantic design tokens (`bg-background`, `text-foreground`, `text-primary`, `text-accent`, `text-muted-foreground`, `border-border`; dark sections use `data-surface="dark"`). Never hardcode brand hex values in components. See [design-tokens.md](docs/architecture/design-tokens.md).
- shadcn/ui components are added with the CLI into `src/components/ui/` and must keep the EACH tokens.
- Accessibility is required: semantic HTML, one `h1` per page, keyboard operability, visible focus, text alternatives, WCAG 2.2 AA contrast, and `prefers-reduced-motion` respected for all animation.
- Add every new reusable component to the inventory in the same commit.

### Engineering

- **Server Components by default.** Add `"use client"` only to the smallest leaf that needs state, effects, browser APIs or animation. Never mark a layout or page client-side for a nested need.
- Keep server-only code (secrets, database, email) out of client modules; use the `server-only` package when such modules appear.
- TypeScript strict mode stays on. No `any`, no `@ts-ignore` without a written reason.
- Organise business capabilities as feature modules (`src/features/<feature>/`, public API via `index.ts`); see [src/features/README.md](src/features/README.md). Shared layers (`components`, `services`, `validation`, `config`, `lib`) never import features.
- Public routes live in `src/app/(public)/`, admin in `src/app/(admin)/admin/`. **Every admin page, Server Action and Route Handler calls `requireAdmin()`** from `@/services/admin-auth`. Never rely on layout checks.
- Read environment variables only through `@/config/env` (validated by `@/validation/env`). Never read `process.env` directly elsewhere. Never put secrets in `NEXT_PUBLIC_` variables.
- Animation follows [ADR 0003](docs/decisions/0003-animation-architecture.md): client leaf components only, no global initialisation, `useGSAP` with a scope, server renders the visible final state, and reduced motion is handled in CSS, GSAP (`gsap.matchMedia`) and Motion (`MotionConfig reducedMotion="user"`).
- Do not fabricate institutional information (staff, partners, statistics, history, plant claims). Use clearly marked placeholders and ask.
- Validate all external input (forms, params, webhooks) on the server. Authorise protected operations on the server.
- No secrets in source control. Document every environment variable in `.env.example` without real values.
- Do not create empty folders, placeholder `index.ts` files, stub components or fake integrations.
- No premature abstractions: no global state, context providers or design patterns until a real need exists.
- **Brand assets:** the original EACH logo is authoritative. Never redraw, recolour, distort or substitute it. Never download logos from the internet.
- Do not copy Mercedes-Benz branding, code, assets or exact layouts. Take inspiration from interaction quality only.

## 5. Testing

Run after every change, before every commit:

```bash
npm run format:check   # npm run format to fix
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e   # needs a fresh build; first run: npx playwright install chromium
```

- Add or update tests for behaviour you change. Unit tests live in `tests/unit/`, browser tests in `tests/e2e/`.
- Report failures exactly. Never mark a milestone complete while any exit criterion fails.

## 6. Git

- Conventional commits: `type(scope): summary`, e.g. `feat(m02): add mega menu`.
- Commit only verified, logically complete work. Stage specific files and inspect `git diff --staged` before committing.
- Never force-push, rewrite shared history, push, or create remotes without approval.
- Never claim a commit exists until `git log` shows it.

## 7. Documentation

Documentation must describe the repository as it actually is.

- Update docs in the same commit as the code they describe.
- On milestone completion follow [docs/milestones/README.md](docs/milestones/README.md#completion-checklist).
- Record significant decisions as ADRs in [docs/decisions/](docs/decisions/README.md).
- Keep the component inventory and tech-stack lists current.
- Record open risks in the milestone document and in `ROADMAP.md`.
