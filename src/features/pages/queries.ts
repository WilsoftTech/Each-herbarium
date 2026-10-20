import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { pageSchema, type ManagedPageSlug, type Page } from "./schema";

/** The published version of a managed page, or undefined. */
export async function getPage(slug: ManagedPageSlug): Promise<Page | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.pages);

  const row = await getDb().page.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!row) return undefined;
  return pageSchema.parse({
    slug: row.slug,
    status: row.placeholder ? "placeholder" : "published",
    title: row.title,
    description: row.description,
    eyebrow: row.eyebrow,
    lead: row.lead,
    body: row.body,
  });
}
