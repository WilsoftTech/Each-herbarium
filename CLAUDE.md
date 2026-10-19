# CLAUDE.md

Instructions for Claude Code. **[AGENTS.md](AGENTS.md) is the authoritative rule set — follow it in full.** This file adds the Claude Code working procedure.

@AGENTS.md

## Session startup

1. Read `CLAUDE.md` and `AGENTS.md`.
2. Read [ROADMAP.md](ROADMAP.md) and identify the current milestone.
3. Run `git status` and `git log --oneline -5`.
4. Read the current milestone specification in [docs/milestones/](docs/milestones/README.md).
5. Review the relevant ADRs in [docs/decisions/](docs/decisions/README.md).
6. Inspect the existing code you will touch before editing.

## Implementation procedure

For each task:

1. Understand the requirement and its milestone acceptance criteria.
2. Inspect the existing implementation.
3. Check [docs/components/inventory.md](docs/components/inventory.md) for reusable components.
4. Plan the smallest safe change.
5. Implement.
6. Run verification (AGENTS.md §5).
7. Update documentation.
8. Commit when the task or milestone meets its acceptance criteria.

## Milestone boundaries

**Never start the next milestone automatically.** When a milestone is finished:

1. Verify every exit criterion with real command output.
2. Complete the [completion checklist](docs/milestones/README.md#completion-checklist).
3. Commit the milestone and confirm the hash with `git log`.
4. Produce the completion report below.
5. Stop and wait for approval.

## Context efficiency

- Read the files relevant to the task, not the whole repository. Avoid repeated full scans.
- Prefer the Next.js docs bundled in `node_modules/next/dist/docs/` over memory for framework APIs.
- Do not regenerate unchanged files or reinstall packages unnecessarily.
- Keep responses concise and evidence-based.

## Milestone report format

1. **Verdict:** `PASS`, `PASS WITH CONDITIONS` or `BLOCKED`.
2. Implemented features.
3. Files changed.
4. Dependencies added, with reasons.
5. Components reused.
6. Components created.
7. Tests executed (exact commands).
8. Test results (as printed).
9. Risks and blockers.
10. Git commit hash.
11. Exit-gate verdict.
