# Design tokens

Source of truth: `src/app/globals.css`. Components use the **semantic** utilities only. Names follow shadcn/ui conventions ([ADR 0004](../decisions/0004-platform-and-ui-stack.md)). A live preview is at `/design-system` (not indexed).

## Brand palette

Checked against the original logo `public/brand/each-logo.jpeg` in M02 by averaging pixel regions with `sharp`. The logo is a JPEG, so the samples are approximate.

| Token                 | Value     | Logo sample (M02)                            | Notes                                                  |
| --------------------- | --------- | -------------------------------------------- | ------------------------------------------------------ |
| `--brand-green`       | `#176B28` | wordmark "EACH" `#24630B`, leaf `#418B0B`    | Same hue family; deeper, for AA text contrast on ivory |
| `--brand-blue`        | `#087DB9` | globe upper `#158CC8`, globe lower `#104182` | Inside the globe's gradient range                      |
| `--brand-charcoal`    | `#151A18` | tagline `#050404`                            | Softened from near-black, with a slight green cast     |
| `--brand-ivory`       | `#F6F7F2` | —                                            | Warm background colour, not in the logo                |
| `--brand-green-light` | `#6FBF4A` | —                                            | Derived tint for dark surfaces                         |
| `--brand-blue-light`  | `#4FB3E8` | —                                            | Derived tint for dark surfaces                         |

**Status:** consistent with the logo, but not official. Replace them with official brand values if EACH supplies them.

## Semantic colour tokens

| Utility                                                  | Light surface (default) | Dark surface (`data-surface="dark"`) |
| -------------------------------------------------------- | ----------------------- | ------------------------------------ |
| `bg-background` / `text-foreground`                      | ivory / charcoal        | charcoal / ivory                     |
| `bg-card` / `text-card-foreground`                       | `#FFFFFF` / charcoal    | `#1C2220` / ivory                    |
| `text-primary`, `bg-primary` + `text-primary-foreground` | green / ivory           | light green / charcoal               |
| `text-accent`, `bg-accent` + `text-accent-foreground`    | blue / white            | light blue / charcoal                |
| `bg-muted` / `text-muted-foreground`                     | `#E8EBE3` / `#4A524E`   | `#232A27` / `#B7BEB9`                |
| `border-border`                                          | `#D9DDD3`               | `#2C3330`                            |
| `ring-ring` (focus outline)                              | blue                    | light blue                           |
| `bg-scrim`                                               | charcoal at 50%         | same                                 |

Apply `data-surface="dark"` to any container to switch a whole section to the dark palette. Its background and text colour are set in the base layer, so utilities such as `bg-transparent` can override them (the transparent header relies on this).

### Warm partner surface (M03)

`data-surface="warm"` (or `Section surface="warm"`) is reserved for sections about **Bitwiire Herbarium Cafe**, an independent partner. It keeps the partner visually distinct from EACH's green and blue. These are EACH presentation tokens, **not** Bitwiire brand colours; none have been supplied.

| Token                                 | Value                 | Measured contrast                                              |
| ------------------------------------- | --------------------- | -------------------------------------------------------------- |
| `--background` / `--foreground`       | `#F2E9DC` / `#2B201A` | 13.19:1                                                        |
| `--card` / `--card-foreground`        | `#FBF6EF` / `#2B201A` | 14.75:1                                                        |
| `--primary` (clay)                    | `#8B4A22`             | 5.63:1 on background, 6.30:1 on card, 5.01:1 on muted          |
| `--primary-foreground` on `--primary` | `#FBF6EF`             | 6.30:1                                                         |
| `--accent` (olive)                    | `#5E6B2E`             | 4.83:1 on background, 5.40:1 on card                           |
| `--muted` / `--muted-foreground`      | `#E8DCCB` / `#5C4A3D` | 6.21:1 (muted-foreground on background 6.98:1, on card 7.81:1) |
| `--border`, `--ring`                  | `#D9C7B0`, `#8B4A22`  | —                                                              |

### Utilities added in M03

| Utility               | Purpose                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `bg-specimen-grid`    | Fine ruled grid drawn with `--border`, like a herbarium cutting mat (herbarium page only) |
| `animate-clip-reveal` | 1.4 s cinematic clip reveal for photographs visible on first paint (`PageHeader`)         |

## Typography

| Font                      | Loaded with                               | Use                                                    |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| Fraunces (variable, opsz) | `next/font/google`, `display: "optional"` | `font-display`: headlines, menu summaries, card titles |
| Geist                     | `next/font/google`, `display: "swap"`     | `font-sans`: body, UI, navigation                      |

Fraunces uses `optional` because a late swap rewraps the hero headline. With fonts delayed by 1.2 s, `swap` measured CLS 0.22 and `optional` measured 0.0002.

Fluid scale (`clamp()`, from 320 px to 1440 px or wider):

