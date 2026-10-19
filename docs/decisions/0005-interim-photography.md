# 0005. Interim photography from openly licensed sources

- **Status:** Accepted
- **Date:** 2026-10-19
- **Milestone:** M02

## Context

The M02 brief requires a cinematic photographic hero and featured photography in the mega menus. EACH has not supplied any photography or approved video. AGENTS.md forbids fabricating institutional information and downloading logos, but it says nothing about photography. Generic stock imagery from outside the region would misrepresent an East African botanical initiative.

## Decision

- Until EACH supplies its own images, use photographs from **Wikimedia Commons** that show **East African places and plants**, under CC BY, CC BY-SA or CC0 licences.
- Record each image's author, licence, licence URL and source page in `src/config/media.ts` and `public/images/README.md`. Show the credit (author and licence, linked) wherever the image appears.
- Captions describe what and where only. Never imply the image shows EACH's staff, sites, projects or collections.
- Commit web-sized renditions: resized and re-encoded only, not cropped or edited.
- No video in M02. The hero uses a still photograph with `preload`, responsive `sizes` and a CSS settle animation. This satisfies "no heavy autoplay video on mobile" by construction.

## Consequences

- The design is reviewed with real, regionally accurate photography instead of grey placeholders.
- Visible credits are part of the layout (hero corner, card footers, mega-menu figures).
- ShareAlike terms apply to the images only, not to the site's code or text.
- When EACH supplies photography, replace the entries in `src/config/media.ts`. Components read only from that registry, so no component changes are needed. Update `public/images/README.md` at the same time.
