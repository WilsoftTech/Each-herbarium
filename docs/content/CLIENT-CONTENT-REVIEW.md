# Client content review — approved implementation

The project owner reported that the client reviewed and approved the content, and instructed Wilsoft Technologies to implement it and select starter projects for the new organisation. This instruction supersedes the previous review-required status. Approval is recorded from the conversation on 2026-10-21; no client identity, professional qualification or signature is invented.

**Only contact information (including partner contacts and visiting hours) and locations remain pending.** Approval of copy does not establish missing institutional facts: unsupported identities, registration particulars, historical achievements, holdings and results are omitted. The starter projects are plans, not claims that fieldwork has started.

## Reconciliation of the original 22 requirements

| Key                    | Current disposition                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `organisation`         | IMPLEMENTED APPROVED COPY: Approved organisational introduction; registration particulars omitted.                                                |
| `history`              | IMPLEMENTED APPROVED COPY: Approved new-organisation introduction; no invented founding date or timeline.                                         |
| `missionStatement`     | IMPLEMENTED APPROVED COPY: Mission and vision adopted as editorial copy.                                                                          |
| `values`               | IMPLEMENTED APPROVED COPY: Values and strategic objectives adopted.                                                                               |
| `leadership`           | IMPLEMENTED APPROVED COPY: Governance responsibilities adopted; unverified named profiles omitted.                                                |
| `partners`             | IMPLEMENTED APPROVED COPY: Independent partner statement approved; no additional named partners invented.                                         |
| `partnershipModel`     | IMPLEMENTED APPROVED COPY: Collaboration framework approved; no signed agreements claimed.                                                        |
| `bitwiireProfile`      | PENDING CONTACT / LOCATION: Bitwiire contact information, location and visiting hours; profile wording is approved.                               |
| `programmeDetails`     | IMPLEMENTED APPROVED COPY: Focus areas and starter directions approved; operational work distinguished from plans.                                |
| `projects`             | IMPLEMENTED APPROVED COPY: Three selected starter plans published with operational status PLANNED.                                                |
| `regionalPresence`     | PENDING CONTACT / LOCATION: EACH and partner addresses, field sites and project locations.                                                        |
| `herbariumStatus`      | IMPLEMENTED APPROVED COPY: Development and reference-specimen explanation approved; no holdings invented.                                         |
| `researchThemes`       | IMPLEMENTED APPROVED COPY: Research directions approved; no active study, funding or affiliation invented.                                        |
| `resources`            | IMPLEMENTED APPROVED COPY: Three original educational website guides provided with attributed sources.                                            |
| `medicinalReview`      | IMPLEMENTED APPROVED COPY: Conservative educational wording approved; medical disclaimer retained; no specialist review is falsely claimed.       |
| `communityProtocols`   | IMPLEMENTED APPROVED COPY: Responsible preparation principles approved; no community participation or consent presumed.                           |
| `volunteerRoles`       | IMPLEMENTED APPROVED COPY: Planned contribution areas approved; no open vacancies or recruitment process claimed.                                 |
| `impactFigures`        | IMPLEMENTED APPROVED COPY: Measurement framework approved; no numeric results or zero baseline invented.                                          |
| `contactDetails`       | PENDING CONTACT / LOCATION: Official EACH contact channels, address and opening hours.                                                            |
| `accessibilityContact` | PENDING CONTACT / LOCATION: Authorised accessibility contact and response target.                                                                 |
| `photography`          | IMPLEMENTED APPROVED COPY: Existing licensed reference imagery accepted; original brands and credits preserved.                                   |
| `legalPolicies`        | IMPLEMENTED APPROVED COPY: Implementation-based privacy and terms copy approved; no compliance certification or unverified registration asserted. |

## Approved page and programme wording

The source of the following field wording is `docs/content/approved-content.json`. Fresh databases receive it through the normal create-only seed. Existing dev records are updated through `scripts/apply-approved-content.ts`, which uses the existing save and publishing validators, records review/publication audit events, preserves unrelated pending changes and refuses production. Normal staff actions retain their existing authorisation checks.

