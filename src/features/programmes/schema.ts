import { z } from "zod";
import { contentStatusSchema, mediaAssetSchema, seoSchema, slugSchema } from "@/validation/content";

/** A programme as public pages see it (published rows only). */
export const programmeSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  href: z
    .string()
    .regex(/^\/our-work\/[a-z0-9-]+$/)
    .transform((href) => href as `/our-work/${string}`),
  title: z.string().min(1),
  /** One sentence, used in menus, cards and the explorer. */
  summary: z.string().min(1),
  /** Opening paragraph of the programme page. */
  intro: z.string().min(1),
  image: mediaAssetSchema,
  /** Grouping label, e.g. "Conservation"; empty when not set. */
  category: z.string(),
  objectives: z.array(z.string().min(1)),
  /** Rich text (src/lib/rich-text.ts); empty when not written yet. */
  body: z.string(),
  featured: z.boolean(),
  ...seoSchema.shape,
});

export type Programme = z.infer<typeof programmeSchema>;

/**
 * Programmes with their own designed page under /our-work. Any other
 * published programme is shown by the generic /our-work/[slug] page.
 */
export const bespokeProgrammeSlugs = [
  "plant-conservation",
  "environmental-conservation",
  "medicinal-plants",
  "indigenous-knowledge",
] as const;

export const programmeHref = (slug: string) => `/our-work/${slug}` as const;
