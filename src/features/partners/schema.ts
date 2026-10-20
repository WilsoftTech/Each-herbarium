import { z } from "zod";
import { contentStatusSchema, slugSchema } from "@/validation/content";

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
});

export type Partner = z.infer<typeof partnerSchema>;
