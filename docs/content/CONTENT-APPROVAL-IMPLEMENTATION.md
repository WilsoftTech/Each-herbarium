# Approved content implementation — M04

## Authority and scope

Starting branch `main`, commit `8feefd7`. The project owner reports that the client reviewed and approved the prepared content, instructs implementation, and delegates selection of starter projects for the new organisation. The only outstanding client content information is contact details (including partner contacts and visiting hours) and locations. This approval is recorded from the conversation on 2026-10-21; no client signature, identity or professional certification is invented.

This work remains within M04. No production migration, database update, deployment, push or merge is performed. M05–M07 are not started. M04 remains PASS WITH CONDITIONS because its existing production and release conditions are separate from content approval.

## Reconciliation

All original 22 keys remain in the lifecycle ledger, `src/content/pending.ts`. Eighteen are `approved`: their wording or an honest alternative is accepted, and `PendingContent` renders no review notice. Four remain `missing`, solely for contact/location information:

| Key                    | Remaining information                                                           |
| ---------------------- | ------------------------------------------------------------------------------- |
| `contactDetails`       | Official EACH channels, address and opening hours                               |
| `accessibilityContact` | Accessibility channel and response target                                       |
| `bitwiireProfile`      | Bitwiire contacts, location and visiting hours; profile copy itself is approved |
| `regionalPresence`     | Confirmed addresses, field sites and project locations                          |

The [current client document](CLIENT-CONTENT-REVIEW.md) reconciles every original requirement and contains the approved copy. The [current ledger](awaiting-approval.md) replaces the previous list of missing and drafted institutional content. The old [preparation report](CONTENT-REMEDIATION-REPORT.md) and `cms-review-proposals.json` are historical evidence, not current approval requirements. The old preparation command cannot restage that closed review cycle.

Unknown names, legal registration particulars, founding dates, holdings and achievements are omitted. These facts have not been verified merely because copy was approved. Licensed reference photography and specimen attribution are retained. No staff, additional partners, locations, funders or numerical results are fabricated. Approval of educational and policy copy is not represented as independent botanical, clinical, legal or regulatory certification.

## Starter projects and educational resources

The three selected starter projects establish prerequisites rather than announcing completed operations:

1. **Botanical documentation foundations** — record templates, identification checks and requirements for responsible future collecting and curation.
2. **Plant learning resources** — accessible explanations, source lists and preparation for appropriately supervised learning activities.
3. **Community knowledge dialogue** — preparation for listening, consent, attribution, access and fair arrangements before documenting knowledge.

Each is an existing-model Project with editorial status PUBLISHED and operational status PLANNED. Locations, country, dates and period are null; partners and outcomes are empty. Objectives and activities are explicitly prospective. The UI uses “Planned”, “Explore project plan” and “Planned approach”, rather than presenting them as completed case studies. Reference photographs do not document project activities. No fieldwork is initiated by publishing a project plan.

