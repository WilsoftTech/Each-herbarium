import { z } from "zod";
import { contentStatusSchema, slugSchema } from "@/validation/content";

export const partnerSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  name: z.string().min(1),
  /** How the organisations relate. Partners are always independent of EACH. */
  relationship: z.enum(["independent-partner"]),
  /** Verified description only. */
  description: z.string().min(1),
  /** Partner page on this site, if any. */
  href: z
    .string()
    .regex(/^\/[a-z0-9/-]*$/)
    .nullable(),
});

export type Partner = z.infer<typeof partnerSchema>;
export type PartnerInput = z.input<typeof partnerSchema>;
