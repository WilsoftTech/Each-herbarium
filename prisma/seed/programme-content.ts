import { media, type MediaAsset } from "@/config/media";
import type {
  DesignedProgrammeContent,
  DesignedProgrammeSlug,
} from "@/features/programmes/designed-content";

/**
 * The designed sections of the founding programmes' pages (ADR 0013), moved
 * word for word from the M03 page components into `programmes.content`.
 * Filled into existing programmes only while their content is empty.
 */
export function seedProgrammeContent(imageId: (asset: MediaAsset) => string): {
  [S in DesignedProgrammeSlug]: DesignedProgrammeContent<S>;
} {
  const related = { eyebrow: "Projects", title: "Related projects" };
  return {
    // How plant conservation works in general; not a description of EACH's activities.
    "plant-conservation": {
      why: {
        eyebrow: "Why it matters",
        title: "A remarkable flora, under pressure",
        text: "The afroalpine plants of the Rwenzori, the hardwoods of Uganda's forests and the grasses of its savannas each depend on conditions that are changing.",
        imageId: imageId(media.rwenzoriVegetation),
      },
      approach: {
        eyebrow: "How plants are conserved",
        title: "Four parts of conserving a plant",
        description:
          "Conservationists combine these approaches. EACH's own activities within them will be described once confirmed.",
        items: [
          {
            title: "Know what grows where",
            body: "Surveys and identified specimens establish which species are present and how common they are.",
          },
          {
            title: "Understand the threats",
            body: "Land clearance, over-harvesting, invasive species and a changing climate affect plants differently. Assessments show which species are most at risk.",
          },
          {
            title: "Protect plants where they grow",
            body: "Conserving habitats keeps plants in the ecosystems, and alongside the pollinators and communities, they depend on.",
          },
          {
            title: "Safeguard them in collections",
            body: "Seed banks, living collections and herbaria keep a record, and sometimes a reserve, when wild populations are under pressure.",
          },
        ],
        details: "",
      },
      photograph: {
        imageId: imageId(media.rwenzoriGroundselValley),
        eyebrow: "Rwenzori Mountains",
        statement: "Giant groundsels like these grow only on the high mountains of East Africa.",
      },
      related,
    },
    "environmental-conservation": {
      ecosystems: {
        eyebrow: "Ecosystems",
        title: "Plants live in places",
        items: [
          {
            title: "Water",
            body: "Forests and wetlands catch, store and filter the water that towns and farms rely on.",
          },
          { title: "Soil", body: "Roots and ground cover hold soil on slopes and riverbanks." },
          {
            title: "Carbon",
            body: "Forests and papyrus peat store carbon that would otherwise reach the atmosphere.",
          },
          {
            title: "Livelihoods",
            body: "Ecosystems provide materials, food, grazing and medicine for nearby communities.",
          },
        ],
      },
      forests: {
        eyebrow: "Forests",
        title: "Where rivers begin",
        text: "Uganda's forests, from Mabira to Budongo and Bwindi, hold much of the country's plant diversity. Streams that rise under their canopy feed the land beyond.",
        imageId: imageId(media.mabiraStream),
      },
      photograph: {
        imageId: imageId(media.kidepoSavanna),
        eyebrow: "Savannas and drylands",
        statement:
          "Grasslands and drylands are rich ecosystems in their own right, shaped by season, grazing and fire.",
      },
      mosaics: {
        eyebrow: "Mosaics",
        title: "Where forest meets grassland",
        text: "Many East African landscapes are mosaics of forest, grassland and wetland. The edges between them are often especially rich in plants, and especially exposed to change.",
        imageId: imageId(media.semulikiVegetation),
        details: "",
      },
      related,
    },
    // Draft approach for expert review (pending: `medicinalReview`).
    "medicinal-plants": {
      header: { title: "Medicinal plants, in their scientific and cultural context" },
      example: {
        eyebrow: "An example",
        title: "Uganda greenheart",
        text: [
          "*Warburgia ugandensis* is a tree of East African forests and woodlands. Its bark and leaves are widely used in traditional medicine in the region, which is one reason the tree is harvested from the wild.",
          "Recording a plant like this responsibly means naming it precisely, documenting how and by whom it is used, and noting the pressure that harvesting places on it.",
        ].join("\n\n"),
      },
      approach: {
        eyebrow: "Our approach",
        title: "Responsible plant knowledge",
        items: [
          {
            title: "Identify the plant precisely",
            body: "Common names vary between languages and places. A scientific name, backed by a herbarium voucher specimen, makes clear which plant is meant.",
          },
          {
            title: "Record use in its context",
            body: "A traditional use is documented as what a community does and knows, with who, where and how. It is not presented as a proven treatment.",
          },
          {
            title: "Ask before recording",
            body: "Knowledge of medicinal plants is recorded only with the consent of the people who hold it, and credited to them.",
          },
          {
            title: "Keep wild plants for the future",
            body: "Harvesting bark, roots or whole plants can threaten wild populations, so conservation status is part of every record.",
          },
        ],
        marker: true,
      },
      context: {
        eyebrow: "Scientific context",
        title: "Why a specimen matters",
        description:
          "A voucher specimen is a pressed, labelled sample of the exact plant that was studied or described. Anyone can return to it to check the identification.",
        text: "Conservation status matters too. *Prunus africana* (African cherry), whose bark is harvested for international trade, is listed in Appendix II of CITES, the convention that regulates international trade in threatened species.",
      },
    },
    // Draft principles for EACH and its community partners to agree (pending: `communityProtocols`).
    "indigenous-knowledge": {
      header: { title: "Knowledge that belongs to its custodians" },
      statement: {
        eyebrow: "Living knowledge",
        text: "A plant's name in a local language often carries knowledge about where it grows, when it flowers and how it is used.",
        detail:
          "That knowledge is passed between generations and changes as landscapes change. Recording it well keeps it in the hands of the people who hold it.",
      },
      principles: {
        eyebrow: "Principles",
        title: "How knowledge should be recorded",
        items: [
          {
            title: "Consent comes first",
            body: "Knowledge is recorded only with the free, prior and informed consent of the people who hold it, and they can withdraw it.",
          },
          {
            title: "Credit the custodians",
            body: "Communities and individuals are named as the source of what they share, in the way they choose.",
          },
          {
            title: "Communities decide what is shared",
            body: "Some knowledge is not for publication. Communities decide what may be made public, and what stays private.",
          },
          {
            title: "Benefits are shared",
            body: "When plant knowledge leads to research or other benefits, the people it came from share in them. The Nagoya Protocol under the Convention on Biological Diversity sets out this principle.",
          },
        ],
        marker: true,
        details: "",
      },
    },
  };
}