| Utility           | Size                  | Line height | Tracking |
| ----------------- | --------------------- | ----------- | -------- |
| `text-display-xl` | 2.75rem → 7rem        | 0.98        | −0.025em |
| `text-display-lg` | 2.25rem → 4.5rem      | 1.02        | −0.02em  |
| `text-display-md` | 1.875rem → 3rem       | 1.08        | −0.015em |
| `text-heading`    | 1.375rem → 1.75rem    | 1.2         | —        |
| `text-lead`       | 1.0625rem → 1.3125rem | 1.6         | —        |
| `text-eyebrow`    | 0.75rem (uppercase)   | 1           | 0.2em    |

## Spacing, layout and shape

| Token                         | Value                        | Utility examples                      |
| ----------------------------- | ---------------------------- | ------------------------------------- |
| `--spacing-header`            | 5rem                         | `h-header`, `pt-header`, `top-header` |
| `--spacing-section`           | clamp(5rem → 9rem)           | `py-section`                          |
| `--spacing-section-sm`        | clamp(3.5rem → 6rem)         | `py-section-sm`                       |
| `--radius`                    | 0.25rem                      | `rounded-sm` (buttons, cards)         |
| Container                     | `max-w-7xl`, `px-6 md:px-10` | `Container`                           |
| Header container              | `max-w-[96rem]`              | `SiteHeader`, mega panels             |
| Desktop navigation breakpoint | `xl` (80rem)                 | Mobile menu below it                  |

## Motion

| Token                         | Value                            | Use                       |
| ----------------------------- | -------------------------------- | ------------------------- |
| `ease-cinematic` (utility)    | `cubic-bezier(0.22, 1, 0.36, 1)` | Reveals, menu panels      |
| `ease-standard` (utility)     | `cubic-bezier(0.4, 0, 0.2, 1)`   | UI state changes          |
| `--motion-duration-fast`      | 150ms                            | Hover and focus           |
| `--motion-duration-base`      | 300ms                            | Menus and toggles         |
| `--motion-duration-slow`      | 700ms                            | Section reveals, header   |
| `--motion-duration-cinematic` | 1200ms                           | Image hovers, hero        |
| `animate-mask-rise`           | 1.1s, cinematic                  | Hero headline word reveal |
| `animate-fade-rise`           | 0.9s, cinematic                  | Hero copy and actions     |
| `animate-settle`              | 2.6s, cinematic                  | Hero photo zoom-out       |
| `animate-scroll-cue`          | 2.4s loop                        | Hero scroll cue line      |

JavaScript equivalents live in `src/lib/motion.ts` (`EASE_CINEMATIC`, `DURATION`, `MOTION_OK`). Under `prefers-reduced-motion: reduce`, CSS animations, delays and transitions collapse to their end state. JavaScript animation rules: [ADR 0003](../decisions/0003-animation-architecture.md).

## Measured contrast (WCAG 2.2)

Token pairs:

| Pair                                | Ratio   | Use                              |
| ----------------------------------- | ------- | -------------------------------- |
| charcoal on ivory                   | 16.35:1 | All text                         |
| charcoal on card white              | 17.61:1 | All text                         |
| muted-foreground on ivory           | 7.48:1  | All text                         |
| muted-foreground on card white      | 8.05:1  | All text                         |
| muted-foreground on muted           | 6.68:1  | All text                         |
| green on ivory (and ivory on green) | 6.15:1  | All text                         |
| green on card white                 | 6.62:1  | All text                         |
| green on muted                      | 5.50:1  | All text                         |
| white on blue (accent-foreground)   | 4.52:1  | All text (AA)                    |
| blue on ivory                       | 4.20:1  | **Large text and non-text only** |
| ivory on charcoal                   | 16.35:1 | All text                         |
| ivory on dark card                  | 15.01:1 | All text                         |
| light green on charcoal             | 7.74:1  | All text                         |
| light green on dark card            | 7.10:1  | All text                         |
| light blue on charcoal              | 7.50:1  | All text                         |
| dark muted-foreground on charcoal   | 9.29:1  | All text                         |
| dark muted-foreground on dark card  | 8.53:1  | All text                         |

Hero text over photography, **worst case**: computed as if every photo pixel behind the text were pure white, composited under the hero's gradient stack at each text position. The real photograph is darker, so actual contrast is higher.

| Text                                  | Viewport | Worst case | Requirement |
| ------------------------------------- | -------- | ---------- | ----------- |
| Headline (large), right end of line   | 1440×900 | 4.71:1     | 3:1 (large) |
| Lead paragraph (ivory 90%), right end | 1440×900 | 7.27:1     | 4.5:1       |
| Eyebrow (ivory)                       | 1440×900 | 6.51:1     | 4.5:1       |
| Transparent header navigation         | 1440×900 | 6.97:1     | 4.5:1       |
| Eyebrow (ivory), right end            | 390×844  | 5.60:1     | 4.5:1       |
| Headline (large), right edge          | 390×844  | 6.41:1     | 3:1 (large) |
| Lead paragraph, right edge            | 390×844  | 7.24:1     | 4.5:1       |
| Photo credit (ivory 80%)              | 390×844  | 10.12:1    | 4.5:1       |

The hero eyebrow uses ivory, not light green. Light green over the worst-case photo measured 3.08:1, which fails for small text. Below `md`, an extra 35% shade covers the full width.
