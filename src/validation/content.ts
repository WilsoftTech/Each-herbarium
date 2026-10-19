import { z } from "zod";

/**
 * Content contracts shared by every content source. In M03 the sources are
 * typed static modules; in M04 the CMS returns rows that must satisfy the
 * same schemas, so pages and components do not change when the source does.
 */

export const mediaAssetSchema = z.object({
  src: z.string().regex(/^\/images\//),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(20),
  /** Short caption describing what and where. */
  caption: z.string().min(1),
  credit: z.object({
    author: z.string().min(1),
    license: z.string().min(1),
    licenseUrl: z.url(),
    sourceUrl: z.url(),
  }),
});

/**
 * `published`: approved by EACH. `placeholder`: shows the layout only; it is
 * labelled on the page, excluded from search indexing and structured data,
 * and never presented as institutional fact.
 */
export const contentStatusSchema = z.enum(["published", "placeholder"]);

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
