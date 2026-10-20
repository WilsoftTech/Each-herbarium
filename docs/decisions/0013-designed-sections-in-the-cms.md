# 0013. Designed page sections are managed in the CMS

- **Status:** Accepted
- **Date:** 2026-10-20
- **Milestone:** M04
- Supersedes the "designed sections remain code-owned" part of [ADR 0012](0012-cms-page-registry-seo-and-settings.md). Builds on [ADR 0011](0011-content-revisions.md) (revisions).

## Context

ADR 0012 moved every page header, the homepage sections, SEO and site settings into the CMS, but left the designed sections below the landing-page headers in code: the herbarium's process steps, the mission principles, the research themes, the impact measures, the "next page" links, the cards on About and Contact, and the four founding programme pages' sections. The homepage's landscape story and regional presence also stayed in code. The M04 goal is that EACH staff manage every applicable piece of public content without code changes. The owner confirmed on 2026-10-20 that these sections are applicable, so they must be editable under M04.

The constraints from ADR 0012 still hold: no page builder, the cinematic compositions stay as designed, links must stay valid, and drafts and unapproved changes stay private.

## Decision

**One declaration per page, in code.** `src/features/cms/sections.ts` describes a page's designed sections as fixed, typed fields: one-line text, short text, rich text, paragraphs, a link, a destination, an image, a checkbox, a one-per-line list, titled items (`## Title` then its text) and fixed-size groups (cards, panels). From that one declaration the framework derives the Zod schema, the form reader, the editor (`SectionFields`), the field names that carry validation messages, the images the content uses and the form encoding (`sectionFormValues`). Editors change words, list items, images and link destinations. They cannot add, remove or reorder sections, change the number of cards in a grid, or change any design.

- **Landing pages** (15): declarations in `src/features/pages/landing-content.ts`, stored in `pages.content`. Each composition moved from its route into a view in `src/features/pages/components/landing/`; the route and the admin preview render the same view, so a preview of pending changes shows the real page.
- **Founding programme pages** (4): declarations in `src/features/programmes/designed-content.ts`, stored in the new `programmes.content` column (additive migration `20261022090000_designed_page_content`). The programme record still supplies the title, summary, opening paragraph, image and details.
- **Homepage**: `homeContentSchema` gained the four landscapes of the plant heritage story and the regional presence section. `src/content/ecosystems.ts` was removed; its words are seed data.

**Placeholders stay honest.** Each placeholder marker still names a key in `src/content/pending.ts`, so the register and its documentation stay complete. A marker beside draft wording is a checkbox ("Show the placeholder marker"), ticked by default; an "awaiting content" notice is replaced by optional text and shows while that text is empty; a fact EACH has not supplied shows its marker while empty.

**Validation.** Links (including links inside rich text) must be approved destinations (`isApprovedHref`). Images must be finished uploads; publishing also requires alt text and captions. Rich text gained `*emphasis*` for scientific names and is still rendered as React elements, never HTML. The media library's usage check scans `programmes.content` as well as `pages.content` and pending revisions.

**Kept in code on purpose.** These are not editorial content, or protect the integrity of what is published:

- the protected brand: organisation name, short name and logo (AGENTS.md §4);
- integrity statements: Bitwiire's independence (AGENTS.md §1), "This is not medical advice", and the rule that impact measures show no figure until verified;
- notices about website features that do not exist yet (online forms, specimen catalogue): they change with the code that adds the feature (M05 and later);
- the placeholder register and the wording of its markers;
- reference specimens with their licence metadata (`src/content/specimens.ts`), until the Digital Herbarium replaces them;
- interface labels: breadcrumbs, "Our work" eyebrows, numbering, button labels such as "View case study", and decorative illustrations.

**Existing databases.** The seed creates new rows with their sections and then fills sections that existing rows, and their pending revisions, do not have yet (`prisma/seed/fill-content.ts`). It adds only absent keys and never replaces a value, so it is idempotent and cannot overwrite editorial changes. Every fill is audited (`system.seed`).

## Consequences

- Deployments must run `prisma migrate deploy` and then the seed before serving this code, as ADR 0012 already requires. A published landing page whose sections do not match its declaration fails to render instead of showing stale copy; publishing refuses such content.
- Adding a section, or a field to a section, is a code change to the declaration plus seed defaults; the seed fills the new keys into existing rows.
- The editor generates long forms for rich pages (the herbarium, research). Each panel follows the page from top to bottom.
- Placeholders can be retired from the CMS once EACH approves content. Retiring a key from the register is still a code change, checked by the content tests.
