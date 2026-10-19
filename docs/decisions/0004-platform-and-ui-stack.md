# 0004. Platform and UI stack

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

Not yet decided: the admin identity provider (M04 ADR) and the CMS approach (M04 ADR).

## shadcn/ui preparation

The semantic tokens in `globals.css` already use shadcn/ui names (`background`, `foreground`, `primary`, `primary-foreground`, `accent`, `accent-foreground`, `muted`, `muted-foreground`, `border`, `ring`), mapped through `@theme inline`. When `npx shadcn@latest init` runs in M02:

- Keep the existing token values. Do not accept the CLI's default palette over them.
- Review every dependency it adds (`class-variance-authority`, `clsx`, `tailwind-merge`, icons, `tw-animate-css`) and record them in the tech stack.
- Replace the hand-written class joining in `Container` with the generated `cn()` helper.

## Consequences

Nothing on this list is installed before its milestone, which keeps M01 small. Each tool still needs its own version and compatibility check when it is introduced.
