import { z } from "zod";
import {
  contentStatusSchema,
  mediaAssetSchema,
  seoSchema,
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
  /** Chosen for the homepage's featured projects. */
  featured: z.boolean(),
  /** Country, or null until confirmed. */
  country: z.string().min(1).nullable(),
  /** ISO dates (YYYY-MM-DD), or null until confirmed. */
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  /** Whether the work is planned, under way, finished or paused; null until confirmed. */
  operationalStatus: z.enum(["planned", "active", "completed", "on-hold"]).nullable(),
  objectives: z.array(z.string().min(1)),
  activities: z.array(z.string().min(1)),
  /** Outcomes EACH can evidence. Never estimates. */
  outcomes: z.array(z.string().min(1)),
  /** Sources; may contain [text](https://…) links, rendered safely. */
  references: z.array(z.string().min(1)),
  ...seoSchema.shape,
});

export const projectStatusLabel = {
  planned: "Planned",
  active: "Under way",
  completed: "Completed",
  "on-hold": "On hold",
} as const;

export type Project = z.infer<typeof projectSchema>;
