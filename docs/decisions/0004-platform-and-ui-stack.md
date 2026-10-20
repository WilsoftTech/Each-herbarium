# 0004. Platform and UI stack

> M04 backend update: [ADR 0010](0010-neon-managed-backend.md) selects Neon Managed Auth and Neon Object Storage. The original R2 and self-hosted identity choices below are superseded.

- **Status:** Accepted (set by the project brief, M01 revision 2)
- **Date:** 2026-10-19
- **Milestone:** M01 (revision 2)

## Decision

| Concern             | Choice                                                                                               | Introduced                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| UI primitives       | shadcn/ui (components copied into `src/components/ui/`, styled with EACH tokens)                     | M02, with the first component                                   |
| Animation           | GSAP + ScrollTrigger, and Motion for React where useful ([ADR 0003](0003-animation-architecture.md)) | M02                                                             |
| Database            | PostgreSQL on Neon, accessed through Prisma                                                          | M04                                                             |
| Media storage       | Cloudflare R2                                                                                        | M04                                                             |
| Transactional email | Resend                                                                                               | M05                                                             |
| Hosting             | Vercel                                                                                               | M07 (preview deployments may be enabled earlier, with approval) |
| CI                  | GitHub Actions                                                                                       | M01                                                             |

Decided in M04: the CMS approach ([ADR 0007](0007-cms-editorial-workflow.md)), the admin identity provider ([ADR 0008](0008-admin-authentication.md)) and the media pipeline ([ADR 0009](0009-media-storage.md)).

## shadcn/ui preparation

The semantic tokens in `globals.css` already use shadcn/ui names (`background`, `foreground`, `primary`, `primary-foreground`, `accent`, `accent-foreground`, `muted`, `muted-foreground`, `border`, `ring`), mapped through `@theme inline`. When `npx shadcn@latest init` runs in M02:

- Keep the existing token values. Do not accept the CLI's default palette over them.
- Review every dependency it adds (`class-variance-authority`, `clsx`, `tailwind-merge`, icons, `tw-animate-css`) and record them in the tech stack.
- Replace the hand-written class joining in `Container` with the generated `cn()` helper.

## Consequences

Nothing on this list is installed before its milestone, which keeps M01 small. Each tool still needs its own version and compatibility check when it is introduced.