Three GUIDE articles provide new educational website material: **Understanding a herbarium record**, **Responsible plant documentation**, and **Knowledge, consent and attribution**. They are dated 2026-10-21 as newly prepared website guides, not historical research publications. External references retain attribution to [Kew](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium), [GBIF](https://www.gbif.org/data-quality-requirements-occurrences) and the [CBD Nagoya Protocol](https://www.cbd.int/abs/text/articles?sec=abs-07). No institutional affiliation with those sources is claimed.

Legacy sample records retain their stable identifiers, labels and noindex safeguards. They are excluded from lists, homepage selection and project sequence navigation. Current route tests cover the real starter plans and guides; legacy samples are still checked as design references.

## Authoritative sources and CMS application

`docs/content/approved-content.json` supplies approved page/programme field patches. Seed sources apply those patches to new rows; the normal seed remains create-only and does not overwrite existing editorial values. `starter-projects.ts` and `learning-guides.ts` supply the new approved records, reusing existing licensed media. There are no new database models, migrations, packages or public forms.

`scripts/apply-approved-content.ts` is an explicitly owner-authorised, dev-only operation. It imports the existing editor parsers, save adapters and publishing validators; rejects unrelated pending edits or stale base versions; records review/publication audit events; and preserves existing starter records on reruns. Existing page/programme publication dates remain intact when revisions are applied. New records pass Draft → In review → Published. Contact/location settings are untouched. Only the exact obsolete default footer note is replaced; custom footer edits are preserved.

The operation uses a system actor, not a fabricated or impersonated administrator. The internal save/status actor types now accept null for system operations, as the database already supports; normal Server Actions still call `requireAdmin()` and retain role checks. This does not add a public bypass or alter authentication. The process-local Node hook loads server adapters for this CLI only; the app's `server-only` boundary is unchanged.

CLI publication requires a rebuild/restart to refresh public caches. Staff publication continues to use its existing cache invalidation. The new build verifies the approved content in an isolated schema before browser checks.

## Public routes

Approved CMS copy affects `/`, `/about`, `/about/mission`, `/about/leadership`, `/about/partners`, `/partnerships`, `/bitwiire-herbarium-cafe`, `/our-work`, `/herbarium`, `/research`, `/resources`, `/projects`, `/volunteer`, `/impact`, `/privacy`, `/terms` and `/accessibility`, plus all four `/our-work/<programme>` pages. Three new `/projects/<slug>` plans and three `/resources/<slug>` guides use the names listed above. The shared footer changes across public pages. Contact settings remain empty and their existing routes keep controlled notices.

## Executed development changes

The approved-content operation applied 21 page/programme revisions: 17 pages and all four founding programmes. It created three planned projects and three educational guides. A rerun reported every target already current or an existing record preserved. The obsolete default footer note was updated without changing contact fields. No user identities or CMS roles were created or changed.

A read-only check printed three projects with `status: PUBLISHED`, `operationalStatus: PLANNED`, null locations/dates, empty outcomes and partners; three published GUIDE articles; zero pending page/programme revisions; and empty contact/location settings. No production target was used.

## Verification

Windows commands use `npm.cmd`/`npx.cmd`. Unit/integration tests use the existing dedicated `each_test` schema. Browser verification uses a fresh `each_approved_content_e2e` schema on dev with the six existing migrations and normal seed (16 media, four programmes, six projects including three legacy samples, six articles including three legacy samples, one partner, 19 pages). Direct dev connections support the schema-specific search path. Production and approved main-schema records are isolated from test mutations.

| Command                    | Result                                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm.cmd run format:check` | PASS: All matched files use Prettier code style!                                                                                                                                                                                                             |
| `npm.cmd run typecheck`    | PASS: generated client and route types; no TypeScript errors                                                                                                                                                                                                 |
| `npm.cmd run lint`         | PASS: no findings                                                                                                                                                                                                                                            |
| `npm.cmd test`             | Initial full run: 473 passed, 2 stale-placeholder assertion failures (27 files, 475 tests; 1010.85s). After correction: `npm.cmd test -- tests/unit/program-explorer.test.tsx tests/integration/cms-integration.test.ts` PASS, 2 files / 23 tests (306.27s). |
| `npm.cmd run build`        | PASS: compiled successfully; 85/85 pages generated                                                                                                                                                                                                           |
| `npm.cmd run test:e2e`     | Initial full run: 139 passed, 1 stale-heading failure, 3 opt-in screenshot skips, 2 blocked by serial dependency. After correction: `npm.cmd run test:e2e -- --grep=designed` PASS, all 3 affected tests (2.3m).                                             |

All tests that initially failed or were blocked by their serial dependency passed in the targeted reruns; the other checks passed in the initial full runs. The full suites were not repeated after those assertion-only corrections.

The initial test failures were stale content assertions: two unit tests still treated approved leadership/values as outstanding, and one browser test expected the previous herbarium section heading. Assertions now follow the approved content while retaining checks for pending notices, private previews and publication controls. A first targeted browser invocation matched no tests because its multiword filter was not shell-quoted; the corrected invocation uses `--grep=designed`.

Initial implementation checks found nullable system-actor types in the CLI; these were corrected explicitly without changing staff authorisation. The first CLI attempt stopped before content writes because no active administrator existed; the authorised system operation then reused the existing validators and published successfully. Existing Node child-process and pg deprecation warnings remain quality-audit observations.

## Documentation and handoff

Updated the approved client copy, awaiting-information ledger, historical report pointer, roadmap, M04 specification, CMS integration matrix and component inventory. Tests now check approved marker retirement, substantive planned projects, absent fabricated facts, attributed guides, sample omission and actual public route reachability.

Only contact and location information is still requested from the client. Future project execution must satisfy appropriate permissions, expertise, safeguarding and participation arrangements; none is presumed to exist merely because a plan is published. No next engineering milestone is started automatically.
