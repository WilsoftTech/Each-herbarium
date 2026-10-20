import {
  field,
  headingFields,
  introducedHeadingFields,
  nextLinkFields,
  sectionsSchema,
  type SectionsSpec,
  type SectionsValue,
} from "@/features/cms";
import { pageRegistry, type ManagedPageSlug } from "./registry";

/**
 * The designed sections of each landing page (stored in `pages.content`),
 * ADR 0013. The composition, order and design of every section stay in the
 * page's view (components/landing/); these declarations say which words,
 * list items, images and links editors manage in each of them.
 *
 * Kept in code on purpose: the protected brand (name, logo), statements
 * that protect content integrity (Bitwiire's independence, "not medical
 * advice", no impact figures before verification), notices about website
 * features that do not exist yet (they change with the code, M05), the
 * placeholder register (src/content/pending.ts) and interface labels.
 */

export type LandingSlug = {
  [K in ManagedPageSlug]: (typeof pageRegistry)[K]["kind"] extends "landing" ? K : never;
}[ManagedPageSlug];

/** Checkbox controlling a placeholder marker beside content EACH has not approved. */
const marker = (what: string) =>
  field.toggle(`Show the placeholder marker beside ${what}`, {
    hint: "Untick only once EACH has supplied or approved this content.",
  });

/** Optional text that replaces an "awaiting content" notice once EACH supplies it. */
const awaited = (label: string) =>
  field.rich(label, {
    optional: true,
    rows: 4,
    max: 3000,
    hint: "Leave empty to show the notice that this content is awaited from EACH.",
  });

/** A fact whose value EACH has not supplied yet. */
const awaitedFact = (label: string) =>
  field.line(label, {
    optional: true,
    max: 200,
    hint: "Leave empty to show a placeholder marker.",
  });

const cardFields = {
  eyebrow: field.line("Label", { max: 80 }),
  title: field.line("Title", { max: 120 }),
  description: field.text("Description", { max: 300, rows: 2 }),
  href: field.href("Destination"),
  imageId: field.image("Image"),
};

const items = (label: string) => field.items(label, { min: 1, max: 12 });

const next = {
  label: "Next page link",
  description: "The link to the next page at the foot of this page.",
  fields: nextLinkFields,
};

