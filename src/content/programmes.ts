import { media, type MediaAsset } from "@/config/media";

/**
 * EACH's programmes, shared by the homepage explorer, the Our Work overview
 * and each programme page. Titles and routes follow the agreed navigation.
 * The descriptions explain each field in general terms; what EACH does in
 * practice is outstanding (pending: `programmeDetails`).
 */
export type Programme = {
  slug: string;
  href: `/${string}`;
  title: string;
  /** One sentence, used in menus, cards and the explorer. */
  summary: string;
  /** Opening paragraph of the programme page. */
  intro: string;
  image: MediaAsset;
};

export const programmes = [
  {
    slug: "plant-conservation",
    href: "/our-work/plant-conservation",
    title: "Plant conservation",
    summary: "Protecting native plants and the places they grow.",
    intro:
      "East Africa's mountains, forests, wetlands and savannas hold a remarkable diversity of plants, many found nowhere else. Conserving them starts with knowing which species grow where, understanding the pressures they face, and protecting them in the wild and, where needed, in collections.",
    image: media.rwenzoriMountSpeke,
  },
  {
    slug: "environmental-conservation",
    href: "/our-work/environmental-conservation",
    title: "Environmental conservation",
    summary: "Caring for the forests, wetlands and grasslands that plants depend on.",
    intro:
      "Plants cannot be protected apart from the ecosystems that sustain them. Forests, wetlands and grasslands also hold soil and water, and support the people who live alongside them.",
    image: media.papyrusSwamp,
  },
  {
    slug: "medicinal-plants",
    href: "/our-work/medicinal-plants",
    title: "Medicinal plants",
    summary: "Plant knowledge in its scientific and cultural context.",
    intro:
      "Many East African plants have long been used in traditional medicine. Documenting them responsibly means identifying each plant accurately, recording knowledge with the consent of the people who hold it, and never presenting a traditional use as a proven treatment.",
    image: media.warburgiaLeaves,
  },
  {
    slug: "indigenous-knowledge",
    href: "/our-work/indigenous-knowledge",
    title: "Indigenous knowledge",
    summary: "Recording plant knowledge with respect for its custodians.",
    intro:
      "Communities across East Africa hold deep knowledge of the plants around them: their names, uses, seasons and stories. That knowledge belongs to its custodians, and recording it must happen with their consent and on their terms.",
    image: media.lakeBunyonyi,
  },
] as const satisfies readonly Programme[];

/** The herbarium, presented alongside the programmes on the homepage. */
export const herbariumProgramme = {
  slug: "herbarium",
  href: "/herbarium",
  title: "The herbarium",
  summary:
    "Building herbarium collections that document East African plants for science, education and conservation.",
  intro:
    "A herbarium is a library of preserved plants. Each specimen records a plant, where and when it grew, and who collected it.",
  image: media.herbariumSheetCuscuta,
} as const satisfies Programme;

type ProgrammeEntry = (typeof programmes)[number];
export type ProgrammeSlug = ProgrammeEntry["slug"];

export function programmeBySlug(slug: ProgrammeSlug): ProgrammeEntry {
  const programme = programmes.find((item) => item.slug === slug);
  if (!programme) throw new Error(`Unknown programme: ${slug}`);
  return programme;
}

/** The programme after `slug`, wrapping round, for "next programme" links. */
export function nextProgramme(slug: ProgrammeSlug): ProgrammeEntry {
  const index = programmes.findIndex((item) => item.slug === slug);
  return programmes[(index + 1) % programmes.length] ?? programmes[0];
}
