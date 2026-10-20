import type { ExplorerItem } from "@/components/sections/program-explorer";
import { media } from "@/config/media";

/**
 * The herbarium, presented alongside the programmes in the homepage explorer.
 * The programmes themselves are managed in the CMS (features/programmes).
 */
export const herbariumProgramme = {
  slug: "herbarium",
  href: "/herbarium",
  title: "The herbarium",
  summary:
    "Building herbarium collections that document East African plants for science, education and conservation.",
  /** Opening paragraph of the herbarium page. */
  intro:
    "A herbarium is a library of preserved plants. Each specimen records a plant, where and when it grew, and who collected it.",
  image: media.herbariumSheetCuscuta,
} as const satisfies ExplorerItem & { intro: string };
