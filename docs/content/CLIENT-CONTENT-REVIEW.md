# Client content review — M04

Prepared by Wilsoft Technologies for East African Community Herbariums (EACH), 2026-10-21, under Option B. **No client approval is recorded by this document.** Proposed copy is not evidence of operational programmes, legal status or results.

The companion `cms-review-proposals.json` contains the same proposals and field patches for the existing CMS. Empty patches deliberately preserve fact-dependent notices. A missing fact remains outstanding even where a useful introduction has been prepared. The legal requirement has separate privacy and terms entries; there are 22 distinct requirements.

Category A: verified institutional baseline. Category B: general educational information. Category C: proposed organisational content requiring adoption. Category D: unavailable or unverified institutional facts. An entry can contain a safe alternative alongside a factual blocker.

## Review and publication

Review wording and facts separately. Confirm the responsible approver and record approval in the existing CMS. Published pages accept changes as pending revisions: save, preview, submit for review, then approve only after the required evidence and permissions are present. Do not untick draft markers merely because copy has been prepared. No named team, additional partner, project, publication or contact record is created by these proposals.

The development-only preparation script stages nonempty field patches as DRAFT revisions, preserving existing pending work and every live record. It is separate from the normal seed. Records with no safe field patch remain in this document for review. Legal policies require legal review and controller confirmation before adoption. Staff must reconcile existing pending revisions manually rather than overwrite them.

## References