### pages/about

Status: approved for implementation. Contact and location fields are unchanged.

**content.facts.history**

As a new organisation, EACH is building a foundation for plant conservation, herbarium development and botanical knowledge. Its starting priorities are to establish careful documentation, prepare accessible learning resources and develop respectful ways of working with knowledge holders. These priorities describe the work ahead, without claiming a history of completed projects.

**content.facts.title**

Plants, knowledge and a new beginning

**content.facts.description**

EACH is a new organisation with an East African focus, beginning in Uganda. Its first priorities connect botanical documentation, conservation learning and responsible community participation.

**content.facts.photography**

Licensed reference photography; not documentation of EACH activities

### pages/about-mission

Status: approved for implementation. Contact and location fields are unchanged.

**lead**

Mission: To support the conservation of East Africa's plant diversity through botanical documentation, herbarium development, education and respectful collaboration with knowledge holders. Vision: An East Africa where plant diversity and the knowledge associated with it are valued, responsibly documented and safeguarded for future generations.

**content.principles.title**

Values and strategic objectives

**content.principles.description**

These principles guide EACH's botanical documentation, learning resources and approach to collaboration.

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

### pages/about-leadership

Status: approved for implementation. Contact and location fields are unchanged.

**content.upcoming.eyebrow**

Governance

**content.upcoming.title**

Responsibilities behind the work

**content.upcoming.items [1]**

Set priorities and assess progress against evidence

**content.upcoming.items [2]**

Support accurate identification and traceable botanical documentation

**content.upcoming.items [3]**

Protect consent, attribution and appropriate access to knowledge

**content.upcoming.items [4]**

Define independent partner responsibilities and accountable reporting

**content.next.description**

Independent organisations working alongside EACH.

**title**

Leadership and accountability

**lead**

Scientific care, responsible stewardship and clear responsibilities guide the development of EACH. Governance is described here through its responsibilities; no unverified personal profiles or board appointments are presented.

### pages/about-partners

Status: approved for implementation. Contact and location fields are unchanged.

**content.invitation.description**

Collaboration connects botanical expertise, community priorities and opportunities for learning. Each relationship should have a clear purpose, agreed responsibilities and respect for organisational independence.

### pages/partnerships

Status: approved for implementation. Contact and location fields are unchanged.

**content.types.eyebrow**

Collaboration

**content.types.title**

Ways independent organisations can work together

**content.steps.text**

Collaboration begins with a shared purpose and a clear scope. Independent organisations agree responsibilities, permissions, resources, reporting and arrangements for knowledge and data before work starts. Research, conservation, community and education partnerships are part of this framework; no additional signed partnerships are claimed. Official contact and location details are being confirmed.

### pages/bitwiire-herbarium-cafe

Status: approved for implementation. Contact and location fields are unchanged.

**content.profile.eyebrow**

Independent collaboration

**content.profile.description**

Bitwiire Herbarium Cafe and EACH retain their own identities and responsibilities.

**content.profile.text**

Bitwiire Herbarium Cafe is an independent partner of East African Community Herbariums (EACH). The organisations are separate: neither owns or runs the other. This profile describes that relationship without making claims about services, staff, qualifications or activities. Official visiting and contact details are being confirmed.

### pages/our-work

Status: approved for implementation. Contact and location fields are unchanged.

**content.programmes.title**

Four connected areas of focus

**content.programmes.description**

Plant conservation, environmental conservation, medicinal plant knowledge and indigenous knowledge shape EACH's starter plans. These fields connect documentation, habitat awareness, responsible research and education.

**content.projects.eyebrow**

Getting started

**content.projects.description**

Three planned projects establish documentation, learning and community dialogue. Their objectives describe intended work, not completed activities or verified results.

**content.projects.title**

Our starter projects

### pages/projects

Status: approved for implementation. Contact and location fields are unchanged.

**description**

Three planned EACH starter projects: botanical documentation foundations, plant learning resources and community knowledge dialogue.

**lead**

