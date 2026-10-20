# 0006. Content contracts, static sources and visible placeholders

- **Status:** Accepted. The static sources were replaced by the CMS in M04 ([ADR 0007](0007-cms-editorial-workflow.md)); the contracts and placeholder rules still apply.
- **Date:** 2026-10-19
- **Milestone:** M03

## Context

M03 builds every public page before EACH has supplied most of its institutional content: no projects, publications, staff, partners (other than Bitwiire Herbarium Cafe), impact figures, contact details or photography. AGENTS.md forbids inventing that information. The pages still need realistic structure for design review, and M04 will replace the static content with a database-backed CMS. Pages must not need rewriting when it does.

## Decision

**Content contracts.** Each CMS-bound content type is a feature module with a Zod schema (`src/features/<feature>/schema.ts`): `projects`, `resources` (publications, guides, stories) and `partners`. Shared pieces live in `src/validation/content.ts`: the media asset schema (the `MediaAsset` type is inferred from it), slugs and the `published | placeholder` status.

**One source per type, behind async queries.** Each feature's `data.ts` is the only M03 source. Pages read it only through `server-only` async queries in `queries.ts` (`listProjects`, `getProject`, `listResources` and similar), which validate the data with the schema. In M04 the query bodies change to database reads; the signatures, schemas and pages stay the same. Institutional copy that is not CMS-bound (programme descriptions, ecosystems, reference specimens) lives in typed modules in `src/content/`.

**Visible placeholders from one register.** Everything EACH has not supplied or approved is an entry in `src/content/pending.ts`, marked `missing` or `draft`. Pages show it with `PendingContent`, which renders "Awaiting content from EACH" or "Draft for EACH review" and a `data-pending` attribute. `docs/content/awaiting-approval.md` mirrors the register, and a unit test keeps the two in step and fails on unused entries.

**Placeholder entries never pass as fact.** Placeholder projects and resources:

- are titled "Placeholder …" and carry `status: "placeholder"`;
- have no location, dates, authors, partners or story;
- describe only the landscape shown in the photograph;
- are labelled on every card and page, are excluded from structured data, and their detail pages are `noindex`.

**Static output is enforced.** `(public)/layout.tsx` sets `ensureStatic = "navigation"`, so `next build` fails if any public route needs request-time rendering. It also means unknown slugs render before the response starts, so `notFound()` returns a real 404. Under Partial Prerendering they would otherwise get a streamed shell with a 200 status.

## Consequences

- M04 replaces the bodies of `queries.ts` (and moves `data.ts` into seed data) without touching pages or components. The `status` field maps onto the CMS draft/publish workflow.
- Reviewers can find every outstanding item on a page through `[data-pending]`, and EACH has a single checklist.
- A placeholder project or resource can be swapped for a real one by changing its data only; the page shows real facts as soon as the fields are filled.
- No route-level `loading.tsx`: with every route prerendered, it would only wrap pages in a Suspense boundary whose content is streamed hidden and revealed by script. That hides content without JavaScript (measured in M03) and breaks ADR 0003, rule 4.
