import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import {
  applyNavigation,
  navigationOverridesSchema,
  noNavigationOverrides,
  primaryNavigation,
  type NavItem,
} from "@/config/navigation";
import { isUsable, mediaSelect, toMediaAsset, type MediaRow } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { emptySiteSettings, siteSettingsSchema, type SiteSettings } from "./schema";

export const settingsInclude = {
  socialImage: { select: mediaSelect },
} as const satisfies Prisma.SiteSettingsInclude;

export type SettingsRow = Prisma.SiteSettingsGetPayload<{ include: typeof settingsInclude }>;

function usableImage(row: MediaRow | null) {
  if (!isUsable(row)) return null;
  try {
    return toMediaAsset(row);
  } catch {
    return null;
  }
}

/**
 * Maps the settings row. Stored navigation overrides that no longer validate
 * (for example after a code change) are ignored rather than breaking the menus.
 */
export function toSiteSettings(row: SettingsRow): SiteSettings {
  const navigation = navigationOverridesSchema.safeParse(row.navigation);
  return siteSettingsSchema.parse({
    contactEmail: row.contactEmail,
    phone: row.phone,
    postalAddress: row.postalAddress,
    locationText: row.locationText,
    officeHours: row.officeHours,
    socialLinks: row.socialLinks,
    tagline: row.tagline,
    footerStatement: row.footerStatement,
    footerNote: row.footerNote,
    copyrightText: row.copyrightText,
    socialImage: usableImage(row.socialImage),
    navigation: navigation.success ? navigation.data : noNavigationOverrides,
    acceptEnquiries: row.acceptEnquiries,
  });
}

/** Site settings as the public pages see them. Cached until settings or media change. */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.settings, contentTags.media);

  const row = await getDb().siteSettings.findUnique({
    where: { id: 1 },
    include: settingsInclude,
  });
  return row ? toSiteSettings(row) : emptySiteSettings;
}

/** The public navigation with the CMS overrides applied (header, mobile menu, footer). */
export async function getNavigation(): Promise<NavItem[]> {
  const settings = await getSiteSettings();
  return applyNavigation(primaryNavigation, settings.navigation);
}

/** The settings row for the admin forms (uncached). Admin pages call requireAdmin() first. */
export async function getSettingsForAdmin(): Promise<
  SiteSettings & { socialImageId: string | null }
> {
  const row = await getDb().siteSettings.findUnique({
    where: { id: 1 },
    include: settingsInclude,
  });
  return row
    ? { ...toSiteSettings(row), socialImageId: row.socialImageId }
    : { ...emptySiteSettings, socialImageId: null };
}

/** Everything the public header and footer need: navigation and footer wording. */
export async function getSiteChrome() {
  const settings = await getSiteSettings();
  return {
    navigation: applyNavigation(primaryNavigation, settings.navigation),
    footer: {
      statement: settings.footerStatement,
      tagline: settings.tagline,
      note: settings.footerNote,
      copyright: settings.copyrightText,
    },
  };
}