Our first projects focus on building sound foundations. Each is planned: objectives describe intended work, and no field sites, delivery dates or achieved results are asserted.

**title**

Our starter projects

**content.closing.text**

Project plans will develop as practical arrangements are established. Verified results will be reported on the [impact page](/impact), with their sources and reporting periods.

### pages/home

Status: approved for implementation. Contact and location fields are unchanged.

**content.presence.text**

EACH begins in Uganda with an East African focus. Specific offices, field sites and project locations are being confirmed. No operations elsewhere are implied.

**content.presence.wider**

East African focus; no additional country operations claimed

**content.projects.description**

Planned work in botanical documentation, plant learning and community knowledge dialogue. No completed fieldwork or outcomes are claimed.

**content.projects.eyebrow**

Getting started

**content.projects.title**

Our starter projects

**content.stories.title**

Plant learning resources

**content.research.body [1]**

Botanical records connect a plant identification with its source and context. Careful documentation makes information easier to check and use.

**content.research.body [2]**

Explore introductory website guides and research directions. These materials support learning; they are not reports of completed EACH research.

### pages/herbarium

Status: approved for implementation. Contact and location fields are unchanged.

**content.status.title**

Developing the herbarium foundation

**content.status.text**

Herbarium development is one of EACH's founding priorities. Its starter documentation project focuses on record standards, identification evidence and the requirements for responsible curation. The reference sheets shown here illustrate herbarium methods; they do not establish that EACH owns or manages a physical collection. No EACH specimen inventory is presented on this website.

### pages/research

Status: approved for implementation. Contact and location fields are unchanged.

**content.themes.eyebrow**

Research directions

**content.themes.title**

Questions that can guide future study

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

Research publications will be listed with their authors, dates and sources when available. In the meantime, the resource library provides introductory website guides.

**content.collaborate.text**

These directions provide a starting point for future studies. Each study needs an agreed question, suitable expertise, appropriate permissions and a plan for handling data and knowledge responsibly. No funded studies or additional institutional affiliations are claimed.

**content.facts.partners**

Independent research collaboration; no additional affiliations claimed

**content.facts.publications**

Introductory website guides; no completed research outputs claimed

### pages/resources

Status: approved for implementation. Contact and location fields are unchanged.

**lead**

Introductory website guides to botanical documentation, plant learning and responsible knowledge sharing. These are educational resources, not reports of completed field research.

**description**

Educational website guides from EACH, with references to their original botanical and conservation sources.

**title**

Resources

### programmes/medicinal-plants

Status: approved for implementation. Contact and location fields are unchanged.

**content.approach.eyebrow**

Documentation principles

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

### programmes/indigenous-knowledge

Status: approved for implementation. Contact and location fields are unchanged.

**content.principles.eyebrow**

Principles

**content.principles.title**

A starting point for agreement with knowledge holders

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

The community knowledge dialogue project starts with listening and agreement about purpose, attribution, access and benefit-sharing. No community consent is presumed, and no restricted knowledge will be collected or published before the relevant permissions and terms are agreed.

### pages/volunteer

Status: approved for implementation. Contact and location fields are unchanged.

**lead**

Contribute skills to EACH's planned work in botanical documentation, education and responsible knowledge sharing. The role areas below describe opportunities to develop, not open vacancies.

**content.areas.eyebrow**

Planned contributions

**content.areas.title**

Skills for the work ahead

**content.areas.description**

Roles will be introduced with clear tasks, suitable supervision and practical arrangements before recruitment.

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

**content.steps.title**

Preparing opportunities

**content.steps.text**

Botanical documentation, herbarium support, education and editorial assistance form the starting role areas. Any advertised opportunity will state its responsibilities, supervision, time commitments and safeguarding arrangements before applications are accepted. Official contact and location details are being confirmed.

### pages/impact

Status: approved for implementation. Contact and location fields are unchanged.

**content.measures.eyebrow**

Measurement framework

**content.measures.title**

Define the measure before reporting

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

**content.reporting.text**

