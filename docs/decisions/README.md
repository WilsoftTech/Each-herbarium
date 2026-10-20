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

| ADR                                                | Title                                                        | Status                                              |
| -------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| [0001](0001-foundation-stack.md)                   | Foundation stack and minimal test tooling                    | Accepted                                            |
| [0002](0002-modular-monolith.md)                   | Modular monolith, route groups and environment validation    | Accepted                                            |
| [0003](0003-animation-architecture.md)             | Animation architecture and reduced motion                    | Accepted                                            |
| [0004](0004-platform-and-ui-stack.md)              | Platform and UI stack                                        | Accepted                                            |
| [0005](0005-interim-photography.md)                | Interim photography from openly licensed sources             | Accepted                                            |
| [0006](0006-content-contracts-and-placeholders.md) | Content contracts, static sources and visible placeholders   | Accepted (static sources replaced by 0007)          |
| [0007](0007-cms-editorial-workflow.md)             | Custom CMS on Prisma + Neon, editorial workflow and caching  | Accepted (published edits amended by 0011)          |
| [0008](0008-admin-authentication.md)               | Admin authentication with Better Auth, roles in app code     | Accepted                                            |
| [0009](0009-media-storage.md)                      | Media uploads to a private R2 bucket through the server      | Accepted                                            |
| [0010](0010-neon-managed-backend.md)               | Neon Managed Auth, Object Storage and Functions              | Accepted (supersedes provider choices in 0008/0009) |
| [0011](0011-content-revisions.md)                  | Pending revisions keep published content live until approval | Accepted                                            |
