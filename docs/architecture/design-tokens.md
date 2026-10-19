# Design tokens

Source of truth: `src/app/globals.css`. Components use the **semantic** utilities only. Names follow shadcn/ui conventions ([ADR 0004](../decisions/0004-platform-and-ui-stack.md)).

## Brand palette (provisional)

Sampled from the original logo `public/brand/each-logo.jpeg`. The logo is a JPEG, so the samples are approximate.

| Token                 | Value     | Logo sample                          | Notes                              |
| --------------------- | --------- | ------------------------------------ | ---------------------------------- |
| `--brand-green`       | `#176B28` | wordmark `#1E6000`, leaf `#3F9003`   | Same family, not exact             |
| `--brand-blue`        | `#087DB9` | globe gradient `#069BD5` → `#0D2D76` | Within the gradient                |
| `--brand-charcoal`    | `#151A18` | tagline `#010101`                    | Softened from near-black           |
| `--brand-ivory`       | `#F6F7F2` | —                                    | Background colour, not in the logo |
| `--brand-green-light` | `#6FBF4A` | —                                    | Derived tint for dark surfaces     |
| `--brand-blue-light`  | `#4FB3E8` | —                                    | Derived tint for dark surfaces     |

**Status:** provisional until official brand values or a vector master are available (M02).

## Semantic tokens

| Utility                                                  | Light surface (default) | Dark surface (`data-surface="dark"`) |
| -------------------------------------------------------- | ----------------------- | ------------------------------------ |
| `bg-background` / `text-foreground`                      | ivory / charcoal        | charcoal / ivory                     |
| `text-primary`, `bg-primary` + `text-primary-foreground` | green / ivory           | light green / charcoal               |
| `text-accent`, `bg-accent` + `text-accent-foreground`    | blue / white            | light blue / charcoal                |
| `bg-muted` / `text-muted-foreground`                     | `#E8EBE3` / `#4A524E`   | `#232A27` / `#B7BEB9`                |
| `border-border`                                          | `#D9DDD3`               | `#2C3330`                            |
| `ring-ring`                                              | blue                    | light blue                           |

Apply `data-surface="dark"` to any container to switch a whole section to the dark cinematic palette. The homepage placeholder uses it.

## Measured contrast (WCAG 2.2)

| Pair                                | Ratio   | Use                              |
| ----------------------------------- | ------- | -------------------------------- |
| charcoal on ivory                   | 16.35:1 | All text                         |
| muted-foreground on ivory           | 7.48:1  | All text                         |
| green on ivory (and ivory on green) | 6.15:1  | All text                         |
| white on blue (accent-foreground)   | 4.52:1  | All text (AA)                    |
| blue on ivory                       | 4.20:1  | **Large text and non-text only** |
| ivory on charcoal                   | 16.35:1 | All text                         |
| light green on charcoal             | 7.74:1  | All text                         |
| light blue on charcoal              | 7.50:1  | All text                         |
| dark muted-foreground on charcoal   | 9.29:1  | All text                         |

## Motion

| Token                         | Value                            | Use                  |
| ----------------------------- | -------------------------------- | -------------------- |
| `ease-cinematic` (utility)    | `cubic-bezier(0.22, 1, 0.36, 1)` | Reveals, menu panels |
| `ease-standard` (utility)     | `cubic-bezier(0.4, 0, 0.2, 1)`   | UI state changes     |
| `--motion-duration-fast`      | 150ms                            | Hover and focus      |
| `--motion-duration-base`      | 300ms                            | Menus and toggles    |
| `--motion-duration-slow`      | 700ms                            | Section reveals      |
| `--motion-duration-cinematic` | 1200ms                           | Hero sequences       |

Under `prefers-reduced-motion: reduce`, CSS animations and transitions collapse to their end state. JavaScript animation rules: [ADR 0003](../decisions/0003-animation-architecture.md).
