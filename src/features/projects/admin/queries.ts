import "server-only";
import { pageCount, pageWindow, type ListParams } from "@/features/cms";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import { projectInclude, toProject } from "../queries";

/** One page of projects for the admin list, with per-status counts. Admin pages call requireAdmin() first. */
export async function listProjectsForAdmin(params: ListParams) {
  const search: Prisma.ProjectWhereInput = params.q
    ? {
        OR: [
          { title: { contains: params.q, mode: "insensitive" } },
          { slug: { contains: params.q.toLowerCase() } },
        ],
      }
    : {};
  const where: Prisma.ProjectWhereInput = { ...search, status: params.status };
  const db = getDb();

  const [rows, total, grouped] = await Promise.all([
    db.project.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      ...pageWindow(params.page),
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        placeholder: true,
        updatedAt: true,
        ecosystem: true,
      },
    }),
    db.project.count({ where }),
    db.project.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
  ]);

  return {
    rows,
    pageCount: pageCount(total),
    counts: Object.fromEntries(grouped.map((group) => [group.status, group._count._all])),
  };
}

/** A project with everything the editor shows, whatever its status. */
export function getProjectForAdmin(id: string) {
  return getDb().project.findUnique({
    where: { id },
    include: {
      gallery: { orderBy: { position: "asc" }, select: { mediaId: true } },
      programmes: { select: { programmeId: true } },
      partners: { select: { partnerId: true } },
    },
  });
}

export type ProjectForAdmin = NonNullable<Awaited<ReturnType<typeof getProjectForAdmin>>>;

/** Programmes and partners a project can link to (any status; only published ones show publicly). */
export async function getProjectFormOptions() {
  const db = getDb();
  const [programmes, partners] = await Promise.all([
    db.programme.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: { id: true, title: true, status: true },
      take: 100,
    }),
    db.partner.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, status: true },
      take: 200,
    }),
  ]);
  return { programmes, partners };
}

/**
 * A project of any status mapped to the public contract, for the admin
 * preview. Returns an error message instead when the draft cannot be shown yet.
 */
export async function getProjectPreview(id: string) {
  const row = await getDb().project.findUnique({ where: { id }, include: projectInclude });
  if (!row) return null;
  try {
    return { project: toProject(row), status: row.status, error: null };
  } catch {
    return {
      project: null,
      status: row.status,
      error:
        "This draft cannot be previewed until every image has alt text of at least 20 characters and a caption.",
    };
  }
}
