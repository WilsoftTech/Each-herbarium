import type { ExplorerItem } from "@/components/sections/program-explorer";
import { media } from "@/config/media";

/**
 * The herbarium, presented alongside the programmes in the homepage explorer.
 * It is a fixed route rather than a programme record, so its card stays in
 * code; the herbarium page's own words are managed in the CMS (Pages).
 */
export const herbariumProgramme = {
  slug: "herbarium",
  href: "/herbarium",
  title: "The herbarium",
  summary:
    "Building herbarium collections that document East African plants for science, education and conservation.",
  image: media.herbariumSheetCuscuta,
} as const satisfies ExplorerItem;
