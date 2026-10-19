# Component inventory

Registry of implemented reusable components. **Check this before creating a component** ([AGENTS.md §4](../../AGENTS.md#components)). Update it in the same commit as any component change.

| Component   | Path                              | Type   | Purpose                                                               | Props                                    | Used by                                                                    | Since |
| ----------- | --------------------------------- | ------ | --------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- | ----- |
| `Container` | `src/components/ui/container.tsx` | Server | Centred, max-width (`max-w-7xl`) wrapper with responsive page gutters | All `<div>` props; `className` is merged | `app/(public)/page.tsx`, `app/(admin)/admin/page.tsx`, `app/not-found.tsx` | M01   |

## Shared modules

| Module                              | Path                         | Purpose                                                                                |
| ----------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `siteConfig`                        | `src/config/site.ts`         | Organisation name, short name, region, description. Used by metadata and the homepage. |
| `env`                               | `src/config/env.ts`          | Validated server environment (`server-only`). Currently `siteUrl`.                     |
| `parseServerEnv`, `serverEnvSchema` | `src/validation/env.ts`      | Pure env validation, unit-tested.                                                      |
| `requireAdmin`                      | `src/services/admin-auth.ts` | Server-side admin authorisation (`server-only`). Denies all until M04.                 |

## Styling hooks

| Hook                  | Defined in    | Purpose                                             |
| --------------------- | ------------- | --------------------------------------------------- |
| `data-surface="dark"` | `globals.css` | Switches a section to the dark cinematic token set. |

## Planned primitives (not implemented)

`Button` (shadcn/ui), `SectionHeading`, site header, footer, mega menu, mobile navigation, navigation config, motion leaves. These come in M02; see [M02](../milestones/M02-design-system.md). Add each one here only once it exists.
