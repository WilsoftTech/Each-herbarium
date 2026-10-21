import { media } from "@/config/media";
import type { SeedProject } from "./types";
import { starterProjects } from "./starter-projects";

/**
 * Initial projects, migrated from the M03 static source.
 *
 * EACH has not supplied any projects yet. These entries are placeholders that
 * show the case-study layout: they are flagged `placeholder`, are labelled on
 * every page, are not indexed, and describe only the landscape in the
 * photograph, never a project.
 */
export const seedProjects: readonly SeedProject[] = [
  ...starterProjects,
  {
    slug: "placeholder-montane-forest",
    placeholder: true,
    title: "Placeholder case study: montane forest",
    summary:
      "Shows how a project in a montane forest landscape will be presented. It does not describe an EACH project.",
    ecosystem: "Montane forest",
    location: null,
    period: null,
    programmes: ["plant-conservation"],
    image: media.elgonMontaneForest,
    gallery: [media.rwenzoriVegetation, media.budongoTree],
    landscape: {
      heading: "Montane forest",
      body: [
        "Montane forests grow on the slopes of East Africa's mountains, such as Mount Elgon and the Rwenzori, where cooler temperatures and frequent mist support a distinctive mix of trees, tree ferns, mosses and epiphytes.",
        "They catch and store rainfall, and many rivers that serve the surrounding lowlands rise within them.",
      ],
    },
    story: [],
    partners: [],
  },
  {
    slug: "placeholder-papyrus-wetland",
    placeholder: true,
    title: "Placeholder case study: papyrus wetland",
    summary: "Shows how a wetland project will be presented. It does not describe an EACH project.",
    ecosystem: "Papyrus wetland",
    location: null,
    period: null,
    programmes: ["environmental-conservation"],
    image: media.papyrusSwamp,
    gallery: [media.mabiraStream, media.semulikiVegetation],
    landscape: {
      heading: "Papyrus wetland",
      body: [
        "Papyrus (Cyperus papyrus) forms dense swamps along the edges of many East African lakes and rivers.",
        "These wetlands slow floodwater, filter sediment and nutrients, and provide fibre, fish and grazing for nearby communities.",
      ],
    },
    story: [],
    partners: [],
  },
  {
    slug: "placeholder-dryland-savanna",
    placeholder: true,
    title: "Placeholder case study: dryland savanna",
    summary: "Shows how a savanna project will be presented. It does not describe an EACH project.",
    ecosystem: "Dryland savanna",
    location: null,
    period: null,
    programmes: ["environmental-conservation", "plant-conservation"],
    image: media.kidepoSavanna,
    gallery: [media.kidepoEuphorbia, media.semulikiVegetation],
    landscape: {
      heading: "Dryland savanna",
      body: [
        "Savannas mix grassland with scattered trees and shrubs. In north-eastern Uganda they are shaped by a long dry season, grazing and fire.",
        "Succulent trees such as the candelabra euphorbia store water in their stems to survive the driest months.",
      ],
    },
    story: [],
    partners: [],
  },
];
