# Content approval ledger

Current authority: the project owner reports client review and approval and instructs implementation. See [approved copy](CLIENT-CONTENT-REVIEW.md) and [implementation report](CONTENT-APPROVAL-IMPLEMENTATION.md).

**Only contacts and locations remain pending.** The lifecycle register is `src/content/pending.ts`: `approved` entries render no notice; `missing` entries remain visible. All 22 original keys are retained for auditability. Approval records acceptance of honest copy or omission, not verification of facts that were never supplied.

## Outstanding contact and location information

| Key                    | Information still needed                                                                |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `contactDetails`       | Official EACH contact channels, address and opening hours.                              |
| `accessibilityContact` | Authorised accessibility contact and response target.                                   |
| `bitwiireProfile`      | Bitwiire contact information, location and visiting hours; profile wording is approved. |
| `regionalPresence`     | EACH and partner addresses, field sites and project locations.                          |

## Approved or resolved by an honest alternative

| Original key         | Disposition                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `organisation`       | Approved organisational introduction; registration particulars omitted.                                                |
| `history`            | Approved new-organisation introduction; no invented founding date or timeline.                                         |
| `missionStatement`   | Mission and vision adopted as editorial copy.                                                                          |
| `values`             | Values and strategic objectives adopted.                                                                               |
| `leadership`         | Governance responsibilities adopted; unverified named profiles omitted.                                                |
| `partners`           | Independent partner statement approved; no additional named partners invented.                                         |
| `partnershipModel`   | Collaboration framework approved; no signed agreements claimed.                                                        |
| `programmeDetails`   | Focus areas and starter directions approved; operational work distinguished from plans.                                |
| `projects`           | Three selected starter plans published with operational status PLANNED.                                                |
| `herbariumStatus`    | Development and reference-specimen explanation approved; no holdings invented.                                         |
| `researchThemes`     | Research directions approved; no active study, funding or affiliation invented.                                        |
| `resources`          | Three original educational website guides provided with attributed sources.                                            |
| `medicinalReview`    | Conservative educational wording approved; medical disclaimer retained; no specialist review is falsely claimed.       |
| `communityProtocols` | Responsible preparation principles approved; no community participation or consent presumed.                           |
| `volunteerRoles`     | Planned contribution areas approved; no open vacancies or recruitment process claimed.                                 |
| `impactFigures`      | Measurement framework approved; no numeric results or zero baseline invented.                                          |
| `photography`        | Existing licensed reference imagery accepted; original brands and credits preserved.                                   |
| `legalPolicies`      | Implementation-based privacy and terms copy approved; no compliance certification or unverified registration asserted. |

There are no other outstanding client content approvals. Unknown names, legal particulars, dates, holdings and achievements are omitted; licensed reference images remain attributed. Additional projects, partnerships, recruitment and research must be described accurately when they actually occur. The original logo is unchanged; a higher-quality master is optional asset improvement, not a blocker to the approved copy.

Production migration, deployment, auth configuration and M05–M07 engineering gates are separate from content approval and are not authorised by this ledger.
