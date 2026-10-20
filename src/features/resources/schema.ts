import { z } from "zod";
import {
  contentStatusSchema,
  documentAssetSchema,
  mediaAssetSchema,
  slugSchema,
} from "@/validation/content";

export const resourceTypeSchema = z.enum(["publication", "guide", "story"]);

/** An article read on the site at /resources/[slug] (CMS model: Article). */
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
  /** Optional download, e.g. the full publication as PDF. */
  document: documentAssetSchema.nullable(),
});

export type Resource = z.infer<typeof resourceSchema>;
export type ResourceType = z.infer<typeof resourceTypeSchema>;

export const resourceTypeLabel: Record<ResourceType, string> = {
  publication: "Publication",
  guide: "Guide",
  story: "Story",
};

/** A standalone download listed on /resources (CMS model: Resource). */
export const downloadSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  published: z.iso.date().nullable(),
  document: documentAssetSchema,
});

export type Download = z.infer<typeof downloadSchema>;
