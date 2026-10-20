import { media } from "@/config/media";
import type { SeedProgramme } from "./types";

/**
 * Initial programmes, migrated from src/content/programmes.ts (M03). Titles
 * and routes follow the agreed navigation. The descriptions explain each field
 * in general terms; what EACH does in practice is outstanding (pending:
 * `programmeDetails`).
 */
export const seedProgrammes: readonly SeedProgramme[] = [
  {
    slug: "plant-conservation",
    seoDescription:
      "Why East Africa's native plants need protecting, and how plants are conserved in the wild, in collections and in herbaria.",
    title: "Plant conservation",
    summary: "Protecting native plants and the places they grow.",
    intro:
      "East Africa's mountains, forests, wetlands and savannas hold a remarkable diversity of plants, many found nowhere else. Conserving them starts with knowing which species grow where, understanding the pressures they face, and protecting them in the wild and, where needed, in collections.",
    image: media.rwenzoriMountSpeke,
  },
  {
    slug: "environmental-conservation",
    seoDescription:
      "The forests, wetlands and grasslands that East Africa's plants depend on, and why protecting them matters for people too.",
    title: "Environmental conservation",
    summary: "Caring for the forests, wetlands and grasslands that plants depend on.",
    intro:
      "Plants cannot be protected apart from the ecosystems that sustain them. Forests, wetlands and grasslands also hold soil and water, and support the people who live alongside them.",
    image: media.papyrusSwamp,
  },
  {
    slug: "medicinal-plants",
    seoDescription:
      "How EACH approaches East Africa's medicinal plants: accurate identification, cultural context, consent and conservation. Not medical advice.",
    title: "Medicinal plants",
    summary: "Plant knowledge in its scientific and cultural context.",
    intro:
      "Many East African plants have long been used in traditional medicine. Documenting them responsibly means identifying each plant accurately, recording knowledge with the consent of the people who hold it, and never presenting a traditional use as a proven treatment.",
    image: media.warburgiaLeaves,
  },
  {
    slug: "indigenous-knowledge",
    seoDescription:
      "Recording East African communities' knowledge of plants with consent, credit and community control.",
    title: "Indigenous knowledge",
    summary: "Recording plant knowledge with respect for its custodians.",
    intro:
      "Communities across East Africa hold deep knowledge of the plants around them: their names, uses, seasons and stories. That knowledge belongs to its custodians, and recording it must happen with their consent and on their terms.",
    image: media.lakeBunyonyi,
  },
];
