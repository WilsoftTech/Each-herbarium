import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isUsable, mediaSelect, toMediaAsset } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { partnerSchema, type Partner } from "./schema";

export const partnerInclude = {
  logo: { select: mediaSelect },
} as const satisfies Prisma.PartnerInclude;

export type PartnerRow = Prisma.PartnerGetPayload<{ include: typeof partnerInclude }>;

/** Maps a row to the public contract. Throws if the row breaks it. */
export function toPartner(row: PartnerRow): Partner {
  return partnerSchema.parse({
    slug: row.slug,
    status: row.placeholder ? "placeholder" : "published",
    name: row.name,
    relationship: row.relationship,
    description: row.description,
    href: row.href,
    websiteUrl: row.websiteUrl,
    category: row.category,
    logo: isUsable(row.logo) ? toMediaAsset(row.logo) : null,
  });
}

/** Published partners, in display order. */
export async function listPartners(): Promise<Partner[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.partners, contentTags.media);

  const rows = await getDb().partner.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: partnerInclude,
    take: 100,
  });
  return rows.map(toPartner);
}
