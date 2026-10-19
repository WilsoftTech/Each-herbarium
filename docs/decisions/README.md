# Architecture decision records

Short records of significant, hard-to-reverse decisions: the choice of a library, a data model, a hosting platform or a security approach. Routine changes do not need an ADR.

## Convention

- File name: `NNNN-short-title.md`, numbered sequentially (`0001`, `0002`, …).
- Never delete an ADR. To change a decision, write a new ADR and set the old one's status to `Superseded by NNNN`.
- Keep each one to a page.

```markdown
# NNNN. Title

- **Status:** Proposed | Accepted | Superseded by NNNN
- **Date:** YYYY-MM-DD
- **Milestone:** MXX

## Context
What forces the decision.

## Decision
What we chose.

## Consequences
Trade-offs, follow-ups, what becomes easier or harder.
```

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-foundation-stack.md) | Foundation stack and minimal test tooling | Accepted |