- Institutional baseline: `AGENTS.md` section 1 and the approved homepage line in `prisma/seed/landing-pages.ts`.
- Botanical reference: [Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium). Used only for the general role of specimens and documented collections; no Kew affiliation is claimed.
- Traditional knowledge: [CBD Nagoya Protocol Article 7](https://www.cbd.int/abs/text/articles?sec=abs-07) and [Article 12](https://www.cbd.int/abs/text/articles?sec=abs-12). Proposed consent principles require community agreement and applicable legal review; this document does not determine legal obligations.
- Photographs: `public/images/README.md`, `src/config/media.ts`, `src/content/specimens.ts` and ADR 0005. Existing licence evidence is retained; no new images or licences are introduced.

## /about — `organisation`

**Categories:** A / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Organisation details are awaited; confirmed focus, starting country and independent partner appear at a glance.

**Proposed wording**

East African Community Herbariums (EACH) is an independent initiative focused on plant conservation, herbarium development and botanical knowledge in East Africa, beginning in Uganda. Its focus brings together plants, people, science and indigenous knowledge in support of environmental stewardship.

**Evidence/source**

AGENTS.md §1; approved homepage supporting line in prisma/seed/landing-pages.ts.

**Outstanding facts and approval**

Legal identity, registration status and number where applicable, registered address and responsible website owner. This introduction cannot substitute for legal particulars.

**CMS record and source**

Existing `pages` record, slug `about`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

No field patch is staged: the current factual notice or live settings remain unchanged pending evidence. The wording above is ready for client review.

## /about — `history`

**Categories:** A / C / D.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

The Our story section is empty and shows the history notice; the founding date is also empty.

**Proposed wording**

EACH's focus connects three related needs: conserving plants, developing a herbarium and sharing botanical knowledge. Beginning in Uganda, the initiative looks to East Africa as the setting for this work. This introduction describes its purpose; a documented account of its founding and development will follow once the relevant facts are confirmed.

**Evidence/source**

AGENTS.md §1; no founding evidence supplied.

**Outstanding facts and approval**

Approve this introduction. Supply founder identities, founding date and evidenced milestones separately; the Founded fact must remain empty until verified.

**CMS record and source**

Existing `pages` record, slug `about`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.facts.history**

EACH's focus connects three related needs: conserving plants, developing a herbarium and sharing botanical knowledge. Beginning in Uganda, the initiative looks to East Africa as the setting for this work. This introduction describes its purpose; a documented account of its founding and development will follow once the relevant facts are confirmed.

## /about/mission — `missionStatement`

**Categories:** C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

To protect biodiversity for future generations. The headline uses the approved homepage supporting line.

**Proposed wording**

Proposed mission: To support the conservation of East Africa's plant diversity through botanical documentation, herbarium development, education and respectful collaboration with knowledge holders. Proposed vision: An East Africa where plant diversity and the knowledge associated with it are valued, responsibly documented and safeguarded for future generations.

**Evidence/source**

Approved homepage line; AGENTS.md §1. Mission and vision are proposals, not adopted statements.

**Outstanding facts and approval**

EACH must adopt or amend both statements and the strategic objectives under values. Keep the mission draft marker until approval.

**CMS record and source**

Existing `pages` record, slug `about-mission`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**lead**

Proposed mission: To support the conservation of East Africa's plant diversity through botanical documentation, herbarium development, education and respectful collaboration with knowledge holders. Proposed vision: An East Africa where plant diversity and the knowledge associated with it are valued, responsibly documented and safeguarded for future generations.

**content.statement.marker**

true

## /about/mission — `values`

**Categories:** C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Six draft principles: scientific care; respect and consent; open by default; rooted in the region; careful with claims; independent partnerships.

**Proposed wording**

Proposed values and strategic objectives: Scientific care — Build botanical records that can be checked, with sources, identification notes and clear limits. Conservation responsibility — Use botanical evidence to inform the care of plants and habitats; distinguish intentions from demonstrated results. Respect for knowledge holders — Seek informed consent, agree attribution and access, and respect community decisions about sensitive knowledge. Learning and participation — Develop educational material and opportunities for people to contribute with appropriate guidance. Responsible access — Share useful knowledge while protecting privacy, restricted community knowledge and sensitive species information. Accountable collaboration — Define responsibilities between independent organisations and report activities with evidence.

**Evidence/source**

Existing draft principles; AGENTS.md content-integrity rules; CBD Nagoya Protocol Articles 7 and 12 for consent and community protocols.

**Outstanding facts and approval**

Approve values and objectives; confirm practical governance and knowledge-access arrangements. These are commitments proposed for adoption.

**CMS record and source**

Existing `pages` record, slug `about-mission`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.principles.title**

Proposed values and strategic objectives

**content.principles.description**

These principles describe the standards and directions proposed for EACH; they await organisational approval.

**content.principles.marker**

true

**content.principles.items [1].title**

Scientific care

**content.principles.items [1].body**

Build botanical records that can be checked, with sources, identification notes and clear limits.

**content.principles.items [2].title**

Conservation responsibility

**content.principles.items [2].body**

Use botanical evidence to inform the care of plants and habitats; distinguish intentions from demonstrated results.

**content.principles.items [3].title**

Respect for knowledge holders

**content.principles.items [3].body**

Seek informed consent, agree attribution and access, and respect community decisions about sensitive knowledge.

**content.principles.items [4].title**

Learning and participation

**content.principles.items [4].body**

Develop educational material and opportunities for people to contribute with appropriate guidance.

**content.principles.items [5].title**

Responsible access

**content.principles.items [5].body**

Share useful knowledge while protecting privacy, restricted community knowledge and sensitive species information.

**content.principles.items [6].title**

Accountable collaboration

**content.principles.items [6].body**

Define responsibilities between independent organisations and report activities with evidence.

## /about/leadership — `leadership`

**Categories:** C / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

No named profiles; a list describes what the page will show. The page is not indexed until profiles are published.

**Proposed wording**

Proposed governance responsibilities: Set organisational priorities and review evidence of progress; provide scientific guidance on identification and documentation; oversee consent, safeguarding and responsible knowledge sharing; define partner responsibilities and review public claims. These describe responsibilities to agree, not confirmed appointments or an existing board structure.

**Evidence/source**

AGENTS.md prohibits invented identities; team publication requires consent in prisma/schema.prisma.

**Outstanding facts and approval**

Confirm governance structure, names, roles, biographies, images and individual publication consent. Do not create fictional team records.

**CMS record and source**

Existing `pages` record, slug `about-leadership`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.upcoming.eyebrow**

Proposed governance responsibilities

**content.upcoming.title**

Responsibilities to agree before profiles are published

**content.upcoming.items [1]**

Set organisational priorities and review evidence of progress

**content.upcoming.items [2]**

Provide scientific guidance on identification and documentation

**content.upcoming.items [3]**

Oversee consent, safeguarding and responsible knowledge sharing

**content.upcoming.items [4]**

Define partner responsibilities and review public claims

**content.upcoming.items [5]**

These are proposed responsibilities, not confirmed appointments or an existing board structure

## /about/partners — `partners`

**Categories:** A / C / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Bitwiire is the sole seeded independent partner; other partnerships are awaited.

**Proposed wording**

Collaboration can bring together botanical expertise, community priorities and opportunities for learning. Any additional partner profile should state the agreed purpose of the relationship and each organisation's responsibilities. Listing a partner does not imply ownership, endorsement of every activity or authority to speak on its behalf.

**Evidence/source**

AGENTS.md §1; prisma/seed/partners.ts. Collaboration wording is proposed.

**Outstanding facts and approval**

Verify additional relationships and obtain profile and logo permissions. Keep named partner records unpublished until confirmed.

**CMS record and source**

Existing `pages` record, slug `about-partners`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.invitation.description**

Collaboration can bring together botanical expertise, community priorities and opportunities for learning. Explore proposed ways for independent organisations to work together.

## /partnerships — `partnershipModel`

**Categories:** C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Four draft partnership types and an empty next-steps section.

**Proposed wording**

Proposed collaborations include research and academic work on botanical documentation; community-led discussion of knowledge, access and attribution; conservation collaboration around plant and habitat priorities; and education partnerships that help people learn about plants. Before any collaboration begins, the organisations should agree its purpose, scope, responsibilities, permissions, resources, reporting and arrangements for knowledge and data. These are proposed models, not announcements of signed agreements. EACH and every partner retain their independent identities.

**Evidence/source**

Existing partnership types; AGENTS.md brand separation; CBD Articles 7 and 12 where traditional knowledge is involved.

**Outstanding facts and approval**

Approve models and responsibilities; confirm an authorised approach channel. Online partnership forms belong to M05.

**CMS record and source**

Existing `pages` record, slug `partnerships`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.types.eyebrow**

Proposed collaboration

**content.types.title**

Ways independent organisations could work together

**content.types.marker**

true

**content.steps.text**

Proposed for EACH review: Before any collaboration begins, the organisations should agree its purpose, scope, responsibilities, permissions, resources, reporting and arrangements for knowledge and data. These are proposed models, not announcements of signed agreements. EACH and every partner retain their independent identities. An authorised contact channel is still required.

## /bitwiire-herbarium-cafe — `bitwiireProfile`

**Categories:** A / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Independent partner statement; location, hours and approved profile are empty. The homepage also names Bitwiire.

**Proposed wording**

Bitwiire Herbarium Cafe is an independent partner of East African Community Herbariums (EACH). The organisations are separate: neither owns or runs the other. A fuller profile and details of the collaboration will be shared after confirmation by Bitwiire and EACH. Visiting information is not yet confirmed on this website.

**Evidence/source**

AGENTS.md §1; existing partner statement only.

**Outstanding facts and approval**

Bitwiire-approved description, relationship details, location, opening hours and photography permissions. No service, clinical or staffing claims may be inferred.

**CMS record and source**

Existing `pages` record, slug `bitwiire-herbarium-cafe`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

No field patch is staged: the current factual notice or live settings remain unchanged pending evidence. The wording above is ready for client review.

## /our-work; /our-work/plant-conservation; /our-work/environmental-conservation — `programmeDetails`

**Categories:** B / C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

General explanations of four programme fields; specific activities and objectives are absent.

**Proposed wording**

Proposed programme directions: Plant conservation — document plant diversity and identify questions that need conservation attention. Herbarium development — plan reliable specimen documentation, identification, curation and access before claiming a physical collection. Environmental conservation — connect plant knowledge with understanding habitats and environmental change. Medicinal plant knowledge — document cultural context and botanical identity without presenting traditional uses as proven treatments. Indigenous and community knowledge — develop consent and knowledge-sharing arrangements with custodians. Research and education — develop questions, learning materials and supervised participation around these fields. These are directions for review, not evidence of operating programmes or completed fieldwork.

**Evidence/source**

AGENTS.md focus; four existing programme records; Kew herbarium reference for botanical documentation. Proposed organisational directions require adoption.

**Outstanding facts and approval**

Approve directions and priorities; supply activities, capacity, locations, partners, permits and schedules before describing programmes as operational.

**CMS record and source**

Existing `pages` record, slug `our-work`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.programmes.title**

Four connected areas of focus

**content.programmes.description**

Plant conservation, environmental conservation, medicinal plant knowledge and indigenous knowledge provide a framework for proposed work. These areas of focus do not establish that field activities are operating.

**content.programmes.marker**

true

**content.projects.eyebrow**

Documented work

**content.projects.description**

Case studies require confirmed locations, dates, responsibilities and evidence. Sample records are omitted from public listings.

## /projects; /; programme pages; /projects/[slug] — `projects`

**Categories:** B / C / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Three published placeholder projects: placeholder-montane-forest, placeholder-papyrus-wetland and placeholder-dryland-savanna. They illustrate landscapes only.

**Proposed wording**

Plant conservation can connect botanical documentation, habitat care, research and community participation. This page is reserved for documented EACH projects. Each approved case study should explain the purpose, location, period, participants and permissions, distinguish objectives from completed activities, and support outcomes with dated evidence. A landscape photograph alone is not evidence of an EACH project.

**Evidence/source**

prisma/seed/projects.ts; no verified project evidence supplied.

**Outstanding facts and approval**

Real project dossiers and permissions; preserve identifiers and relationships. No new fictional project records. Samples remain labelled and noindex on their detail routes.

**CMS record and source**

Existing `pages` record, slug `projects`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**description**

How EACH project case studies will be documented and reviewed. Only verified project records are eligible for the public listing.

**lead**

This page is reserved for documented EACH projects. Approved case studies should distinguish objectives, completed activities and verified results, with dates and sources.

## / — `regionalPresence`

**Categories:** A / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Uganda and East Africa are confirmed; sites, districts and wider-region facts are empty.

**Proposed wording**

EACH begins in Uganda, within an East African focus. This identifies its starting country and regional purpose; it does not establish offices, field sites or operations in other countries. Specific locations and any expansion plans will be described only after confirmation.

**Evidence/source**

AGENTS.md §1; no site or expansion evidence supplied.

**Outstanding facts and approval**

Confirmed operating sites, districts, country relationships and separately approved expansion plans. Leave presence.sites and presence.wider empty.

**CMS record and source**

Existing `pages` record, slug `home`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.presence.text**

EACH begins in Uganda, within an East African focus. This identifies its starting country and regional purpose; it does not establish offices, field sites or operations in other countries. Specific locations and any expansion plans will be described only after confirmation.

**content.projects.description**

Case studies require confirmed locations, dates, responsibilities and evidence. Sample records are omitted from this listing.

## /herbarium — `herbariumStatus`

**Categories:** B / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

General specimen methodology, three attributed reference sheets and an empty collection-status section.

**Proposed wording**

A herbarium preserves specimens and their associated collection information so that plant identifications can be revisited. The reference sheets on this website illustrate that method; they are not evidence of specimens owned or managed by EACH. EACH's holdings, housing arrangements and accession records have not been confirmed for publication. The website does not provide a searchable EACH specimen catalogue.

**Evidence/source**

src/content/specimens.ts; public/images/README.md; Kew herbarium reference. No evidence of EACH holdings supplied.

**Outstanding facts and approval**

Confirm holdings or absence of holdings, repository, curation standards, accession records and any repository relationship. Keep collection-status notice; a proposed introduction must not erase it.

**CMS record and source**

Existing `pages` record, slug `herbarium`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

No field patch is staged: the current factual notice or live settings remain unchanged pending evidence. The wording above is ready for client review.

## /research — `researchThemes`

**Categories:** B / C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Four draft themes, empty affiliations and collaboration details; publication description claims EACH has not published research yet without an institutional bibliography.

**Proposed wording**

Proposed research directions: Botanical documentation — investigate plant identity and distribution using traceable observations and, where authorised, voucher specimens. Conservation questions — examine evidence of pressures on plants and habitats without claiming an assessment has already been completed. Ethnobotany — develop questions with knowledge holders, with agreed consent, attribution, access and benefit-sharing arrangements. Environmental change — explore how plant records could support study of habitat and land-use change. These are potential directions, not active studies, funded projects or confirmed institutional affiliations.

**Evidence/source**

Existing draft themes; Kew herbarium reference; CBD Articles 7 and 12.

**Outstanding facts and approval**

Approve scope; confirm researchers, affiliations, ethical review, permits and resources before announcing studies. Verify bibliography rather than inferring that no publications exist.

**CMS record and source**

Existing `pages` record, slug `research`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.themes.eyebrow**

Proposed research directions

**content.themes.title**

Questions for future botanical study

**content.themes.marker**

true

**content.themes.items [1].title**

Botanical documentation

**content.themes.items [1].body**

Investigate plant identity and distribution using traceable observations and, where authorised, voucher specimens.

**content.themes.items [2].title**

Conservation questions

**content.themes.items [2].body**

Examine evidence of pressures on plants and habitats without claiming an assessment has already been completed.

**content.themes.items [3].title**

Ethnobotany

**content.themes.items [3].body**

Develop questions with knowledge holders, with agreed consent, attribution, access and benefit-sharing arrangements.

**content.themes.items [4].title**

Environmental change

**content.themes.items [4].body**

Explore how plant records could support study of habitat and land-use change.

**content.publications.description**

Approved publications will be listed with authors, dates and sources. Sample entries are omitted; an institutional bibliography still needs confirmation.

**content.collaborate.text**

Proposed for EACH review: These are potential research directions, not active studies, funded projects or confirmed institutional affiliations. Any study would require an agreed question, suitable expertise, permissions and a plan for responsible handling of data and knowledge.

## /resources; /research; /; /resources/[slug] — `resources`

**Categories:** B / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Three sample articles: placeholder-publication, placeholder-field-guide and placeholder-field-story, without authors, dates or bodies.

**Proposed wording**

This library is intended for approved publications, guides and stories with clear authorship and sources. Sample entries are not EACH publications. For external botanical reference, consult the Royal Botanic Gardens, Kew herbarium access information. For traditional knowledge and access arrangements, consult the Convention on Biological Diversity's Nagoya Protocol. These sources are produced by their respective institutions and do not imply an affiliation with EACH.

**Evidence/source**

prisma/seed/articles.ts; Kew and CBD references listed below. No EACH publication supplied.

**Outstanding facts and approval**

Bibliography, authors, publication dates, permissions and actual files or text. External references must retain original institutional attribution.

**CMS record and source**

Existing `pages` record, slug `resources`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**lead**

A library for approved publications, guides and stories with clear authorship and sources. Sample entries are not EACH publications.

**description**

EACH's resource library is awaiting verified publications, guides and stories. Sample entries are omitted from the listing.

## /our-work/medicinal-plants — `medicinalReview`

**Categories:** B / C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Draft approach, a Warburgia example, reference specimen and fixed not-medical-advice notice; expert review outstanding.

**Proposed wording**

Proposed documentation principles: Botanical identity — Record a scientific identification and the evidence supporting it; local names alone may be ambiguous. Cultural context — Attribute a reported use to its source and setting, with permission. A reported traditional use is not proof of safety or effectiveness. Permission and access — Agree what may be recorded, retained and shared before collecting knowledge; respect restrictions and intellectual property rights. Conservation care — Consider whether proposed research or collection could put wild plants or sensitive knowledge at risk. This material is for education and conservation, not treatment advice; qualified botanical or ethnobotanical review remains required.

**Evidence/source**

Existing medical disclaimer and pending expert-review requirement; CBD Articles 7 and 12 for permission principles. No efficacy claim or new plant-specific assertion is introduced.

**Outstanding facts and approval**

Qualified botanist or ethnobotanist review of the entire page, including existing species statements and reference identifications. Medical disclaimer must remain.

**CMS record and source**

Existing `programmes` record, slug `medicinal-plants`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.approach.eyebrow**

Proposed documentation principles

**content.approach.marker**

true

**content.approach.items [1].title**

Botanical identity

**content.approach.items [1].body**

Record a scientific identification and the evidence supporting it; local names alone may be ambiguous.

**content.approach.items [2].title**

Cultural context

**content.approach.items [2].body**

Attribute a reported use to its source and setting, with permission. A reported traditional use is not proof of safety or effectiveness.

**content.approach.items [3].title**

Permission and access

**content.approach.items [3].body**

Agree what may be recorded, retained and shared before collecting knowledge; respect restrictions and intellectual property rights.

**content.approach.items [4].title**

Conservation care

**content.approach.items [4].body**

Consider whether proposed research or collection could put wild plants or sensitive knowledge at risk.

## /our-work/indigenous-knowledge — `communityProtocols`

**Categories:** B / C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Four draft principles; wording promises withdrawal without defining its practical limits; agreed protocols are absent.

**Proposed wording**

Proposed principles for discussion: Informed agreement — Explain the proposed purpose, recording methods, access and intended uses in an accessible language before seeking consent. Custodian-led attribution — Agree whether and how individuals and communities wish to be acknowledged; do not publish identities by default. Control over sharing — Agree restrictions, storage, reuse and a workable process for changing or withdrawing permission, including limits after publication. Fair arrangements — Discuss benefits, responsibilities and applicable access requirements before work starts; document mutually agreed terms where required. These principles are a starting point for agreement with knowledge holders, not evidence of consent already obtained or a complete legal protocol.

**Evidence/source**

CBD Nagoya Protocol Articles 7 and 12; existing draft community principles. No community relationship or consent is inferred.

**Outstanding facts and approval**

Community-led review, actual protocols, permissions, applicable legal advice, attribution choices, intellectual property and benefit-sharing terms. Do not publish sensitive knowledge or identities.

**CMS record and source**

Existing `programmes` record, slug `indigenous-knowledge`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.principles.eyebrow**

Proposed principles

**content.principles.title**

A starting point for agreement with knowledge holders

**content.principles.marker**

true

**content.principles.items [1].title**

Informed agreement

**content.principles.items [1].body**

Explain the proposed purpose, recording methods, access and intended uses in an accessible language before seeking consent.

**content.principles.items [2].title**

Custodian-led attribution

**content.principles.items [2].body**

Agree whether and how individuals and communities wish to be acknowledged; do not publish identities by default.

**content.principles.items [3].title**

Control over sharing

**content.principles.items [3].body**

Agree restrictions, storage, reuse and a workable process for changing or withdrawing permission, including limits after publication.

**content.principles.items [4].title**

Fair arrangements

**content.principles.items [4].body**

Discuss benefits, responsibilities and applicable access requirements before work starts; document mutually agreed terms where required.

**content.principles.details**

Proposed for EACH and community review: These principles are a starting point for agreement with knowledge holders, not evidence of consent already obtained or a complete legal protocol.

## /volunteer — `volunteerRoles`

**Categories:** C.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Four possible contribution areas; no confirmed roles, application channel or safeguarding arrangements.

**Proposed wording**

Proposed contributions, subject to approval and supervision: Botanical documentation — Support observation notes and authorised field documentation under qualified guidance. Herbarium support — Assist with preparation, imaging and record checking once collection arrangements and training are confirmed. Education — Help prepare accessible plant-learning materials and supervised activities. Digital and editorial support — Check transcriptions, image credits and educational copy against their sources. These are possible role areas, not open vacancies. Locations, eligibility, time commitments, supervision, expenses, safeguarding and an authorised contact channel must be agreed before recruitment.

**Evidence/source**

Existing volunteer areas; no operational recruitment evidence supplied.

**Outstanding facts and approval**

Approve actual roles and recruitment arrangements, requirements, locations, time, safeguarding and contact. Forms and delivery are M05.

**CMS record and source**

Existing `pages` record, slug `volunteer`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**lead**

Explore proposed ways to contribute to plant documentation, education and conservation. These are possible role areas, not open vacancies.

**content.areas.eyebrow**

Proposed contributions

**content.areas.title**

Skills that could support future work

**content.areas.description**

All opportunities would require organisational approval, suitable supervision and confirmed practical arrangements before recruitment.

**content.areas.marker**

true

**content.areas.items [1].title**

Botanical documentation

**content.areas.items [1].body**

Support observation notes and authorised field documentation under qualified guidance.

**content.areas.items [2].title**

Herbarium support

**content.areas.items [2].body**

Assist with preparation, imaging and record checking once collection arrangements and training are confirmed.

**content.areas.items [3].title**

Education

**content.areas.items [3].body**

Help prepare accessible plant-learning materials and supervised activities.

**content.areas.items [4].title**

Digital and editorial support

**content.areas.items [4].body**

Check transcriptions, image credits and educational copy against their sources.

## /impact; /projects/[slug] — `impactFigures`

**Categories:** C / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Six proposed measures, no figures and an empty results section; three reporting principles.

**Proposed wording**

Proposed measurement framework: Count documented plant records after identification review and removal of duplicates; count accessioned specimens only after repository and accession verification; count conservation projects only against agreed project records and status definitions; count educational activities against dated activity logs; count community participation only with consent and an agreed privacy-preserving method; count published resources only after editorial approval. Every reported measure should specify its definition, period, source, method, limitations and reviewer. Activity counts do not by themselves demonstrate ecological improvement or community benefit. No results are asserted here.

**Evidence/source**

Existing impact design and integrity rule; proposed reporting methodology, not evidence of results.

**Outstanding facts and approval**

Approve definitions, baselines, data ownership, review method and reporting period; supply verified results separately. No numeric results or implied zero baseline.

**CMS record and source**

Existing `pages` record, slug `impact`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**content.measures.eyebrow**

Proposed measurement framework

**content.measures.title**

Measures to define before reporting

**content.measures.marker**

true

**content.measures.items [1]**

Plant records checked for identification and duplicates

**content.measures.items [2]**

Specimens verified against accession records

**content.measures.items [3]**

Conservation projects with agreed status definitions

**content.measures.items [4]**

Educational activities supported by dated logs

**content.measures.items [5]**

Community participation recorded with consent

**content.measures.items [6]**

Resources published after editorial approval

**content.reporting.items [1].title**

Define the measure

**content.reporting.items [1].body**

Specify what is counted, the reporting period and any baseline. An activity count is not evidence of an ecological outcome.

**content.reporting.items [2].title**

Check the evidence

**content.reporting.items [2].body**

Record the source, collection method, limitations and reviewer before publishing a result.

**content.reporting.items [3].title**

Protect people and knowledge

**content.reporting.items [3].body**

Agree consent and attribution, and report participation without exposing personal or restricted community information.

## /contact — `contactDetails`

**Categories:** D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Contact settings are empty; the page shows a controlled notice. No public contact form is implemented.

**Proposed wording**

Official contact details are awaiting confirmation. This website currently provides no public enquiry form. An email address, telephone number or other channel will be shown only after EACH confirms that it is authorised for public use. Please do not submit personal or sensitive information through unofficial channels.

**Evidence/source**

Contact view, site settings and M05 specification; no verified contact channel supplied.

**Outstanding facts and approval**

Owner-confirmed email, telephone, address, office hours and social links. Do not populate live-on-save site settings with proposals or dummy values.

**CMS record and source**

Existing `pages` record, slug `contact`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

No field patch is staged: the current factual notice or live settings remain unchanged pending evidence. The wording above is ready for client review.

## /accessibility — `accessibilityContact`

**Categories:** C / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Accessibility feedback contact is awaited; manual screen-reader review is outstanding.

**Proposed wording**

An authorised accessibility feedback channel is awaiting confirmation. Once it is available, feedback can describe the page, the task that was difficult and any assistive technology involved, without including sensitive personal information. A response target will be published only after the responsible team confirms it. Automated checks do not establish that every person can use the website; manual assistive-technology review remains outstanding.

**Evidence/source**

Existing accessibility policy, ROADMAP.md and M06 specification.

**Outstanding facts and approval**

Named responsible team or authorised address and agreed response target. Manual screen-reader audit stays in M06; no compliance certification is asserted.

**CMS record and source**

Existing `pages` record, slug `accessibility`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

No field patch is staged: the current factual notice or live settings remain unchanged pending evidence. The wording above is ready for client review.

## /about; all photographic routes — `photography`

**Categories:** A / D.

**Approval status:** BLOCKED — FACTUAL INFORMATION REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

16 openly licensed reference photographs, including three reference specimen sheets; credits and sources are registered.

**Proposed wording**

The website uses attributed reference photographs of East African plants and landscapes. They illustrate botanical and environmental subjects; they do not document EACH projects, staff, premises or collections. Reference specimen sheets are labelled separately and are not EACH specimens. EACH photography will be added only with confirmed ownership or permission, appropriate consent, accurate captions and image credits.

**Evidence/source**

ADR 0005; src/config/media.ts; public/images/README.md; src/content/specimens.ts. Licence metadata recorded on 2026-10-19; not a new legal determination.

**Outstanding facts and approval**

EACH-owned or authorised images with provenance, rights, consent and captions; official vector or transparent logo master remains an owner action. Preserve existing logos and credits.

**CMS record and source**

Existing `pages` record, slug `about`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

No field patch is staged: the current factual notice or live settings remain unchanged pending evidence. The wording above is ready for client review.

## /privacy; /terms — `legalPolicies`

**Categories:** C / D.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Existing privacy opening: "This website does not ask for any personal information. It has no forms, accounts or newsletter sign-up, and it does not use cookies, analytics or advertising trackers." This predates the M04 staff CMS.

**Proposed wording**

Draft privacy policy

This notice describes the implemented website and awaits confirmation by the responsible organisation and legal review. It does not certify compliance.

Public pages and enquiries
The public website provides informational pages. Public contact, volunteer and partnership forms, newsletter registration and public user accounts are not implemented. No public enquiry collection or delivery process is described by this notice.

Staff access
Authorised staff use a restricted CMS. Staff authentication uses Neon Managed Auth and session cookies. CMS records include staff membership and roles, editorial changes and audit events. These functions process staff identity and activity information to operate restricted access and the editorial workflow.

Service providers and technical records
The implementation uses Neon for database, managed authentication and private object storage. Delivery and infrastructure services may process connection and request information. The responsible organisation must confirm the actual hosting arrangements, provider roles, processing locations, legal basis, retention periods and access procedures before adopting this notice. No verified retention schedule or deletion promise is available.

Content and external links
Published content may include approved personal information such as a consented staff biography. Photograph credits and reference records link to external services with their own privacy notices. No advertising or analytics integration was identified in the repository review; this is not a guarantee about future hosting or third-party services.

Responsibility and requests
The data controller's legal identity, authorised privacy contact and procedures for requests remain to be confirmed. The contact page must not be treated as an operational submission channel while its details are pending.

Future features
Before public forms or new tracking are introduced, the notice must be reviewed against the fields collected, purposes, recipients, consent or other basis, retention and request procedures actually implemented.

Draft terms of use

This website presents information about East African Community Herbariums (EACH), botanical subjects and conservation. Its responsible legal entity and contact details await confirmation. Drafts and reference material must be distinguished from approved institutional statements. Proposed activities are not evidence of projects already carried out.

Plant information is for education and conservation. It is not medical advice and does not establish that a plant or traditional preparation is safe or effective. Consult a qualified health professional about health concerns.

Third-party photographs and specimen images retain their stated credits and licences; reuse is governed by those licences. No blanket licence is granted for all text, community knowledge, personal information or brand assets. Use of the EACH and Bitwiire names and logos requires the relevant rights holder's permission. The organisations are independent; neither owns or runs the other.

External links are provided as references and do not establish an EACH partnership or endorsement. Public enquiry forms, applications and a searchable EACH specimen catalogue are not currently provided. These terms do not create an application, research-access or partnership agreement.

The responsible entity, applicable law, permissions process, contact route and any liability provisions require legal review before adoption. No contractual or compliance assurance is made by this draft.

**Evidence/source**

src/services/auth.ts; src/features/settings; prisma/schema.prisma; existing privacy/terms seeds; M04 scope. This is a proposed implementation description, not legal advice or an externally verified compliance assessment.

**Outstanding facts and approval**

Legal review; data controller identity and contact; actual host/provider arrangements, lawful basis, retention, request procedures, jurisdiction and rights policy. Keep legalPolicies notices. Terms body is supplied separately in the review document for the existing terms record.

**CMS record and source**

Existing `pages` record, slug `privacy`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**body**

This notice describes the implemented website and awaits confirmation by the responsible organisation and legal review. It does not certify compliance.

Public pages and enquiries
The public website provides informational pages. Public contact, volunteer and partnership forms, newsletter registration and public user accounts are not implemented. No public enquiry collection or delivery process is described by this notice.

Staff access
Authorised staff use a restricted CMS. Staff authentication uses Neon Managed Auth and session cookies. CMS records include staff membership and roles, editorial changes and audit events. These functions process staff identity and activity information to operate restricted access and the editorial workflow.

Service providers and technical records
The implementation uses Neon for database, managed authentication and private object storage. Delivery and infrastructure services may process connection and request information. The responsible organisation must confirm the actual hosting arrangements, provider roles, processing locations, legal basis, retention periods and access procedures before adopting this notice. No verified retention schedule or deletion promise is available.

Content and external links
Published content may include approved personal information such as a consented staff biography. Photograph credits and reference records link to external services with their own privacy notices. No advertising or analytics integration was identified in the repository review; this is not a guarantee about future hosting or third-party services.

Responsibility and requests
The data controller's legal identity, authorised privacy contact and procedures for requests remain to be confirmed. The contact page must not be treated as an operational submission channel while its details are pending.

Future features
Before public forms or new tracking are introduced, the notice must be reviewed against the fields collected, purposes, recipients, consent or other basis, retention and request procedures actually implemented.

## /terms — `legalPolicies`

**Categories:** C / D.

**Approval status:** PREPARED — CLIENT REVIEW REQUIRED. Unapproved; no sign-off inferred.

**Existing wording or state**

Existing terms opening: "This website is published by East African Community Herbariums (EACH). The organisation's legal details will be added here." Existing terms retain draft and medical notices.

**Proposed wording**

This website presents information about East African Community Herbariums (EACH), botanical subjects and conservation. Its responsible legal entity and contact details await confirmation. Drafts and reference material must be distinguished from approved institutional statements. Proposed activities are not evidence of projects already carried out.

Plant information is for education and conservation. It is not medical advice and does not establish that a plant or traditional preparation is safe or effective. Consult a qualified health professional about health concerns.

Third-party photographs and specimen images retain their stated credits and licences; reuse is governed by those licences. No blanket licence is granted for all text, community knowledge, personal information or brand assets. Use of the EACH and Bitwiire names and logos requires the relevant rights holder's permission. The organisations are independent; neither owns or runs the other.

External links are provided as references and do not establish an EACH partnership or endorsement. Public enquiry forms, applications and a searchable EACH specimen catalogue are not currently provided. These terms do not create an application, research-access or partnership agreement.

The responsible entity, applicable law, permissions process, contact route and any liability provisions require legal review before adoption. No contractual or compliance assurance is made by this draft.

**Evidence/source**

src/services/auth.ts; src/features/settings; prisma/schema.prisma; existing privacy/terms seeds; M04 scope. This is a proposed implementation description, not legal advice or an externally verified compliance assessment.

**Outstanding facts and approval**

Legal review; data controller identity and contact; actual host/provider arrangements, lawful basis, retention, request procedures, jurisdiction and rights policy. Keep legalPolicies notices. Terms body is supplied separately in the review document for the existing terms record.

**CMS record and source**

Existing `pages` record, slug `terms`. Field proposals: `docs/content/cms-review-proposals.json`. Baseline: `prisma/seed/landing-content.ts`, `prisma/seed/landing-pages.ts`, `prisma/seed/pages.ts` or `prisma/seed/programme-content.ts` as applicable; current database/editor values take precedence over seeds.

**Exact proposed CMS field wording**

**body**

This website presents information about East African Community Herbariums (EACH), botanical subjects and conservation. Its responsible legal entity and contact details await confirmation. Drafts and reference material must be distinguished from approved institutional statements. Proposed activities are not evidence of projects already carried out.

Plant information is for education and conservation. It is not medical advice and does not establish that a plant or traditional preparation is safe or effective. Consult a qualified health professional about health concerns.

Third-party photographs and specimen images retain their stated credits and licences; reuse is governed by those licences. No blanket licence is granted for all text, community knowledge, personal information or brand assets. Use of the EACH and Bitwiire names and logos requires the relevant rights holder's permission. The organisations are independent; neither owns or runs the other.

External links are provided as references and do not establish an EACH partnership or endorsement. Public enquiry forms, applications and a searchable EACH specimen catalogue are not currently provided. These terms do not create an application, research-access or partnership agreement.

The responsible entity, applicable law, permissions process, contact route and any liability provisions require legal review before adoption. No contractual or compliance assurance is made by this draft.
