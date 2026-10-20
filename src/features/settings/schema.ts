import { z } from "zod";
import {
  navigationOverridesSchema,
  noNavigationOverrides,
  type NavigationOverrides,
} from "@/config/navigation";
import { mediaAssetSchema } from "@/validation/content";

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1).max(60),
  url: z.url({ protocol: /^https$/ }),
});

/**
 * Organisation-wide settings as public pages see them. Contact fields are
 * optional until EACH supplies them. The organisation's name and logo are
 * protected brand assets in code (src/config/site.ts, BrandMark), not here.
 */
export const siteSettingsSchema = z.object({
  contactEmail: z.email().nullable(),
  phone: z.string().min(1).nullable(),
  postalAddress: z.string().min(1).nullable(),
  locationText: z.string().min(1).nullable(),
  officeHours: z.string().min(1).nullable(),
  socialLinks: z.array(socialLinkSchema),
  /** One sentence about EACH: footer, structured data, default description. */
  tagline: z.string().min(1),
  footerStatement: z.string().min(1),
  footerNote: z.string(),
  /** Empty hides the copyright line. */
  copyrightText: z.string(),
  /** Default sharing image; null uses the built-in default. */
  socialImage: mediaAssetSchema.nullable(),
  navigation: navigationOverridesSchema,
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

/** Used only when the settings row is missing (a database that was never seeded). */
export const emptySiteSettings: SiteSettings = {
  contactEmail: null,
  phone: null,
  postalAddress: null,
  locationText: null,
  officeHours: null,
  socialLinks: [],
  tagline:
    "Plant conservation, herbarium development and botanical knowledge for East Africa, beginning in Uganda.",
  footerStatement: "Preserving East Africa's Plant Heritage.",
  footerNote: "",
  copyrightText: "",
  socialImage: null,
  navigation: noNavigationOverrides,
};

export type { NavigationOverrides };
