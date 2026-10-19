# M03 — Cinematic homepage and public pages

**Status:** NOT STARTED · **Depends on:** M02

## Goal

Tell the EACH story through a cinematic homepage and a complete set of public pages, built from M02 primitives and sections.

## Scope

- Homepage: full-bleed botanical hero, mission, core activities, featured conservation work, herbarium, get involved, partners.
- Public routes (final names agreed at start):
  About · Conservation · Herbarium · Medicinal Plants and Traditional Knowledge · Research and Education · Get Involved (volunteer, partner) · Partners · Contact.
- Reusable sections in `src/components/sections/`.
- Typed static content in `src/content/` or the relevant features (replaced by the CMS in M04).
- Optimised photography in `public/images/` with documented licences and alt text.
- Bitwiire Herbarium Cafe shown only as an **independent partner**.

## Out of scope

CMS (M04), working forms (M05; M03 may show contact details or a disabled-state notice).

## Acceptance criteria

- [ ] All agreed routes render statically with unique metadata.
- [ ] Sections are reused across pages; no duplicate section components.
- [ ] Each page has one `h1` and a logical heading order; every image has meaningful alt text or is marked decorative.
- [ ] Image licences recorded.
- [ ] Partner wording reviewed: no implied ownership between EACH and Bitwiire.
- [ ] E2E: every route loads, and navigation reaches every route.
- [ ] Full verification suite passes.

## Risks

Photography sourcing and licensing; content accuracy for medicinal plant information (needs expert review); page weight.
