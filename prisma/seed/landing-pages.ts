import { media, type MediaAsset } from "@/config/media";
import type { HomeContent } from "@/features/pages/home-content";
import type { SeedPage } from "./types";

/**
 * Header copy of the fixed-route pages and the homepage sections, migrated
 * word for word from the M03 page components into the CMS (ADR 0011). The
 * page registry (src/features/pages/registry.ts) decides how each is shown.
 * `seoTitle` keeps the existing browser/search title where it differs from
 * the headline.
 */
export const seedLandingPages: readonly SeedPage[] = [
  {
    slug: "home",
    title: "Preserving East Africa's Plant Heritage.",
    seoTitle: "East African Community Herbariums",
    description:
      "EACH is an independent initiative for plant conservation, herbarium development and botanical knowledge in East Africa, beginning in Uganda.",
    eyebrow: "East African Community Herbariums",
    lead: "Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations.",
    body: "",
    heroImage: media.heroBwindiMist,
  },
  {
    slug: "about",
    title: "An independent initiative for East Africa's plants",
    seoTitle: "About EACH",
    description:
      "Who EACH is: an independent conservation, herbarium and botanical knowledge initiative for East Africa, beginning in Uganda.",
    eyebrow: "About EACH",
    lead: "East African Community Herbariums (EACH) works for plant conservation, herbarium development and botanical knowledge in East Africa, beginning in Uganda.",
    body: "",
    heroImage: media.rwenzoriVegetation,
  },
  {
    slug: "about-mission",
    title: "Connecting plants, people, science and indigenous knowledge",
    seoTitle: "Mission and values",
    description:
      "EACH's purpose: connecting plants, people, science and indigenous knowledge to protect East Africa's biodiversity for future generations.",
    eyebrow: "Mission and values",
    lead: "To protect biodiversity for future generations.",
    body: "",
    heroImage: media.heroBwindiMist,
  },
  {
    slug: "about-leadership",
    title: "The people behind EACH",
    seoTitle: "Leadership",
    description:
      "The people who lead and govern EACH. Profiles are published once confirmed, with each person's consent.",
    eyebrow: "Leadership",
    lead: "Profiles of EACH's leadership will be published here once they are confirmed and each person has agreed to appear.",
    body: "",
    heroImage: null,
  },
  {
    slug: "about-partners",
    title: "Working alongside others",
    seoTitle: "Partners",
    description:
      "The organisations EACH works alongside, including its independent partner Bitwiire Herbarium Cafe.",
    eyebrow: "Partners",
    lead: "Conservation depends on collaboration. Every organisation listed here is independent: partnership never means that one organisation owns or runs another.",
    body: "",
    heroImage: media.semulikiVegetation,
  },
  {
    slug: "our-work",
    title: "Protecting plants, places and the knowledge around them",
    seoTitle: "Our work",
    description:
      "EACH's programmes: plant conservation, environmental conservation, medicinal plants and indigenous knowledge in East Africa.",
    eyebrow: "Our work",
    lead: "Protecting East Africa's plant diversity by connecting plants, people, science and indigenous knowledge.",
    body: "",
    heroImage: media.rwenzoriGroundselValley,
  },
  {
    slug: "herbarium",
    title: "A library of preserved plants",
    seoTitle: "The herbarium",
    description:
      "What a herbarium is, how a plant specimen is prepared, and why herbaria matter for East Africa's plants. EACH's collection status will be published once confirmed.",
    eyebrow: "Herbarium & Research",
    lead: "A herbarium is a library of preserved plants. Each specimen records a plant, where and when it grew, and who collected it. Together, specimens form a lasting scientific record of a region's plants.",
    body: "",
    heroImage: media.herbariumSheetCuscuta,
  },
  {
    slug: "research",
    title: "Botanical research for East Africa",
    seoTitle: "Research",
    description:
      "Botanical research for East Africa: documenting the flora, assessing conservation status and recording plant knowledge responsibly.",
    eyebrow: "Herbarium & Research",
    lead: "Research turns specimens and field observations into knowledge that can guide conservation, teaching and policy.",
    body: "",
    heroImage: null,
  },
  {
    slug: "impact",
    title: "Measuring what matters",
    seoTitle: "Impact",
    description:
      "How EACH will measure and report the results of its work. Figures are published only once verified.",
    eyebrow: "Projects & Impact",
    lead: "EACH will report the results of its work here. No figures are shown until they have been verified.",
    body: "",
    heroImage: null,
  },
  {
    slug: "projects",
    title: "Conservation projects",
    seoTitle: "Projects",
    description:
      "Case studies of EACH's conservation projects across East Africa. The first projects are being prepared.",
    eyebrow: "Projects & Impact",
    lead: "Each project will be told as a case study: the landscape, the plants, the people involved and what changed.",
    body: "",
    heroImage: media.kidepoEuphorbia,
  },
  {
    slug: "resources",
    title: "Resources",
    seoTitle: null,
    description:
      "Publications, guides and stories from EACH. The first resources are being prepared.",
    eyebrow: "Herbarium & Research",
    lead: "Publications, guides and stories from EACH's work.",
    body: "",
    heroImage: null,
  },
  {
    slug: "get-involved",
    title: "Help protect East Africa's plant heritage",
    seoTitle: "Get involved",
    description:
      "Volunteer, partner or get in touch to help protect East Africa's plant heritage with EACH.",
    eyebrow: "Get involved",
    lead: "Conservation needs many hands and many kinds of knowledge. Find the way of taking part that suits you.",
    body: "",
    heroImage: media.semulikiVegetation,
  },
  {
    slug: "volunteer",
    title: "Volunteer with EACH",
    seoTitle: "Volunteer",
    description:
      "Volunteer with EACH: the kinds of field, herbarium, education and digital work volunteers may help with.",
    eyebrow: "Get involved",
    lead: "Give your time and skills to help document and protect East Africa's plants.",
    body: "",
    heroImage: media.elgonMontaneForest,
  },
  {
    slug: "partnerships",
    title: "Partner with EACH",
    seoTitle: "Partnerships",
    description:
      "How research institutions, community organisations and conservation groups can work with EACH.",
    eyebrow: "Get involved",
    lead: "Partners keep their independence. A partnership is a collaboration between separate organisations, each responsible for its own work.",
    body: "",
    heroImage: media.kidepoEuphorbia,
  },
  {
    slug: "bitwiire-herbarium-cafe",
    title: "Bitwiire Herbarium Cafe",
    seoTitle: null,
    description:
      "Bitwiire Herbarium Cafe is an independent partner of EACH. The two are separate organisations.",
    eyebrow: "Independent partner",
    lead: "An independent partner of EACH. Bitwiire Herbarium Cafe and EACH are separate organisations: neither owns or runs the other.",
    body: "",
    heroImage: null,
  },
  {
    slug: "contact",
    title: "Get in touch",
    seoTitle: "Contact",
    description: "How to contact EACH. Contact details will be published once confirmed.",
    eyebrow: "Contact",
    lead: "Questions, ideas and offers of help are all welcome.",
    body: "",
    heroImage: null,
  },
];