The starter projects begin with planning and preparation. No verified project results are reported here. Future figures will identify the measure, reporting period, source, method, limitations and reviewer; activity counts will be distinguished from ecological or community outcomes.

**lead**

EACH is establishing its reporting foundation as a new organisation. This framework explains what will be measured; no completed-project results or numerical achievements are claimed.

### pages/privacy

Status: approved for implementation. Contact and location fields are unchanged.

**body**

## About this notice

This notice describes the website's current functions. EACH is responsible for its editorial content; Wilsoft Technologies provides development services. Official privacy contact details and locations are being confirmed. This notice does not claim regulatory certification or establish a verified retention schedule.

## Public pages

The public website provides informational pages. Public enquiry, volunteer and partnership forms, newsletter registration and public user accounts are not currently provided.

## Restricted staff access

Authorised staff use a restricted CMS. Neon Managed Auth provides staff authentication and session cookies. CMS records include staff membership and roles, editorial changes and audit events used to operate restricted access and the editorial workflow.

## Infrastructure and technical information

The implementation uses Neon for its database, managed authentication and private object storage. Services delivering the website may process connection and request information. This notice makes no unverified promise about provider retention periods, processing locations or deletion procedures. Those arrangements must be reflected in the notice as the service changes.

## Published content and external links

Personal information is published only through the applicable editorial and permission controls. Reference photographs, specimen records and educational sources link to external services with their own privacy notices. No advertising or analytics integration was identified in this repository; that is not a guarantee about every external service.

## Contact and future features

Official privacy and accessibility channels will appear on the [contact page](/contact) when confirmed. Do not treat that page as an operational enquiry form. Before public collection forms or tracking are introduced, this notice must describe the actual fields, purposes, recipients, access and retention arrangements.

**title**

Privacy

**description**

How the EACH website handles public content, restricted staff access and technical information.

### pages/terms

Status: approved for implementation. Contact and location fields are unchanged.

**body**

## About the website

This website presents information about East African Community Herbariums (EACH), plant conservation and botanical knowledge. EACH is a new organisation. Its starter projects are plans, not completed case studies or evidence of achieved results.

## Educational information

Plant information is for education and conservation. It is not medical advice and does not establish that a plant or traditional preparation is safe or effective. Consult a qualified health professional about health concerns.

## Material and permissions

Third-party photographs and specimen images retain their stated credits and licences. Reuse must follow the applicable licence. No blanket licence is granted over all text, community knowledge, personal information or brand assets. Use of EACH and Bitwiire names and logos requires the relevant rights holder's permission.

## Independent organisations and external references

EACH and Bitwiire Herbarium Cafe are independent: neither owns or runs the other. External botanical and conservation sources are attributed to their original institutions; a reference link does not establish an EACH partnership or endorsement.

## Services and project plans

This website does not currently provide public enquiry or application forms, a searchable EACH specimen catalogue, medical services or research-access agreements. Project plans describe intended work subject to practical arrangements, permissions and responsible participation.

## Contact and changes

Official contact and location details are being confirmed on the [contact page](/contact). These terms may be updated as the website's functions change. No regulatory compliance or unverified legal registration claim is made here.

**description**

Terms for using EACH website information, reference material and educational guides.

### programmes/plant-conservation

Status: approved for implementation. Contact and location fields are unchanged.

**content.approach.details**

EACH's botanical documentation foundations project will establish record templates, identification checks and documentation standards before any collecting activity. It is planned work, not a claim of completed surveys or specimen holdings.

### programmes/environmental-conservation

Status: approved for implementation. Contact and location fields are unchanged.

**content.mosaics.details**

The plant learning resources project will prepare introductory material connecting plants with habitats, water, soil and responsible environmental observation. Educational work will be distinguished from habitat restoration or measured conservation outcomes.

### pages/accessibility

Status: approved for implementation. Contact and location fields are unchanged.

**body**

## How the website is built

Pages use headings, landmarks and lists. Keyboard focus and a skip link support navigation. Images have text alternatives or are decorative. Reduced-motion preferences are respected, and content is available without JavaScript.

## Testing and limits

