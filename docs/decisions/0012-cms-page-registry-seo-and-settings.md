# 0012. Page registry, homepage sections, SEO fields and site settings

- **Status:** Accepted
- **Date:** 2026-10-21
- **Milestone:** M04
- Extends [ADR 0007](0007-cms-editorial-workflow.md) (CMS) and [ADR 0011](0011-content-revisions.md) (revisions).
- **Amended by [ADR 0013](0013-designed-sections-in-the-cms.md):** the designed sections below landing-page headers, the founding programme pages' sections and the homepage landscapes and regional presence are now managed in the CMS. Statements below that call them code-owned are superseded.

## Context

After ADR 0007 only three policy pages, the content collections and the contact details came from the CMS. The homepage and fifteen other fixed pages kept their headlines, introductions, images and metadata in code, so EACH could not change them without a deployment. The M04 brief requires every applicable piece of public content to have an administrative source, with a controlled structure that preserves the cinematic compositions, no arbitrary page builder, SEO control, a published-only sitemap, and administrator-managed navigation, footer and defaults. The original logo must never be replaceable or distorted through the CMS (AGENTS.md §4).

## Decision

**A typed page registry, not a page builder.** `src/features/pages/registry.ts` lists every fixed route whose words are managed (19: the homepage, 15 landing pages, 3 policy pages) with its route, its kind (`home`, `landing`, `prose`) and how it uses its image (`header` or `sharing`, and `imageRequired` where the layout opens with a full-bleed photograph). The route's composition stays in code; the CMS supplies the words. The `Page` model gained `hero_image_id`, `content` (JSON), `seo_title` and `noindex`. The four designed programme pages are driven by their `Programme` records instead.

- `prose`: header plus rich-text body.
- `landing`: eyebrow, title, lead, image and SEO. The designed sections below the header remain code-owned copy (see the integration matrix); the records they list (programmes, projects, articles, partners, team) are CMS collections.
- `home`: the page fields drive the cinematic hero; `content` holds the typed sections (`homeContentSchema`, `src/features/pages/home-content.ts`): every heading, text, image, link and CTA, plus the order and visibility of the nine sections after the introduction. The introduction stays first because the hero's scroll cue targets it. The homepage never copies other records: programmes, featured projects (`projects.featured`) and featured articles (`articles.featured`) are the published records, with "first three" as the fallback.

Seed and data migrations moved the existing copy word for word, so the rendered pages are unchanged (`tests/unit/pages.test.tsx` checks the M03 copy). There is no competing copy in code.

**Links are validated against the approved route list** (`src/config/routes.ts`, `isApprovedHref`): a CMS link is an approved site path, a collection detail path (`/projects|/resources|/our-work/<slug>`) or an https URL. Section images are media ids in JSON; publishing checks they are uploaded and have alt text and captions, and the media library's usage check scans page content (and pending revisions), so an image in use cannot be deleted.

**SEO fields.** Programmes, projects and articles gained `seo_title`, `seo_description`, `noindex` and `featured`; pages have `seo_title`, `noindex` and their description. Metadata helpers (`metadataForPage`, `programmeMetadata`, detail routes) use them, fall back to title and summary, and always set `noindex` on placeholders. The default sharing image is a setting. `src/app/sitemap.ts` lists only published, non-placeholder, indexable records from the same cached, tagged queries as the pages, so publishing or archiving updates it with them; `robots.ts` disallows `/admin`.

**Content fields.** Programmes: category, objectives, rich-text body, featured. Projects: country, start and end dates (CHECK end ≥ start), an operational status enum (`PLANNED`, `ACTIVE`, `COMPLETED`, `ON_HOLD`, nullable so nothing is claimed until confirmed) distinct from editorial status, objectives, activities, verified outcomes and references. Articles: references; the body renders through the safe rich-text parser (headings, lists, links; never HTML). Partners: category and an approved logo, shown at its own proportions with `object-contain`.

**Site settings** (single row, administrators only, live on save, audited per section): contact details and location; tagline (footer, default description, structured data); footer statement, small print and copyright; default sharing image; navigation overrides. Navigation overrides are keyed by an approved item `id` or link `href` and change only labels, descriptions, order and visibility (`applyNavigation`, `src/config/navigation.ts`); destinations cannot be edited, so menus can only point at existing routes and the mega-menu structure is preserved. Settings copy moved into the database through column defaults in the migration.

**Protected brand.** The organisation's name and the original logo stay in code. The Branding settings page shows them read-only and explains that changes happen only through a reviewed code change.

## Consequences

- Every fixed route needs its `pages` row: deployments must run `prisma migrate deploy` and the create-only seed before serving new code. A missing row returns 404 for that route rather than showing stale copy.
- The designed body copy of landing pages (for example the herbarium's process steps) is still edited in code. Making it editable would need per-page section schemas; the registry is where they would be added.
- Navigation can hide or relabel links but not add destinations; a new page needs a route in code first.
- Settings are not part of the editorial workflow (no review step); only administrators can change them, and each save is audited.
