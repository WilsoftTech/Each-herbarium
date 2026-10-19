# Component inventory

Registry of implemented reusable components. **Check this before creating a component** ([AGENTS.md §4](../../AGENTS.md#components)). Update it in the same commit as any component change.

| Component | Path | Type | Purpose | Props | Used by | Since |
|---|---|---|---|---|---|---|
| `Container` | `src/components/ui/container.tsx` | Server | Centred, max-width (`max-w-7xl`) wrapper with responsive page gutters | All `<div>` props; `className` is merged | `app/page.tsx`, `app/not-found.tsx` | M01 |

## Shared configuration

| Module | Path | Purpose |
|---|---|---|
| `siteConfig` | `src/config/site.ts` | Organisation name, short name, region, description. Used by metadata and the homepage. |

## Planned primitives (not implemented)

`Button`, `SectionHeading`, site header, footer, mega menu, mobile navigation and navigation config. These come in M02; see [M02](../milestones/M02-design-system.md). Add each one here only once it exists.
