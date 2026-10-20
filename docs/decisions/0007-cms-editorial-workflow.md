# 0007. Custom CMS on Prisma + Neon, editorial workflow and cache invalidation

- **Status:** Accepted
- **Date:** 2026-10-20
- **Milestone:** M04

## Context

M04 must let EACH staff manage public content without code changes, with a draft → review → published → archived workflow and no leaks of unpublished content. ADR 0004 fixes PostgreSQL on Neon through Prisma; ADR 0006 put every CMS-bound type behind `server-only` queries and Zod contracts so the source could change without touching pages. Public routes are fully static (`ensureStatic = "navigation"`).

## Decision

**A custom admin inside the app, not a headless CMS.** The data stays in EACH's own Neon database, the admin reuses the design tokens and the modular monolith, and nothing extra is hosted or billed. Admin routes live in `src/app/(admin)/admin/`; each content feature owns its admin module (`features/<feature>/admin/`).

**Data model** (`prisma/schema.prisma`, migration `20261020120000_init`): pages (policy prose), programmes, projects (with programme, partner and gallery joins), articles (publications, guides, stories), resources (downloads), partners, team members, media assets, site settings (one row), inquiries (written by M05 forms), audit events, and the Better Auth tables. Every editorial row carries `status`, `placeholder`, `version`, `publishedAt`, timestamps and actor ids. Hand-written CHECK constraints enforce slug format, roles, the single settings row, `publishedAt` on published rows, team consent before publication and independent partner relationships; a trigger makes the audit table append-only. Media referenced by content cannot be deleted (`ON DELETE RESTRICT`).

**Workflow.** One pure rule set (`features/cms/workflow.ts`): editors create drafts and submit them; reviewers and administrators approve (only from In review), return to draft, unpublish, archive and restore; only administrators delete, and only drafts or archived items. Content in review or published is editable only by roles that can publish, and such edits go live at once. Every transition and save runs in a transaction with an optimistic-lock check (`version`) and writes an audit event. Approving re-validates the item against its public contract, so nothing that would break a public page can be published.

**Public reads.** Feature queries keep their M03 signatures but read `status = PUBLISHED` rows inside `"use cache"` with `cacheLife("max")` and a tag per collection they read (`lib/cache-tags.ts`). Related rows are filtered too (a draft partner never appears on a published project). Placeholders from ADR 0006 became published rows flagged `placeholder`.

**Invalidation.** Any change that adds or removes live content, or edits it, calls `updateTag` for the collection (read-your-own-writes). Collection-level tags are coarse but correct: a partner change expires every page showing partners. Detail routes prerender published slugs and render new ones on first request (`generateStaticParams` returns a sentinel when a collection is empty, as Cache Components requires at least one entry).

**Preview.** Drafts are previewed at `/admin/preview/<type>/<id>`, behind `requireAdmin()`, rendered per request with the same components as the public page. Draft data never passes through public routes, caches or metadata, so Next.js draft mode is not used.

**Seed.** `prisma/seed.ts` migrates the M03 static content (16 licensed photographs as `STATIC` media, 4 programmes, placeholder projects and articles, Bitwiire, three policy pages). It only creates missing rows, so re-running it never overwrites editorial work.

## Consequences

- The build needs `DATABASE_URL` (pages prerender from the database). CI runs a PostgreSQL service container.
- Per-collection tags over-invalidate slightly; acceptable at EACH's content volume. On a multi-instance host, tag invalidation relies on the platform's shared cache (Vercel); self-hosting would need a cache handler.
- Reviewers can approve their own submissions (small team). Revisit if EACH wants strict separation of duties.
- Editing published content changes the live page immediately; there is no separate "pending revision" copy.
- `instant = false` on the admin layout: admin pages block on the session by design.
