import { z } from "zod";

/**
 * Content contracts shared by every content source. Since M04 the source is
 * the CMS database; rows are mapped to these shapes and validated on read, so
 * pages and components do not depend on the storage model.
 */

/**
 * Image or document location: a licensed file in /public/images (STATIC
 * storage) or an uploaded object served through the /media route (R2).
 */
export const mediaSrcSchema = z
  .string()
  .regex(/^\/(images\/[\w.-]+|media\/[a-z0-9][a-z0-9/._-]*)$/)
  .refine((src) => !src.includes(".."), "Path traversal is not allowed");

export const mediaAssetSchema = z.object({
  src: mediaSrcSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(20),
  /** Short caption describing what and where. */
  caption: z.string().min(1),
  credit: z.object({
    author: z.string().min(1),
    license: z.string().min(1),
    /** Null for licences without a public text, e.g. "All rights reserved". */
    licenseUrl: z.url().nullable(),
    /** Null when the file has no public source page (EACH's own photography). */
    sourceUrl: z.url().nullable(),
  }),
});

/** A downloadable file (PDF) attached to content. */
export const documentAssetSchema = z.object({
  src: mediaSrcSchema,
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  byteSize: z.number().int().nonnegative(),
});

export type DocumentAsset = z.infer<typeof documentAssetSchema>;

/**
 * `published`: approved by EACH. `placeholder`: shows the layout only; it is
 * labelled on the page, excluded from search indexing and structured data,
 * and never presented as institutional fact. Both are live (published) rows
 * in the CMS; drafts never reach these contracts.
 */
export const contentStatusSchema = z.enum(["published", "placeholder"]);

export const slugSchema = z
  .string()
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens.");

/** A titled block of paragraphs (project story, landscape notes, page sections). */
export const textSectionSchema = z.object({
  heading: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
});

export type TextSection = z.infer<typeof textSectionSchema>;

/** Search and sharing overrides carried by published content. */
export const seoSchema = z.object({
  /** Browser and search title, when it should differ from the title. */
  seoTitle: z.string().min(1).nullable(),
  /** Search description, when it should differ from the summary. */
  seoDescription: z.string().min(1).nullable(),
  /** Keep the page out of search results and the sitemap. */
  noindex: z.boolean(),
});

/** The editor's version: limits and messages for the same fields. */
export const seoInputSchema = z.object({
  seoTitle: z
    .string()
    .trim()
    .min(1)
    .max(120, "Keep the search title under 120 characters.")
    .nullable(),
  seoDescription: z
    .string()
    .trim()
    .min(30, "Write at least 30 characters, or leave it empty to use the summary.")
    .max(300, "Keep the search description under 300 characters.")
    .nullable(),
  noindex: z.boolean(),
});
