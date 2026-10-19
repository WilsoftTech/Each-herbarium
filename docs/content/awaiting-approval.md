# Content awaiting approval

What EACH needs to supply or confirm before the public site can present it as fact. This is a content list, not an engineering defect list (engineering status: [M03 verification](../audits/M03-verification.md)).

The source of truth is [`src/content/pending.ts`](../../src/content/pending.ts). Every placeholder on the site names one of the keys below and renders a visible label: **Awaiting content from EACH** (missing) or **Draft for EACH review** (proposed wording). A unit test (`tests/unit/content.test.ts`) fails if a key is missing from this document or no longer shown on the site.

## Missing content

| Key                    | What is needed                                                                                               | Shown on                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `organisation`         | Legal status, registration number, registered address, and who is responsible for the website                | `/about`                                                                 |
| `history`              | When, why and by whom EACH was founded; milestones so far                                                    | `/about`                                                                 |
| `leadership`           | Names, roles, biographies and photographs of leadership, board or advisers, with consent to publish          | `/about/leadership` (not indexed)                                        |
| `partners`             | Confirmed partners other than Bitwiire: names, descriptions, nature of partnership, logos with permission    | `/about/partners`                                                        |
| `bitwiireProfile`      | A description approved by Bitwiire, location, opening hours, photographs, how the partnership works          | `/bitwiire-herbarium-cafe`, homepage                                     |
| `projects`             | Real projects: names, locations, dates, partners, objectives, photography, verified outcomes                 | `/projects`, `/projects/[slug]` (not indexed), homepage, programme pages |
| `regionalPresence`     | Sites, districts or countries where EACH works today, and planned expansion                                  | Homepage                                                                 |
| `herbariumStatus`      | Whether EACH holds specimens, where they are housed, curation standards, accession records, partner herbaria | `/herbarium`                                                             |
| `resources`            | Real publications, guides and stories: titles, authors, dates, summaries, files or text                      | `/resources`, `/resources/[slug]` (not indexed), `/research`, homepage   |
| `impactFigures`        | What EACH will measure, then verified figures with source, method and date                                   | `/impact`, `/projects/[slug]`                                            |
| `volunteerRoles`       | Real opportunities: roles, requirements, locations, time commitment, safeguarding policy                     | `/volunteer`                                                             |
| `contactDetails`       | Email, telephone, postal address, office hours, official social accounts                                     | `/contact`                                                               |
| `accessibilityContact` | A contact for accessibility feedback and a target response time                                              | `/accessibility`                                                         |
| `photography`          | EACH's own photographs, with permissions, to replace the licensed stand-ins                                  | `/about` (all photography is affected)                                   |

## Draft wording to confirm or replace

| Key                  | What is drafted                                                                          | Shown on                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `missionStatement`   | Mission page built from the approved homepage line; official mission and vision needed   | `/about/mission`                                                                    |
| `values`             | Six draft principles                                                                     | `/about/mission`                                                                    |
| `programmeDetails`   | Programme pages explain each field in general terms; EACH's activities are not described | `/our-work`, `/our-work/plant-conservation`, `/our-work/environmental-conservation` |
| `researchThemes`     | Four draft research themes; research partners, affiliations and ethics arrangements      | `/research`                                                                         |
| `medicinalReview`    | Approach to medicinal plants; needs review by a qualified botanist or ethnobotanist      | `/our-work/medicinal-plants`                                                        |
| `communityProtocols` | Four draft principles for recording community knowledge                                  | `/our-work/indigenous-knowledge`                                                    |
| `partnershipModel`   | Four draft partnership types                                                             | `/partnerships`                                                                     |
| `legalPolicies`      | Draft privacy policy and terms of use; legal review and data controller details needed   | `/privacy`, `/terms`                                                                |

## Copy written for M03 that EACH should review

Beyond the keys above, all page copy was drafted in M03 and needs EACH's review before launch. It follows these rules:

- **Verified facts only about EACH:** the name, short name, focus (plant conservation, herbarium development, botanical knowledge), that EACH operates first in Uganda within East Africa, and that Bitwiire Herbarium Cafe is an independent partner. The homepage headline and supporting line are the approved M02 copy.
- **General knowledge, stated as such:** how herbaria, plant conservation and ecosystems work, and descriptions of the photographed landscapes and specimens. Specific facts used: _Prunus africana_ is listed in CITES Appendix II; the Nagoya Protocol under the Convention on Biological Diversity sets out benefit sharing; Uganda's Data Protection and Privacy Act, 2019.
- **No efficacy claims** for any plant; the medicinal plants page leads with a "not medical advice" notice.
- **No figures:** the impact page shows proposed measures with no values.
- **Placeholders are labelled** on the page, carry `status: "placeholder"` in the content source, are excluded from structured data, and their detail pages are not indexed.
- **Reference specimens** on `/herbarium` and `/our-work/medicinal-plants` are Kew-imaged sheets collected in Uganda, captioned "Reference image, not an EACH specimen". Their label data is transcribed from the Wikimedia Commons and GBIF records.
- **Navigation labels** follow the agreed route list and are part of the copy review.

## Owner actions outside the content register

- Supply a vector (SVG) or transparent PNG master of the EACH logo (open since M02).
