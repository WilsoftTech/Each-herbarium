import { z } from "zod";
import { contentStatusSchema, mediaAssetSchema, slugSchema } from "@/validation/content";

export const resourceTypeSchema = z.enum(["publication", "guide", "story"]);

export const resourceSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  type: resourceTypeSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  /** ISO date (YYYY-MM-DD), or null until EACH confirms it. */
  published: z.iso.date().nullable(),
  authors: z.array(z.string().min(1)),
  image: mediaAssetSchema.nullable(),
  /** Article text as paragraphs. Empty until EACH supplies it. */
  body: z.array(z.string().min(1)),
});

export type Resource = z.infer<typeof resourceSchema>;
export type ResourceInput = z.input<typeof resourceSchema>;
export type ResourceType = z.infer<typeof resourceTypeSchema>;

export const resourceTypeLabel: Record<ResourceType, string> = {
  publication: "Publication",
  guide: "Guide",
  story: "Story",
};
