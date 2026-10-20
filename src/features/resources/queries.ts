import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isUsable, mediaSelect, toDocumentAsset, toMediaAsset } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { downloadSchema, resourceSchema, type Download, type Resource } from "./schema";

const isoDate = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : null);

/** Everything an article page shows. Shared with the admin preview. */
export const articleInclude = {
  image: { select: mediaSelect },
  document: { select: mediaSelect },
} as const satisfies Prisma.ArticleInclude;

export type ArticleRow = Prisma.ArticleGetPayload<{ include: typeof articleInclude }>;

export function toResource(row: ArticleRow): Resource {
  return resourceSchema.parse({
    slug: row.slug,
    status: row.placeholder ? "placeholder" : "published",
    type: row.type.toLowerCase(),
    title: row.title,
    summary: row.summary,
    published: isoDate(row.publishedOn),
    authors: row.authors,
    image: isUsable(row.image) ? toMediaAsset(row.image) : null,
    body: row.body,
    document: isUsable(row.document) ? toDocumentAsset(row.document) : null,
    featured: row.featured,
    references: row.references,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    noindex: row.noindex,
  });
}

/** Published articles, newest first; undated entries last. */
export async function listResources(): Promise<Resource[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.articles, contentTags.media);

  const rows = await getDb().article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedOn: { sort: "desc", nulls: "last" } }, { createdAt: "asc" }],
    include: articleInclude,
    take: 200,
  });
  return rows.map(toResource);
}

export async function getResource(slug: string): Promise<Resource | undefined> {
  return (await listResources()).find((resource) => resource.slug === slug);
}

/** Published standalone downloads, newest first. */
export async function listDownloads(): Promise<Download[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.resources, contentTags.media);

  const rows = await getDb().resource.findMany({
    where: { status: "PUBLISHED", document: { status: "READY" } },
    orderBy: [{ publishedOn: { sort: "desc", nulls: "last" } }, { title: "asc" }],
    include: { document: { select: mediaSelect } },
    take: 200,
  });
  return rows.map((row) =>
    downloadSchema.parse({
      slug: row.slug,
      status: row.placeholder ? "placeholder" : "published",
      title: row.title,
      summary: row.summary,
      published: isoDate(row.publishedOn),
      document: toDocumentAsset(row.document),
    }),
  );
}
