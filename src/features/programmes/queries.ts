import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { MediaAsset } from "@/config/media";
import { sectionImageIds } from "@/features/cms";
import { mediaSelect, toMediaAsset, usableImages } from "@/features/media";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import {
  designedProgrammeSchema,
  designedProgrammeSections,
  type DesignedProgrammeContent,
  type DesignedProgrammeSlug,
} from "./designed-content";
import { programmeHref, programmeSchema, type Programme } from "./schema";

export const programmeSelect = {
  slug: true,
  placeholder: true,
  title: true,
  summary: true,
  intro: true,
  category: true,
  objectives: true,
  body: true,
  featured: true,
  seoTitle: true,
  seoDescription: true,
  noindex: true,
  image: { select: mediaSelect },
} as const satisfies Prisma.ProgrammeSelect;

export type ProgrammeRow = Prisma.ProgrammeGetPayload<{ select: typeof programmeSelect }>;

export function toProgramme(row: ProgrammeRow): Programme {
  return programmeSchema.parse({
    slug: row.slug,
    status: row.placeholder ? "placeholder" : "published",
    href: programmeHref(row.slug),
    title: row.title,
    summary: row.summary,
    intro: row.intro,
    image: toMediaAsset(row.image),
    category: row.category,
    objectives: row.objectives,
    body: row.body,
    featured: row.featured,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    noindex: row.noindex,
  });
}

/** Published programmes in display order. Cached until a programme or image changes. */
export async function listProgrammes(): Promise<Programme[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.programmes, contentTags.media);

  const rows = await getDb().programme.findMany({
    where: { status: "PUBLISHED", image: { status: "READY" } },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: programmeSelect,
    take: 50,
  });
  return rows.map(toProgramme);
}

export async function getProgramme(slug: string): Promise<Programme | undefined> {
  return (await listProgrammes()).find((programme) => programme.slug === slug);
}

/** The programme after `slug`, wrapping round, for "next programme" links. */
export async function nextProgramme(slug: string): Promise<Programme | undefined> {
  const programmes = await listProgrammes();
  const index = programmes.findIndex((programme) => programme.slug === slug);
  return programmes[(index + 1) % programmes.length];
}

/** A founding programme with its designed page sections and their usable images, by media id. */
export type DesignedProgramme<S extends DesignedProgrammeSlug> = {
  programme: Programme;
  content: DesignedProgrammeContent<S>;
  images: Record<string, MediaAsset>;
};

/**
 * Reads a programme row with the media its designed sections refer to and
 * maps it to the public contract. Throws if the record or its sections break
 * the contract. Shared by the public pages and the publishing check.
 */
export async function readDesignedProgramme<S extends DesignedProgrammeSlug>(
  db: PrismaClient | Prisma.TransactionClient,
  slug: S,
  where: Prisma.ProgrammeWhereInput,
): Promise<DesignedProgramme<S> | undefined> {
  const row = await db.programme.findFirst({
    where: { ...where, slug },
    select: { ...programmeSelect, content: true },
  });
  if (!row) return undefined;
  const ids = sectionImageIds(designedProgrammeSections[slug], row.content);
  const media = ids.length
    ? await db.mediaAsset.findMany({ where: { id: { in: ids } }, select: mediaSelect })
    : [];
  return {
    programme: toProgramme(row),
    content: designedProgrammeSchema(slug).parse(row.content),
    images: usableImages(media),
  };
}

/** A published founding programme with its designed page sections. */
export async function getDesignedProgramme<S extends DesignedProgrammeSlug>(
  slug: S,
): Promise<DesignedProgramme<S> | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.programmes, contentTags.media);

  return readDesignedProgramme(getDb(), slug, {
    status: "PUBLISHED",
    image: { status: "READY" },
  });
}
