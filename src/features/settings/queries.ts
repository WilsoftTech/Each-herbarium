import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { emptySiteSettings, siteSettingsSchema, type SiteSettings } from "./schema";

/** Site settings as the public pages see them. */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.settings);

  const row = await getDb().siteSettings.findUnique({ where: { id: 1 } });
  if (!row) return emptySiteSettings;
  return siteSettingsSchema.parse({
    contactEmail: row.contactEmail,
    phone: row.phone,
    postalAddress: row.postalAddress,
    officeHours: row.officeHours,
    socialLinks: row.socialLinks,
  });
}
