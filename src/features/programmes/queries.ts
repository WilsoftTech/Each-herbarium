import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { mediaSelect, toMediaAsset } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { programmeHref, programmeSchema, type Programme } from "./schema";

export const programmeSelect = {
  slug: true,
  placeholder: true,
  title: true,
  summary: true,
  intro: true,
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
