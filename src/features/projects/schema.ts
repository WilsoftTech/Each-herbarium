import { z } from "zod";
import {
  contentStatusSchema,
  mediaAssetSchema,
  slugSchema,
  textSectionSchema,
} from "@/validation/content";

/** A programme a project belongs to, as shown on the project page. */
const projectProgrammeSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  href: z
    .string()
    .regex(/^\/our-work\/[a-z0-9-]+$/)
    .transform((href) => href as `/our-work/${string}`),
});

export const projectSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  /** Landscape type, for example "Montane forest". */
  ecosystem: z.string().min(1),
  /** Place name, or null until EACH confirms it. */
  location: z.string().min(1).nullable(),
  /** For example "2026 to 2028", or null until confirmed. */
  period: z.string().min(1).nullable(),
  /** Published programmes only. */
  programmes: z.array(projectProgrammeSchema),
  image: mediaAssetSchema,
  gallery: z.array(mediaAssetSchema),
  /** General description of the landscape shown; no claims about the project. */
  landscape: textSectionSchema,
  /** The project story, in order. Empty until EACH supplies it. */
  story: z.array(textSectionSchema),
  /** Names of published partners. Empty until EACH supplies them. */
  partners: z.array(z.string().min(1)),
});

export type Project = z.infer<typeof projectSchema>;
