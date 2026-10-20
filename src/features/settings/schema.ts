import { z } from "zod";

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1).max(60),
  url: z.url({ protocol: /^https$/ }),
});

/** Organisation-wide details. Every field is optional until EACH supplies it. */
export const siteSettingsSchema = z.object({
  contactEmail: z.email().nullable(),
  phone: z.string().min(1).nullable(),
  postalAddress: z.string().min(1).nullable(),
  officeHours: z.string().min(1).nullable(),
  socialLinks: z.array(socialLinkSchema),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const emptySiteSettings: SiteSettings = {
  contactEmail: null,
  phone: null,
  postalAddress: null,
  officeHours: null,
  socialLinks: [],
};