export const landingSections = {
  about: {
    purpose: {
      label: "Purpose statement",
      fields: {
        eyebrow: field.line("Label", { max: 80 }),
        text: field.text("Statement", { max: 400 }),
        action: field.link("Link"),
      },
    },
    facts: {
      label: "At a glance",
      description: "The name and short name come from the protected brand and cannot change here.",
      fields: {
        ...introducedHeadingFields,
        focus: field.line("Focus", { max: 200 }),
        start: field.line("Where we begin", { max: 200 }),
        region: field.line("Region", { max: 200 }),
        partner: field.line("Independent partner", { max: 200 }),
        legalStatus: awaitedFact("Legal status"),
        founded: awaitedFact("Founded"),
        photography: field.line("Photography", { max: 200 }),
        photographyMarker: marker("Photography"),
        history: awaited("Our story (below the facts)"),
      },
    },
    explore: {
      label: "Explore EACH",
      fields: {
        ...headingFields,
        cards: field.group("Cards", { itemLabel: "Card", count: 3, fields: cardFields }),
      },
    },
  },
  "about-mission": {
    statement: {
      label: "Mission statement",
      fields: { marker: marker("the mission statement (beside the header)") },
    },
    photograph: {
      label: "Photograph",
      fields: { imageId: field.image("Full-width photograph") },
    },
    principles: {
      label: "Values",
      fields: {
        ...introducedHeadingFields,
        items: items("Principles"),
        marker: marker("the principles"),
      },
    },
    next,
  },
  "about-leadership": {
    upcoming: {
      label: "Before profiles are published",
      description: "Shown only while no team member is published.",
      fields: { ...headingFields, items: field.lines("What this page will show", { max: 8 }) },
    },
    next,
  },
  "about-partners": {
    partners: {
      label: "Our partners",
      description: "Partners themselves are managed under Partners.",
      fields: { ...headingFields, marker: marker("the partner list") },
    },
    invitation: {
      label: "Partner with us",
      fields: { ...introducedHeadingFields, action: field.link("Button") },
    },
  },
  "our-work": {
    programmes: {
      label: "Programmes",
      description: "The programme cards come from Programmes (published only).",
      fields: { ...introducedHeadingFields, marker: marker("the programmes heading") },
    },
    projects: {
      label: "Projects",
      description: "The project cards come from Projects (published only).",
      fields: introducedHeadingFields,
    },
    next,
  },
  herbarium: {
    specimens: { label: "What a specimen records", fields: introducedHeadingFields },
    process: {
      label: "How a specimen is made",
      fields: { ...introducedHeadingFields, items: items("Steps") },
    },
    uses: {
      label: "Why herbaria matter",
      fields: { ...headingFields, items: field.lines("Reasons", { max: 10 }) },
    },
    status: {
      label: "Collection status",
      fields: { ...headingFields, text: awaited("Status of EACH's collection") },
    },
    next,
  },
  research: {
    facts: {
      label: "Header facts",
      fields: {
        partners: awaitedFact("Research partners"),
        publications: awaitedFact("Publications"),
      },
    },
    themes: {
      label: "Areas of research",
      fields: { ...headingFields, items: items("Themes"), marker: marker("the themes") },
    },
    publications: {
      label: "Papers and reports",
      description: "Publications come from Articles of the type Publication.",
      fields: {
        ...introducedHeadingFields,
        linkLabel: field.line("Link label (to /resources)", { max: 60 }),
      },
    },
    collaborate: {
      label: "Research partnerships",
      fields: { ...introducedHeadingFields, text: awaited("Partnership details") },
    },
    next,
  },
  impact: {
    measures: {
      label: "What we intend to measure",
      description:
        'Figures are not shown until they are verified; each measure reads "Not yet published".',
      fields: {
        ...headingFields,
        items: field.lines("Measures", { max: 12 }),
        marker: marker("the measures"),
      },
    },
    reporting: {
      label: "How results will be reported",
      fields: {
        ...headingFields,
        items: items("Reporting principles"),
        text: awaited("Verified results (below the principles)"),
      },
    },
    next,
  },
  projects: {
    closing: {
      label: "Closing note",
      fields: { text: field.rich("Text below the projects", { max: 600, rows: 3 }) },
    },
  },
  resources: {
    downloads: {
      label: "Downloads",
      description: "Shown when at least one resource is published.",
      fields: headingFields,
    },
  },
  "get-involved": {
    ways: {
      label: "Ways to take part",
      fields: {
        panels: field.group("Panels", {
          itemLabel: "Panel",
          count: 4,
          fields: { ...cardFields, cta: field.line("Button label", { max: 60 }) },
        }),
      },
    },
  },
  volunteer: {
    areas: {
      label: "Ways to help",
      fields: {
        ...introducedHeadingFields,
        items: items("Areas"),
        marker: marker("the areas"),
      },
    },
    steps: {
      label: "Next steps",
      fields: { ...headingFields, text: awaited("Volunteer opportunities") },
    },
    next,
  },
  partnerships: {
    types: {
      label: "Kinds of partnership",
      fields: { ...headingFields, items: items("Kinds"), marker: marker("the kinds") },
    },
    steps: {
      label: "Next steps",
      fields: { ...headingFields, text: awaited("How partnerships work") },
    },
    next,
  },
  "bitwiire-herbarium-cafe": {
    facts: {
      label: "Header facts",
      description: 'The relationship ("Independent partner") is fixed and cannot change here.',
      fields: { location: awaitedFact("Location"), hours: awaitedFact("Opening hours") },
    },
    profile: {
      label: "In its own words",
      description:
        "Only a description Bitwiire has approved. The statement that the two organisations are independent is fixed.",
      fields: { ...introducedHeadingFields, text: awaited("Bitwiire's description") },
    },
    next,
  },
  contact: {
    details: {
      label: "Contact details",
      description: "The details themselves are site settings (Settings → Contact).",
      fields: headingFields,
    },
    related: {
      label: "You may also want",
      fields: {
        ...headingFields,
        cards: field.group("Cards", { itemLabel: "Card", count: 3, fields: cardFields }),
      },
    },
  },
} as const satisfies Record<LandingSlug, SectionsSpec>;

export type LandingSections<S extends LandingSlug> = (typeof landingSections)[S];
export type LandingContent<S extends LandingSlug> = SectionsValue<LandingSections<S>>;

export function isLandingSlug(slug: string): slug is LandingSlug {
  return Object.hasOwn(landingSections, slug);
}

/** The schema for a landing page's content. */
export function landingContentSchema<S extends LandingSlug>(slug: S) {
  return sectionsSchema<LandingSections<S>>(landingSections[slug]);
}
