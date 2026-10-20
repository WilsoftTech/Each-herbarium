import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isUsable, mediaSelect, toMediaAsset, usableImages, type MediaRow } from "@/features/media";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { sectionImageIds } from "@/features/cms";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { homeContentSchema, homeImageIds } from "./home-content";
import {
  isLandingSlug,
  landingContentSchema,
  landingSections,
  type LandingSlug,
} from "./landing-content";
import {
  homePageSchema,
  pageSchema,
  type HomePage,
  type LandingPage,
  type ManagedPageSlug,
  type Page,
} from "./schema";

type Db = PrismaClient | Prisma.TransactionClient;

export const pageInclude = {
  heroImage: { select: mediaSelect },
} as const satisfies Prisma.PageInclude;

export type PageRow = Prisma.PageGetPayload<{ include: typeof pageInclude }>;

/** A page row with the media its designed sections refer to. */
export type PageRowWithMedia = PageRow & { sectionMedia: MediaRow[] };

/**
 * The public image, or null when it is missing, not uploaded or lacks the
 * required alt text and caption. Publishing rejects such images
 * (checkPublishable); at render time the image is left out instead of
 * breaking the page.
 */
function usableAsset(row: MediaRow | null | undefined) {
  if (!isUsable(row)) return null;
  try {
    return toMediaAsset(row);
  } catch {
    return null;
  }
}

/** Maps a page row to the public contract. Throws if the row breaks it. */
export function toPage(row: PageRow): Page {
  return pageSchema.parse({
    slug: row.slug,
    status: row.placeholder ? "placeholder" : "published",
    title: row.title,
    description: row.description,
    eyebrow: row.eyebrow,
    lead: row.lead,
    body: row.body,
    image: usableAsset(row.heroImage),
    seoTitle: row.seoTitle,
    noindex: row.noindex,
  });
}

/** Maps the homepage row and its section media. Throws if the content breaks the contract. */
export function toHomePage(row: PageRowWithMedia): HomePage {
  const parsed = homePageSchema.parse({
    page: toPage(row),
    content: homeContentSchema.parse(row.content),
  });
  const byId = new Map(row.sectionMedia.map((media) => [media.id, media]));
  const image = (id: string) => usableAsset(byId.get(id));
  const { content } = parsed;
  return {
    ...parsed,
    images: {
      heritage: image(content.heritage.imageId),
      landscapes: content.heritage.landscapes.map((landscape) => image(landscape.imageId)),
      research: image(content.research.imageId),
      community: image(content.community.imageId),
      panels: [
        image(content.involved.panels[0].imageId),
        image(content.involved.panels[1].imageId),
      ],
    },
  };
}

/** Maps a landing page row, its sections and their media. Throws if the content breaks the contract. */
export function toLandingPage<S extends LandingSlug>(
  slug: S,
  row: PageRowWithMedia,
): LandingPage<S> {
  return {
    slug,
    page: toPage(row),
    content: landingContentSchema(slug).parse(row.content),
    images: usableImages(row.sectionMedia),
  };
}

/** Media ids referred to by a page's designed sections (homepage or landing page). */
function contentImageIds(slug: string, content: unknown): string[] {
  if (slug === "home") {
    const parsed = homeContentSchema.safeParse(content);
    return parsed.success ? homeImageIds(parsed.data) : [];
  }
  return isLandingSlug(slug) ? sectionImageIds(landingSections[slug], content) : [];
}

/** Reads a page with its images. Shared by public queries and admin previews. */
export async function readPageRow(db: Db, where: Prisma.PageWhereUniqueInput) {
  const row = await db.page.findUnique({ where, include: pageInclude });
  if (!row) return null;
  const ids = contentImageIds(row.slug, row.content);
  const sectionMedia = ids.length
    ? await db.mediaAsset.findMany({ where: { id: { in: ids } }, select: mediaSelect })
    : [];
  return { ...row, sectionMedia } satisfies PageRowWithMedia;
}

/** The published version of a managed page, or undefined. */
export async function getPage(slug: ManagedPageSlug): Promise<Page | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.pages, contentTags.media);

  const row = await getDb().page.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: pageInclude,
  });
  return row ? toPage(row) : undefined;
}

/** The published homepage, or undefined. */
export async function getHomePage(): Promise<HomePage | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.pages, contentTags.media);

  const row = await readPageRow(getDb(), { slug: "home" });
  return row && row.status === "PUBLISHED" ? toHomePage(row) : undefined;
}

/** The published version of a landing page with its sections, or undefined. */
export async function getLandingPage<S extends LandingSlug>(
  slug: S,
): Promise<LandingPage<S> | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.pages, contentTags.media);

  const row = await readPageRow(getDb(), { slug });
  return row && row.status === "PUBLISHED" ? toLandingPage(slug, row) : undefined;
}

/** Slugs of published, indexable pages, for the sitemap. */
export async function listIndexablePages(): Promise<{ slug: string; updatedAt: Date }[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.pages);

  return getDb().page.findMany({
    where: { status: "PUBLISHED", placeholder: false, noindex: false },
    select: { slug: true, updatedAt: true },
    take: 100,
  });
}
