import { z } from "zod";
import { isApprovedHref } from "@/config/routes";

/**
 * The homepage's typed sections (stored in `pages.content` for slug "home").
 * The section components and their order of appearance in the composition
 * stay in code; editors change words, images, link destinations, the order
 * of the sections between the hero and the footer, and whether optional
 * sections show. Images are media library ids, resolved when the page renders.
 */
export const homeSectionKeys = [
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
] as const;

export type HomeSectionKey = (typeof homeSectionKeys)[number];

export const homeSectionLabel: Record<HomeSectionKey, string> = {
  introduction: "Introducing EACH",
  programmes: "Conservation programmes",
  heritage: "Plant heritage",
  projects: "Featured projects",
  presence: "Regional presence",
  research: "Research and knowledge",
  community: "Community and indigenous knowledge",
  bitwiire: "Bitwiire Herbarium Cafe partnership",
  involved: "Volunteer and partnership calls to action",
  stories: "Latest stories and publications",
};

const short = (label: string, max = 80) =>
  z.string().trim().min(1, `Enter ${label}.`).max(max, `Keep ${label} under ${max} characters.`);

export const hrefSchema = z
  .string()
  .trim()
  .refine(
    isApprovedHref,
    "Use a page on this site (such as /volunteer) or a full https:// address.",
  );

const linkSchema = z.object({ label: short("a button label", 60), href: hrefSchema });
const imageIdSchema = z.string().min(1, "Choose an image.");
const paragraphsSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Write at least one paragraph.")
  .max(6, "Use at most six paragraphs.");

const headingSchema = {
  eyebrow: short("a short label"),
  title: short("a heading", 200),
};

const featureSchema = z.object({
  ...headingSchema,
  body: paragraphsSchema,
  imageId: imageIdSchema,
  action: linkSchema,
});

const panelSchema = z.object({
  ...headingSchema,
  description: short("a description", 400),
  imageId: imageIdSchema,
  action: linkSchema,
});

export const homeLayoutSchema = z
  .object({
    order: z.array(z.enum(homeSectionKeys)),
    hidden: z.array(z.enum(homeSectionKeys)),
  })
  .refine(
    ({ order }) =>
      order.length === homeSectionKeys.length && new Set(order).size === homeSectionKeys.length,
    "List every section exactly once.",
  )
  .refine(
    ({ order, hidden }) => order[0] === "introduction" && !hidden.includes("introduction"),
    "The introduction always shows, directly below the hero.",
  );

export const homeContentSchema = z.object({
  hero: z.object({ primaryAction: linkSchema, secondaryAction: linkSchema }),
  introduction: z.object({
    eyebrow: short("a short label"),
    text: short("the statement", 400),
    detail: z.string().trim().max(800),
    action: linkSchema,
  }),
  programmes: z.object({
    ...headingSchema,
    description: z.string().trim().max(600),
    linkLabel: short("a link label", 60),
  }),
  heritage: z.object({
    ...headingSchema,
    description: z.string().trim().max(600),
    statementEyebrow: short("a label for the photograph"),
    statement: short("the statement over the photograph", 200),
    imageId: imageIdSchema,
  }),
  projects: z.object({
    ...headingSchema,
    description: z.string().trim().max(600),
    linkLabel: short("a link label", 60),
  }),
  research: featureSchema,
  community: featureSchema,
  involved: z.object({
    ...headingSchema,
    panels: z.tuple([panelSchema, panelSchema]),
  }),
  stories: z.object({ ...headingSchema, linkLabel: short("a link label", 60) }),
  layout: homeLayoutSchema,
});

export type HomeContent = z.infer<typeof homeContentSchema>;

/** Every media id the homepage content refers to (for validation and usage checks). */
export function homeImageIds(content: HomeContent): string[] {
  return [
    content.heritage.imageId,
    content.research.imageId,
    content.community.imageId,
    ...content.involved.panels.map((panel) => panel.imageId),
  ];
}

/** Sections whose position editors can change (the introduction stays first). */
export const movableSectionKeys = homeSectionKeys.filter(
  (key): key is Exclude<HomeSectionKey, "introduction"> => key !== "introduction",
);

/** Sections in display order, without hidden ones. */
export function visibleSections(layout: HomeContent["layout"]): HomeSectionKey[] {
  return layout.order.filter((key) => !layout.hidden.includes(key));
}
