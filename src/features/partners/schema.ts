import { z } from "zod";
import { contentStatusSchema, mediaAssetSchema, slugSchema } from "@/validation/content";

export const partnerRelationshipSchema = z.enum(["independent-partner"]);

export const partnerSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  name: z.string().min(1),
  /** How the organisations relate. Partners are always independent of EACH. */
  relationship: partnerRelationshipSchema,
  /** Verified description only. */
  description: z.string().min(1),
  /** Partner page on this site, if any. */
  href: z
    .string()
    .regex(/^\/[a-z0-9/-]*$/)
    .nullable(),
  /** The partner's own website, if any. */
  websiteUrl: z.url({ protocol: /^https$/ }).nullable(),
  /** Partnership category label, e.g. "Research"; empty when not set. */
  category: z.string(),
  /** The partner's approved logo, shown at its own proportions; null if none. */
  logo: mediaAssetSchema.nullable(),
});

export type Partner = z.infer<typeof partnerSchema>;
