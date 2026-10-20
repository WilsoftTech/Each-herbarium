import { z } from "zod";
import { contentStatusSchema, slugSchema } from "@/validation/content";

/**
 * Prose pages managed in the CMS. Each slug belongs to a fixed route, which
 * decides the layout; the CMS supplies the words.
 */
export const managedPageSlugs = ["privacy", "terms", "accessibility"] as const;
export type ManagedPageSlug = (typeof managedPageSlugs)[number];

export const pageSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  title: z.string().min(1),
  description: z.string().min(30),
  eyebrow: z.string().min(1),
  lead: z.string(),
  /** Rich text (src/lib/rich-text.ts). */
  body: z.string(),
});

export type Page = z.infer<typeof pageSchema>;
