import { z } from "zod";
import { contentStatusSchema, mediaAssetSchema, slugSchema } from "@/validation/content";

const programmeSlugSchema = z.enum([
  "plant-conservation",
  "environmental-conservation",
  "medicinal-plants",
  "indigenous-knowledge",
]);

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
  programmes: z.array(programmeSlugSchema).min(1),
  image: mediaAssetSchema,
  gallery: z.array(mediaAssetSchema),
  /** General description of the landscape shown; no claims about the project. */
  landscape: z.object({ heading: z.string().min(1), body: z.array(z.string().min(1)).min(1) }),
  /** The project story, in order. Empty until EACH supplies it. */
  story: z.array(z.object({ heading: z.string().min(1), body: z.array(z.string().min(1)).min(1) })),
  /** Confirmed partner names. Empty until EACH supplies them. */
  partners: z.array(z.string().min(1)),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