Development checks include axe scans, keyboard use, responsive layouts, reduced motion and pages without JavaScript. Automated checks do not establish universal usability or certify conformance. A manual screen-reader audit remains part of the future quality milestone.

## Feedback

An official accessibility contact and response target are being confirmed. Once available, feedback can identify the page and task that was difficult, without including sensitive personal information.

## Selected starter projects

1. **Botanical documentation foundations** — establish traceable record fields, identification checks and the prerequisites for future herbarium work. Start with preparation and attributed reference records; no collecting or holdings are claimed.
2. **Plant learning resources** — develop introductory material and supervised activity outlines. The website guides are educational starting material; no delivered workshops, schools or participant counts are claimed.
3. **Community knowledge dialogue** — prepare for listening and agreement about purpose, consent, attribution, access and benefits. No named community, participation or consent is assumed.

All three records have status **Planned**, unknown locations and dates, no assigned partners and no outcomes. Full approved objectives, planned activities and narrative are maintained in `prisma/seed/starter-projects.ts` and the corresponding CMS records.

## Educational website guides

- **Understanding a herbarium record** — `/resources/understanding-herbarium-records`.
- **Responsible plant documentation** — `/resources/responsible-plant-documentation`.
- **Knowledge, consent and attribution** — `/resources/knowledge-consent-and-attribution`.

The guides were prepared for this website under the owner's authorisation, dated 2026-10-21. They are not historical research papers or reports of completed EACH projects. The full text and source references are in `prisma/seed/learning-guides.ts` and the CMS. Corporate authorship identifies EACH's approved website material; no fictional researcher is credited.

## Evidence and references

