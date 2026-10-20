import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { partnerSchema, type Partner } from "./schema";

/** Published partners, in display order. */
export async function listPartners(): Promise<Partner[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.partners);

  const rows = await getDb().partner.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: 100,
  });
  return rows.map((row) =>
    partnerSchema.parse({
      slug: row.slug,
      status: row.placeholder ? "placeholder" : "published",
      name: row.name,
      relationship: row.relationship,
      description: row.description,
      href: row.href,
      websiteUrl: row.websiteUrl,
    }),
  );
}
