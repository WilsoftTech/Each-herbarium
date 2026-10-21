import { media } from "@/config/media";
import type { SeedProject } from "./types";

/** Approved starter plans. No delivery dates, sites, partner assignments or outcomes are asserted. */
export const starterProjects: readonly SeedProject[] = [
  {
    slug: "botanical-documentation-foundations",
    title: "Botanical documentation foundations",
    summary:
      "A planned project to establish traceable plant records, identification checks and the documentation standards needed for future herbarium development.",
    ecosystem: "Botanical documentation",
    image: media.herbariumSheetCuscuta,
    programmes: ["plant-conservation"],
    objectives: [
      "Define the information needed for a reliable plant record",
      "Prepare identification and source-checking procedures",
      "Establish requirements for permitted collecting and responsible curation before specimens are gathered",
    ],
    activities: [
      "Prepare record templates and a review checklist",
      "Use attributed reference records to test documentation methods",
      "Assess the expertise, permissions and repository arrangements needed for future work",
    ],
    story: [
      {
        heading: "Start with documentation",
        body: [
          "The first step is to define how a plant observation or specimen would be recorded and checked. Reference records can support preparation without claiming that EACH has collected specimens.",
        ],
      },
      {
        heading: "Prepare before fieldwork",
        body: [
          "Any later collecting will require suitable expertise, permissions and curation arrangements. This project plan does not announce fieldwork or establish ownership of a collection.",
        ],
      },
    ],
    landscape: {
      heading: "A traceable botanical record",
      body: [
        "The reference photograph illustrates herbarium documentation. It is not an EACH specimen or a record of project activity.",
      ],
    },
    references: [
      "[GBIF — occurrence data quality requirements](https://www.gbif.org/data-quality-requirements-occurrences)",
      "[Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium)",
    ],
    placeholder: false,
    location: null,
    period: null,
    gallery: [],
    partners: [],
    operationalStatus: "PLANNED",
    outcomes: [],
    featured: true,
  },
  {
    slug: "plant-learning-resources",
    title: "Plant learning resources",
    summary:
      "A planned project to develop accessible introductory material about plants, habitats and responsible botanical observation for learners and future volunteers.",
    ecosystem: "Conservation education",
    image: media.budongoTree,
    programmes: ["environmental-conservation", "plant-conservation"],
    objectives: [
      "Make introductory botanical concepts easier to understand",
      "Connect plant learning with habitat care and responsible observation",
      "Keep educational statements traceable to their sources",
    ],
    activities: [
      "Develop short learning outlines and source lists",
      "Prepare activities that do not require unauthorised collecting",
      "Check explanations, image credits and accessibility before wider use",
    ],
    story: [
      {
        heading: "Build from clear explanations",
        body: [
          "The project will develop learning material around plant records, habitats and careful observation. Website guides provide an introduction; they are not evidence that teaching sessions have already taken place.",
        ],
      },
      {
        heading: "Prepare for participation",
        body: [
          "Any future activity will specify its intended audience, supervision, location and practical arrangements before participants are invited. No schools, delivery sites or participant numbers are announced here.",
        ],
      },
    ],
    landscape: {
      heading: "Learning from plants and habitats",
      body: [
        "The licensed landscape photograph illustrates the subject of conservation education; it does not document an EACH learning event.",
      ],
    },
    references: [
      "[Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium)",
    ],
    placeholder: false,
    location: null,
    period: null,
    gallery: [],
    partners: [],
    operationalStatus: "PLANNED",
    outcomes: [],
    featured: true,
  },
  {
    slug: "community-knowledge-dialogue",
    title: "Community knowledge dialogue",
    summary:
      "A planned listening and preparation project to establish respectful discussion of plant knowledge, consent, attribution and access before any knowledge is recorded.",
    ecosystem: "Community knowledge",
    image: media.lakeBunyonyi,
    programmes: ["indigenous-knowledge", "medicinal-plants"],
    objectives: [
      "Begin with knowledge holders' priorities rather than assumed research needs",
      "Define consent, attribution and access arrangements before documentation",
      "Protect restricted knowledge and discuss fair benefit-sharing terms",
    ],
    activities: [
      "Prepare accessible discussion materials about purpose and intended use",
      "Identify the permissions and expertise needed before any engagement",
      "Develop a process for recording agreements and respecting decisions not to share",
    ],
    story: [
      {
        heading: "Listen before documenting",
        body: [
          "The project begins with preparation for dialogue. No named community is enrolled, no consent is presumed and no traditional knowledge is presented as already collected.",
        ],
      },
      {
        heading: "Agree the terms first",
        body: [
          "Future participation must be based on an understandable purpose and agreed arrangements for access, attribution and use. Restricted knowledge and sensitive identities will not be published without the relevant permissions.",
        ],
      },
    ],
    landscape: {
      heading: "Knowledge in its own context",
      body: [
        "The reference landscape is illustrative. It does not identify a participating community or project location.",
      ],
    },
    references: [
      "[Convention on Biological Diversity — Nagoya Protocol Article 7](https://www.cbd.int/abs/text/articles?sec=abs-07)",
      "[Convention on Biological Diversity — Nagoya Protocol Article 12](https://www.cbd.int/abs/text/articles?sec=abs-12)",
    ],
    placeholder: false,
    location: null,
    period: null,
    gallery: [],
    partners: [],
    operationalStatus: "PLANNED",
    outcomes: [],
    featured: true,
  },
];
