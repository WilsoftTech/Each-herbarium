import {
  field,
  headingFields,
  introducedHeadingFields,
  sectionsSchema,
  type SectionsSpec,
  type SectionsValue,
} from "@/features/cms";
import type { bespokeProgrammeSlugs } from "./schema";

/**
 * The designed sections of the four founding programmes' pages (stored in
 * `programmes.content`), ADR 0013. The programme record supplies the title,
 * summary, opening paragraph, image and details; these declarations cover
 * the rest of each designed page. Kept in code: the "not medical advice"
 * notice, the reference specimen and interface labels.
 */

export type DesignedProgrammeSlug = (typeof bespokeProgrammeSlugs)[number];

const marker = (what: string) =>
  field.toggle(`Show the placeholder marker beside ${what}`, {
    hint: "Untick only once EACH has supplied or approved this content.",
  });

const awaited = (label: string) =>
  field.rich(label, {
    optional: true,
    rows: 4,
    max: 3000,
    hint: "Leave empty to show the notice that programme details are awaited from EACH.",
  });

const items = (label: string) => field.items(label, { min: 1, max: 8 });

const photographStatement = {
  imageId: field.image("Full-width photograph"),
  eyebrow: field.line("Label over the photograph", { max: 80 }),
  statement: field.text("Statement over the photograph", { max: 200, rows: 2 }),
};

const related = {
  label: "Related projects",
  description: "The projects themselves are the published projects linked to this programme.",
  fields: headingFields,
};

export const designedProgrammeSections = {
  "plant-conservation": {
    why: {
      label: "Why it matters",
      description: "The opening paragraph comes first; this text follows it.",
      fields: {
        ...headingFields,
        text: field.rich("Text after the opening paragraph", { max: 3000 }),
        imageId: field.image("Image"),
      },
    },
    approach: {
      label: "How plants are conserved",
      fields: {
        ...introducedHeadingFields,
        items: items("Approaches"),
        details: awaited("EACH's own activities (below the approaches)"),
      },
    },
    photograph: { label: "Photograph", fields: photographStatement },
    related,
  },
  "environmental-conservation": {
    ecosystems: {
      label: "Ecosystems",
      description: "The opening paragraph is the introduction of this section.",
      fields: { ...headingFields, items: items("What ecosystems provide") },
    },
    forests: {
      label: "Forests",
      fields: {
        ...headingFields,
        text: field.rich("Text", { max: 3000 }),
        imageId: field.image("Image"),
      },
    },
    photograph: { label: "Photograph", fields: photographStatement },
    mosaics: {
      label: "Mosaics",
      fields: {
        ...headingFields,
        text: field.rich("Text", { max: 3000 }),
        imageId: field.image("Image"),
        details: awaited("EACH's own activities (below this section)"),
      },
    },
    related,
  },
  "medicinal-plants": {
    header: {
      label: "Header",
      description:
        'The opening paragraph is the introduction. The "not medical advice" notice is fixed.',
      fields: { title: field.line("Headline", { max: 200 }) },
    },
    example: {
      label: "An example",
      description: "Shown beside the programme's image.",
      fields: { ...headingFields, text: field.rich("Text", { max: 3000 }) },
    },
    approach: {
      label: "Our approach",
      fields: { ...headingFields, items: items("Approach"), marker: marker("the approach") },
    },
    context: {
      label: "Scientific context",
      description: "Shown beside a reference herbarium specimen.",
      fields: { ...introducedHeadingFields, text: field.rich("Text", { max: 3000 }) },
    },
  },
  "indigenous-knowledge": {
    header: {
      label: "Header",
      description: "The opening paragraph is the introduction.",
      fields: { title: field.line("Headline", { max: 200 }) },
    },
    statement: {
      label: "Living knowledge",
      fields: {
        eyebrow: field.line("Label", { max: 80 }),
        text: field.text("Statement", { max: 400 }),
        detail: field.text("Supporting text", { max: 800 }),
      },
    },
    principles: {
      label: "Principles",
      fields: {
        ...headingFields,
        items: items("Principles"),
        marker: marker("the principles"),
        details: awaited("Agreed community protocols (below the principles)"),
      },
    },
  },
} as const satisfies Record<DesignedProgrammeSlug, SectionsSpec>;

export type DesignedProgrammeContent<S extends DesignedProgrammeSlug> = SectionsValue<
  (typeof designedProgrammeSections)[S]
>;

export function isDesignedProgrammeSlug(slug: string): slug is DesignedProgrammeSlug {
  return Object.hasOwn(designedProgrammeSections, slug);
}

export function designedProgrammeSchema<S extends DesignedProgrammeSlug>(slug: S) {
  return sectionsSchema<(typeof designedProgrammeSections)[S]>(designedProgrammeSections[slug]);
}