- Institutional baseline: `AGENTS.md`, the approved homepage supporting line, and the owner's confirmation that EACH is new.
- [Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium).
- [GBIF — occurrence data quality requirements](https://www.gbif.org/data-quality-requirements-occurrences).
- [CBD Nagoya Protocol Article 7](https://www.cbd.int/abs/text/articles?sec=abs-07) and [Article 12](https://www.cbd.int/abs/text/articles?sec=abs-12).
- Reference images: `src/config/media.ts`, `src/content/specimens.ts` and `public/images/README.md`. They do not document EACH activities or ownership.

No independent botanical, clinical, legal or regulatory certification is claimed by the owner's approval. Operational permissions and safeguards remain prerequisites for executing project activities; they are not outstanding website-copy approvals.

## Complete starter-project copy

### Botanical documentation foundations

A planned project to establish traceable plant records, identification checks and the documentation standards needed for future herbarium development.

Status: Planned. Locations, dates and partner assignments are not announced. No outcomes are claimed.

Objectives:

- Define the information needed for a reliable plant record
- Prepare identification and source-checking procedures
- Establish requirements for permitted collecting and responsible curation before specimens are gathered

Planned activities:

- Prepare record templates and a review checklist
- Use attributed reference records to test documentation methods
- Assess the expertise, permissions and repository arrangements needed for future work

**Start with documentation**

The first step is to define how a plant observation or specimen would be recorded and checked. Reference records can support preparation without claiming that EACH has collected specimens.

**Prepare before fieldwork**

Any later collecting will require suitable expertise, permissions and curation arrangements. This project plan does not announce fieldwork or establish ownership of a collection.

References:

- [GBIF — occurrence data quality requirements](https://www.gbif.org/data-quality-requirements-occurrences)
- [Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium)

### Plant learning resources

A planned project to develop accessible introductory material about plants, habitats and responsible botanical observation for learners and future volunteers.

Status: Planned. Locations, dates and partner assignments are not announced. No outcomes are claimed.

Objectives:

- Make introductory botanical concepts easier to understand
- Connect plant learning with habitat care and responsible observation
- Keep educational statements traceable to their sources

Planned activities:

- Develop short learning outlines and source lists
- Prepare activities that do not require unauthorised collecting
- Check explanations, image credits and accessibility before wider use

**Build from clear explanations**

The project will develop learning material around plant records, habitats and careful observation. Website guides provide an introduction; they are not evidence that teaching sessions have already taken place.

**Prepare for participation**

Any future activity will specify its intended audience, supervision, location and practical arrangements before participants are invited. No schools, delivery sites or participant numbers are announced here.

References:

- [Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium)

### Community knowledge dialogue

A planned listening and preparation project to establish respectful discussion of plant knowledge, consent, attribution and access before any knowledge is recorded.

Status: Planned. Locations, dates and partner assignments are not announced. No outcomes are claimed.

Objectives:

- Begin with knowledge holders' priorities rather than assumed research needs
- Define consent, attribution and access arrangements before documentation
- Protect restricted knowledge and discuss fair benefit-sharing terms

Planned activities:

- Prepare accessible discussion materials about purpose and intended use
- Identify the permissions and expertise needed before any engagement
- Develop a process for recording agreements and respecting decisions not to share

**Listen before documenting**

The project begins with preparation for dialogue. No named community is enrolled, no consent is presumed and no traditional knowledge is presented as already collected.

**Agree the terms first**

Future participation must be based on an understandable purpose and agreed arrangements for access, attribution and use. Restricted knowledge and sensitive identities will not be published without the relevant permissions.

References:

- [Convention on Biological Diversity — Nagoya Protocol Article 7](https://www.cbd.int/abs/text/articles?sec=abs-07)
- [Convention on Biological Diversity — Nagoya Protocol Article 12](https://www.cbd.int/abs/text/articles?sec=abs-12)

## Complete educational guide copy

### Understanding a herbarium record

An introduction to specimens, labels and traceable botanical information. This website guide makes no claim about EACH specimen holdings.

## A specimen and its context

A herbarium record connects preserved plant material with information about its identity and collection. The material and label support later checking; a photograph alone cannot establish every identification or collection detail.

## Reading carefully

Look for the scientific identification, collector, collection date, locality and repository information. Names and identifications may change as records are reviewed. Keep the source and any uncertainty attached to the information.

## Reference material on this website

The attributed sheets shown here illustrate herbarium methods. They are not EACH specimens. This guide is introductory website material, not a research paper or a report of completed collecting.

References:

- [Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium)

### Responsible plant documentation

Practical principles for keeping botanical information traceable, distinguishing observations from conclusions and respecting permissions.

## Keep the evidence with the record

Record where information came from and distinguish a direct observation from a copied record or an interpretation. Check the identification and preserve uncertainty rather than presenting a guess as a confirmed result.

## Prepare before collecting

Observation does not provide permission to collect. Any field activity needs appropriate expertise, access arrangements and any applicable permits. Sensitive locations should not be disclosed merely because a record can be shared.

## Build useful records

A clear record should identify the organism and the observation's context. Use consistent fields and review records for missing information, duplication and rights before sharing. No dataset publication or field survey by EACH is claimed in this guide.

References:

- [GBIF — occurrence data quality requirements](https://www.gbif.org/data-quality-requirements-occurrences)

### Knowledge, consent and attribution

An introduction to respectful preparation for discussions about plant knowledge, with attention to permission, restricted information and fair arrangements.

## Begin with the knowledge holders

Discuss the purpose and intended uses of any documentation in an accessible way before seeking permission. Participation must not be inferred from a conversation, a photograph or a public reference to a community.

## Agree what may be shared

People and communities may place limits on recording, attribution and reuse. Agree those limits, who may access the material and how requests to change permission will be handled. Some knowledge is not appropriate for publication.

## Establish fair arrangements

The Convention on Biological Diversity's Nagoya Protocol addresses traditional knowledge associated with genetic resources, including consent and mutually agreed terms in accordance with domestic law. Applicable requirements and benefit-sharing arrangements need to be established for the particular activity. This guide is educational and does not assert that EACH has obtained any community's consent.

References:

- [Convention on Biological Diversity — Nagoya Protocol Article 7](https://www.cbd.int/abs/text/articles?sec=abs-07)
- [Convention on Biological Diversity — Nagoya Protocol Article 12](https://www.cbd.int/abs/text/articles?sec=abs-12)
