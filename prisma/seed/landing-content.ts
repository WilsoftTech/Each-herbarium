import { media, type MediaAsset } from "@/config/media";
import type { LandingContent, LandingSlug } from "@/features/pages/landing-content";

/**
 * The designed sections of the landing pages (ADR 0013), moved word for word
 * from the M03 page components into `pages.content`. The seed creates them
 * with new pages and fills them into existing pages whose content is still
 * empty (fill-content.ts); it never overwrites editorial changes.
 */
export function seedLandingContent(imageId: (asset: MediaAsset) => string): {
  [S in LandingSlug]: LandingContent<S>;
} {
  const card = (
    asset: MediaAsset,
    eyebrow: string,
    title: string,
    description: string,
    href: string,
  ) => ({ eyebrow, title, description, href, imageId: imageId(asset) });

  return {
    about: {
      purpose: {
        eyebrow: "Our purpose",
        text: "Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations.",
        action: { label: "Mission and values", href: "/about/mission" },
      },
      facts: {
        eyebrow: "At a glance",
        title: "What we can say today",
        description:
          "EACH is at an early stage. These details are confirmed; the rest of our story will be published once it is approved.",
        focus: "Plant conservation, herbarium development and botanical knowledge",
        start: "Uganda",
        region: "East Africa",
        partner: "Bitwiire Herbarium Cafe (a separate organisation)",
        legalStatus: "",
        founded: "",
        photography: "Openly licensed stand-in images, credited where they appear",
        photographyMarker: true,
        history: "",
      },
      explore: {
        eyebrow: "More about us",
        title: "Explore EACH",
        cards: [
          card(
            media.heroBwindiMist,
            "Purpose",
            "Mission and values",
            "Why EACH exists and the principles behind its work.",
            "/about/mission",
          ),
          card(
            media.budongoTree,
            "People",
            "Leadership",
            "The people who guide EACH.",
            "/about/leadership",
          ),
          card(
            media.semulikiVegetation,
            "Collaboration",
            "Partners",
            "The organisations EACH works alongside.",
            "/about/partners",
          ),
        ],
      },
    },
    "about-mission": {
      statement: { marker: true },
      photograph: { imageId: imageId(media.heroBwindiMist) },
      principles: {
        eyebrow: "Values",
        title: "The principles behind our work",
        description:
          "Proposed principles that will guide how EACH collects, records and shares plant knowledge.",
        items: [
          {
            title: "Science first",
            body: "Every plant record is accurately identified, documented and kept, so that others can check and build on it.",
          },
          {
            title: "Knowledge with consent",
            body: "Community and indigenous knowledge is recorded only with the consent of its custodians, credited to them and shared on their terms.",
          },
          {
            title: "Open by default",
            body: "What EACH learns is shared as openly as is safe, so it can serve students, researchers and conservation.",
          },
          {
            title: "Rooted in the region",
            body: "Work in East Africa is led with, and for, the people of East Africa.",
          },
          {
            title: "Careful with claims",
            body: "Traditional uses of plants are documented in context and never presented as proven medical treatments.",
          },
          {
            title: "Independent partnerships",
            body: "EACH works alongside independent partners and is clear about where each organisation's responsibility lies.",
          },
        ],
        marker: true,
      },
      next: {
        label: "Next in About EACH",
        title: "Leadership",
        href: "/about/leadership",
        description: "The people who guide EACH.",
      },
    },
    "about-leadership": {
      upcoming: {
        eyebrow: "Coming soon",
        title: "What this page will show",
        items: [
          "Leadership team: names, roles and short biographies",
          "Board, trustees or advisers, if EACH has them",
          "Scientific and community advisers",
          "How EACH is governed and accountable",
        ],
      },
      next: {
        label: "Next in About EACH",
        title: "Partners",
        href: "/about/partners",
        description: "The organisations EACH works alongside.",
      },
    },
    "about-partners": {
      partners: { eyebrow: "Confirmed", title: "Our partners", marker: true },
      invitation: {
        eyebrow: "Partner with us",
        title: "Interested in working with EACH?",
        description:
          "Research institutions, community organisations and conservation groups can explore how to collaborate.",
        action: { label: "Partnerships", href: "/partnerships" },
      },
    },
    "our-work": {
      programmes: {
        eyebrow: "Programmes",
        title: "Four connected programmes",
        description:
          "Conservation protects plants and the places they grow. Knowledge work makes sure what people know about plants is recorded accurately and respectfully.",
        marker: true,
      },
      projects: {
        eyebrow: "In the field",
        title: "Projects",
        description:
          "Case studies of EACH's projects will be listed here. The current entries are placeholders.",
      },
      next: {
        label: "Also explore",
        title: "The herbarium",
        href: "/herbarium",
        description:
          "Building collections that document East African plants for science, education and conservation.",
      },
    },
    herbarium: {
      specimens: {
        eyebrow: "Specimens",
        title: "What a specimen records",
        description:
          "These sheets were collected in Uganda and are imaged and shared openly by the Royal Botanic Gardens, Kew. Each label is a record that can be checked decades later.",
      },
      process: {
        eyebrow: "From field to cabinet",
        title: "How a specimen is made",
        description: "The same careful steps are followed in herbaria around the world.",
        items: [
          {
            title: "Collect",
            body: "A representative piece of the plant is gathered, with flowers or fruit where possible, under the right permits. The collector notes the place, habitat and date.",
          },
          {
            title: "Press and dry",
            body: "The plant is arranged flat between sheets of paper and dried under pressure so its shape and features are preserved.",
          },
          {
            title: "Mount",
            body: "The dried plant is fixed to a sheet of archival card, with loose seeds or fragments kept in a small packet.",
          },
          {
            title: "Label",
            body: "A label records the plant's name, where and when it was collected, by whom, and a collection number.",
          },
          {
            title: "Identify and verify",
            body: "Botanists confirm the identification, and later specialists may annotate the sheet as understanding changes.",
          },
          {
            title: "Store, care and share",
            body: "Sheets are stored in cabinets protected from pests, damp and light, and are increasingly imaged so their data can be shared.",
          },
        ],
      },
      uses: {
        eyebrow: "Why herbaria matter",
        title: "A record that outlives its collector",
        items: [
          "Identify plants by comparing them with verified specimens",
          "Map where species grow, and how that has changed over decades",
          "Support conservation assessments of threatened species",
          "Train students, field staff and new botanists",
          "Preserve a record of plant names and knowledge for the future",
        ],
      },
      status: { eyebrow: "EACH's herbarium", title: "Collection status", text: "" },
      next: {
        label: "Herbarium & Research",
        title: "Research",
        href: "/research",
        description: "Botanical study across East African ecosystems.",
      },
    },
    research: {
      facts: { partners: "", publications: "" },
      themes: {
        eyebrow: "Themes",
        title: "Areas of research",
        items: [
          {
            title: "Documenting the flora",
            body: "Recording which plants grow where, backed by herbarium specimens and field data.",
          },
          {
            title: "Conservation status",
            body: "Contributing evidence to assessments of which species are threatened, and why.",
          },
          {
            title: "Ethnobotany",
            body: "Studying how people know and use plants, with the consent and participation of the communities concerned.",
          },
          {
            title: "Ecosystems and change",
            body: "Understanding how land use and a changing climate affect East Africa's plant communities.",
          },
        ],
        marker: true,
      },
      publications: {
        eyebrow: "Publications",
        title: "Papers and reports",
        description:
          "EACH has not published research yet. This placeholder shows how publications will be listed.",
        linkLabel: "All resources",
      },
      collaborate: {
        eyebrow: "Collaborate",
        title: "Research partnerships",
        description:
          "Researchers and institutions interested in East African botany can explore partnerships with EACH.",
        text: "",
      },
      next: {
        label: "Herbarium & Research",
        title: "Resources",
        href: "/resources",
        description: "Publications, guides and stories.",
      },
    },
    impact: {
      measures: {
        eyebrow: "Proposed measures",
        title: "What we intend to measure",
        items: [
          "Plant species documented",
          "Herbarium specimens prepared",
          "Area of habitat under conservation",
          "Community knowledge holders taking part, with consent",
          "People trained",
          "Resources published",
        ],
        marker: true,
      },
      reporting: {
        eyebrow: "Reporting",
        title: "How results will be reported",
        items: [
          {
            title: "Verified before published",
            body: "Each figure is checked and shown with its source and the method used to produce it.",
          },
          {
            title: "Dated",
            body: "Every figure states the period it covers, so progress can be compared over time.",
          },
          {
            title: "Honest about limits",
            body: "Uncertainty and gaps in the data are stated, not hidden.",
          },
        ],
        text: "",
      },
      next: {
        label: "Projects & Impact",
        title: "Conservation projects",
        href: "/projects",
        description: "Case studies from the field.",
      },
    },
    projects: {
      closing: {
        text: "Results will be reported on the [impact page](/impact) once they have been verified.",
      },
    },
    resources: { downloads: { eyebrow: "Documents", title: "Downloads" } },
    "get-involved": {
      ways: {
        panels: [
          {
            ...card(
              media.budongoTree,
              "Volunteer",
              "Give your time and skills",
              "Field, herbarium, education and digital work.",
              "/volunteer",
            ),
            cta: "Volunteering",
          },
          {
            ...card(
              media.kidepoEuphorbia,
              "Partnerships",
              "Collaborate as an organisation",
              "For research institutions, community groups and conservation organisations.",
              "/partnerships",
            ),
            cta: "Partnerships",
          },
          {
            ...card(
              media.lakeBunyonyi,
              "Our partner",
              "Bitwiire Herbarium Cafe",
              "An independent partner of EACH.",
              "/bitwiire-herbarium-cafe",
            ),
            cta: "About the partnership",
          },
          {
            ...card(
              media.mabiraStream,
              "Contact",
              "Start a conversation",
              "Questions, ideas or offers of help.",
              "/contact",
            ),
            cta: "Contact EACH",
          },
        ],
      },
    },
    volunteer: {
      areas: {
        eyebrow: "Ways to help",
        title: "Where volunteers may contribute",
        description:
          "These are the kinds of work volunteers could support. Confirmed opportunities will be listed here.",
        items: [
          {
            title: "Field work",
            body: "Supporting surveys and plant collecting, under the guidance of trained botanists.",
          },
          {
            title: "Herbarium work",
            body: "Helping to press, mount, label and catalogue specimens.",
          },
          {
            title: "Education and outreach",
            body: "Sharing plant knowledge with schools, visitors and communities.",
          },
          {
            title: "Digital and communications",
            body: "Imaging specimens, managing data, writing and photography.",
          },
        ],
        marker: true,
      },
      steps: { eyebrow: "Next steps", title: "Registering your interest", text: "" },
      next: {
        label: "Get involved",
        title: "Partnerships",
        href: "/partnerships",
        description: "Collaborate with EACH as an institution or organisation.",
      },
    },
    partnerships: {
      types: {
        eyebrow: "Who we work with",
        title: "Kinds of partnership",
        items: [
          {
            title: "Research and academic",
            body: "Universities, herbaria and research institutes working on East African botany.",
          },
          {
            title: "Community organisations",
            body: "Groups who hold and care for local plant knowledge and landscapes.",
          },
          {
            title: "Conservation organisations",
            body: "Organisations protecting habitats and species across the region.",
          },
          {
            title: "Education and hospitality",
            body: "Places that welcome the public and help people learn about plants.",
          },
        ],
        marker: true,
      },
      steps: { eyebrow: "Next steps", title: "Starting a conversation", text: "" },
      next: {
        label: "Get involved",
        title: "Contact",
        href: "/contact",
        description: "Start a conversation with EACH.",
      },
    },
    "bitwiire-herbarium-cafe": {
      facts: { location: "", hours: "" },
      profile: {
        eyebrow: "In its own words",
        title: "About Bitwiire",
        description:
          "This page will introduce Bitwiire Herbarium Cafe in its own words once Bitwiire has approved a description, along with how to visit.",
        text: "",
      },
      next: {
        label: "About EACH",
        title: "All partners",
        href: "/about/partners",
        description: "The organisations EACH works alongside.",
      },
    },
    contact: {
      details: { eyebrow: "Details", title: "Contact details" },
      related: {
        eyebrow: "Looking for something?",
        title: "You may also want",
        cards: [
          card(
            media.budongoTree,
            "Get involved",
            "Volunteer",
            "Ways volunteers may contribute.",
            "/volunteer",
          ),
          card(
            media.kidepoEuphorbia,
            "Get involved",
            "Partnerships",
            "Working with EACH as an organisation.",
            "/partnerships",
          ),
          card(
            media.mabiraStream,
            "Help",
            "Accessibility",
            "How this site is built to be usable by everyone.",
            "/accessibility",
          ),
        ],
      },
    },
  };
}