/** The homepage sections as they were in the M03 composition. */
export function seedHomeContent(imageId: (asset: MediaAsset) => string): HomeContent {
  return {
    hero: {
      primaryAction: { label: "Explore the herbarium", href: "/herbarium" },
      secondaryAction: { label: "Get involved", href: "/get-involved" },
    },
    introduction: {
      eyebrow: "Introducing EACH",
      text: "EACH is an independent conservation, herbarium and botanical knowledge initiative for East Africa, operating first in Uganda.",
      detail:
        "It brings together plant conservation, herbarium collections, research and the knowledge held by communities, so that the region's plants are documented, understood and protected.",
      action: { label: "About EACH", href: "/about" },
    },
    programmes: {
      eyebrow: "Our work",
      title: "Conservation and herbarium programmes",
      description:
        "Five connected areas of work, from protecting plants in the wild to preserving the knowledge that surrounds them.",
      linkLabel: "All of our work",
    },
    heritage: {
      eyebrow: "East Africa's plant heritage",
      title: "From afroalpine peaks to papyrus wetlands",
      description:
        "East Africa's plants are shaped by altitude, water and season. Four landscapes show the range of what there is to protect.",
      statementEyebrow: "Plant heritage",
      statement: "Some of these plants grow nowhere else on Earth.",
      imageId: imageId(media.rwenzoriMountSpeke),
      // General ecological description only; no claims about EACH's work in these places.
      landscapes: [
        {
          name: "Mountains",
          title: "Gardens above the clouds",
          body: [
            "High on the Rwenzori Mountains and East Africa's other great peaks, giant groundsels and giant lobelias grow in the cold, wet afroalpine zone.",
            "Below them, heather and bamboo zones give way to montane forest, each band shaped by altitude, rainfall and frost.",
          ],
          imageId: imageId(media.rwenzoriGroundselValley),
        },
        {
          name: "Forests",
          title: "Tropical forests",
          body: [
            "Uganda's forests, from Bwindi and Budongo to Mabira, shelter tall hardwoods, climbers, ferns and a dense understorey of shrubs and herbs.",
            "Streams that rise in the forest carry water to the farms and towns beyond it.",
          ],
          imageId: imageId(media.mabiraStream),
        },
        {
          name: "Wetlands",
          title: "Papyrus wetlands",
          body: [
            "Papyrus swamps fringe many of East Africa's lakes and rivers. They slow and filter water, store carbon in waterlogged peat, and provide materials and food for nearby communities.",
          ],
          imageId: imageId(media.papyrusSwamp),
        },
        {
          name: "Savannas",
          title: "Savannas and drylands",
          body: [
            "In the drier north-east of Uganda, grasslands, open woodland and candelabra euphorbias are adapted to long dry seasons and the occasional fire.",
          ],
          imageId: imageId(media.kidepoEuphorbia),
        },
      ],
    },
    projects: {
      eyebrow: "Featured conservation projects",
      title: "Stories from the landscapes we protect",
      description:
        "Project case studies will appear here. Until EACH publishes its first projects, placeholders show how they will be presented.",
      linkLabel: "All projects",
    },
    presence: {
      eyebrow: "Regional presence",
      title: "Rooted in Uganda, looking across East Africa",
      text: "East African Community Herbariums begins its work in Uganda. The places where EACH works, and any expansion across the region, will be shown here once confirmed.",
      start: "Uganda",
      region: "East Africa",
      sites: "",
      wider: "",
    },
    research: {
      eyebrow: "Research and botanical knowledge",
      title: "Knowledge that starts with a specimen",
      body: [
        "Herbarium specimens and careful field records are the foundation of botanical research. They confirm what a plant is, where it grows, and how that is changing over time.",
        "EACH is building that foundation for East Africa, and sharing what it learns through open resources.",
      ],
      imageId: imageId(media.herbariumSheetCallistemon),
      action: { label: "Research at EACH", href: "/research" },
    },
    community: {
      eyebrow: "Community and indigenous knowledge",
      title: "Knowledge held by the people who live with these plants",
      body: [
        "The names, uses and stories of plants are carried by the communities who live alongside them. That knowledge belongs to its custodians.",
        "Recording it must start with their consent, credit them, and leave them in control of what is shared.",
      ],
      imageId: imageId(media.lakeBunyonyi),
      action: { label: "Indigenous knowledge", href: "/our-work/indigenous-knowledge" },
    },
    involved: {
      eyebrow: "Volunteer and partner",
      title: "Help protect East Africa's plant heritage",
      panels: [
        {
          eyebrow: "Volunteer",
          title: "Give your time and skills",
          description:
            "Field work, herbarium work and education all depend on people who care about plants.",
          imageId: imageId(media.budongoTree),
          action: { label: "Volunteering with EACH", href: "/volunteer" },
        },
        {
          eyebrow: "Partnerships",
          title: "Work with us as an organisation",
          description:
            "Research institutions, community groups and conservation organisations can collaborate with EACH.",
          imageId: imageId(media.semulikiVegetation),
          action: { label: "Partnerships", href: "/partnerships" },
        },
      ],
    },
    stories: {
      eyebrow: "Latest stories and publications",
      title: "From the field and the herbarium",
      linkLabel: "All resources",
    },
    layout: {
      order: [
        "introduction",
        "programmes",
        "heritage",
        "projects",
        "presence",
        "research",
        "community",
        "bitwiire",
        "involved",
        "stories",
      ],
      hidden: [],
    },
  };
}
