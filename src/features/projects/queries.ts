import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isUsable, mediaSelect, toMediaAsset } from "@/features/media";
import { programmeHref } from "@/features/programmes";
import type { Prisma } from "@/generated/prisma/client";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { projectSchema, type Project } from "./schema";

/** Everything a project page shows. Shared with the admin preview. */
export const projectInclude = {
  image: { select: mediaSelect },
  gallery: { orderBy: { position: "asc" }, select: { media: { select: mediaSelect } } },
  programmes: {
    select: { programme: { select: { slug: true, title: true, status: true, sortOrder: true } } },
  },
  partners: {
    select: { partner: { select: { name: true, status: true, sortOrder: true } } },
  },
} as const satisfies Prisma.ProjectInclude;

export type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

/**
 * Maps a row to the public contract. Related programmes, partners and gallery
 * images appear only when they are themselves published or ready, so a draft
 * partner never leaks through a published project.
 */
export function toProject(row: ProjectRow): Project {
  return projectSchema.parse({
    slug: row.slug,
    status: row.placeholder ? "placeholder" : "published",
    title: row.title,
    summary: row.summary,
    ecosystem: row.ecosystem,
    location: row.location,
    period: row.period,
    programmes: row.programmes
      .map(({ programme }) => programme)
      .filter((programme) => programme.status === "PUBLISHED")
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ slug, title }) => ({ slug, title, href: programmeHref(slug) })),
    image: toMediaAsset(row.image),
    gallery: row.gallery
      .map(({ media }) => media)
      .filter(isUsable)
      .map(toMediaAsset),
    landscape: row.landscape,
    story: row.story,
    partners: row.partners
      .map(({ partner }) => partner)
      .filter((partner) => partner.status === "PUBLISHED")
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((partner) => partner.name),
  });
}

/** All published projects, in display order. */
export async function listProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.projects, contentTags.programmes, contentTags.partners, contentTags.media);

  const rows = await getDb().project.findMany({
    where: { status: "PUBLISHED", image: { status: "READY" } },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    include: projectInclude,
    take: 100,
  });
  return rows.map(toProject);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await listProjects()).find((project) => project.slug === slug);
}

/** Projects linked to a programme, for the programme pages. */
export async function listProjectsForProgramme(programme: string): Promise<Project[]> {
  return (await listProjects()).filter((project) =>
    project.programmes.some(({ slug }) => slug === programme),
  );
}
