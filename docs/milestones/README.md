# Milestones

One executable specification per milestone. Status lives in [ROADMAP.md](../../ROADMAP.md).

| ID | Document |
|---|---|
| M01 | [M01-foundation.md](M01-foundation.md) |
| M02 | [M02-design-system.md](M02-design-system.md) |
| M03 | [M03-public-website.md](M03-public-website.md) |
| M04 | [M04-cms-database.md](M04-cms-database.md) |
| M05 | [M05-communications.md](M05-communications.md) |
| M06 | [M06-quality-audit.md](M06-quality-audit.md) |
| M07 | [M07-production-release.md](M07-production-release.md) |

## Specification format

Each document has: **Goal**, **Scope**, **Out of scope**, **Tasks**, **Acceptance criteria** (checkboxes), **Verification** (commands), **Verification record** (filled on completion) and **Risks**.

## Completion checklist

Do this for every milestone, in this order, before reporting completion:

1. Run the full verification suite ([AGENTS.md §5](../../AGENTS.md#5-testing)) and fix blocking failures.
2. Tick only the acceptance criteria that were actually verified. Mark the others `BLOCKED` or `NOT VERIFIED`.
3. Fill the milestone's **Verification record** with the commands and real results.
4. Update [ROADMAP.md](../../ROADMAP.md): status, current milestone, risks.
5. Update [master-roadmap.md](../roadmap/master-roadmap.md) if the plan changed.
6. Update architecture docs if the architecture changed.
7. Update the [component inventory](../components/inventory.md) if components changed.
8. Add ADRs for significant decisions.
9. Add an audit entry in [docs/audits/](../audits/README.md).
10. Stage the intended files only, inspect `git diff --staged`, commit everything (docs included) with the milestone commit message, and confirm the hash with `git log`.
11. Record the hash in the verification record and ROADMAP in a follow-up `docs(mXX)` commit. A commit cannot contain its own hash.
12. Report and stop. Do not start the next milestone without approval.
