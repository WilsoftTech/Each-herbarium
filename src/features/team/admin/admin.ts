import "server-only";
import { z } from "zod";
import {
  formData,
  pageCount,
  pageWindow,
  type ListParams,
  type WorkflowCollection,
} from "@/features/cms";
import { isUsable, mediaSelect, toMediaAsset } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import { slugSchema } from "@/validation/content";

export const teamGroups = ["LEADERSHIP", "BOARD", "ADVISER"] as const;

export const teamMemberInputSchema = z.object({
  name: z.string().min(1, "Enter the person's name.").max(200),
  slug: slugSchema,
  roleTitle: z.string().min(1, "Enter their role.").max(200),
  group: z.enum(teamGroups),
  bio: z.array(z.string().min(1)).max(10),
  photoId: z.string().nullable(),
  consentConfirmed: z.boolean(),
  sortOrder: z.number("Enter a whole number.").int().min(0).max(10_000),
  placeholder: z.boolean(),
});

export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;

export function readTeamMemberForm(form: FormData) {
  const { text, optionalText, checkbox, integer, paragraphs } = formData;
  return {
    name: text(form, "name"),
    slug: text(form, "slug"),
    roleTitle: text(form, "roleTitle"),
    group: text(form, "group"),
    bio: paragraphs(text(form, "bio")),
    photoId: optionalText(form, "photoId"),
    consentConfirmed: checkbox(form, "consentConfirmed"),
    sortOrder: integer(form, "sortOrder"),
    placeholder: checkbox(form, "placeholder"),
  };
}

export const teamWorkflow: WorkflowCollection = {
  collection: "team",
  label: "Team member",
  async find(db, id) {
    const row = await db.teamMember.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, name: true },
    });
    return (
      row && {
        id: row.id,
        slug: row.slug,
        status: row.status,
        version: row.version,
        label: row.name,
      }
    );
  },
  updateStatus(db, id, version, change) {
    return db.teamMember.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove(db, id) {
    return db.teamMember.delete({ where: { id } });
  },
  async checkPublishable(db, id) {
    const row = await db.teamMember.findUnique({
      where: { id },
      include: { photo: { select: mediaSelect } },
    });
    if (!row) return "This team member no longer exists.";
    if (!row.consentConfirmed) {
      return "Confirm that this person has agreed to appear on the website before publishing.";
    }
    if (row.photo) {
      if (!isUsable(row.photo)) return "The photograph has not finished uploading.";
      try {
        toMediaAsset(row.photo);
      } catch {
        return "The photograph needs alt text of at least 20 characters and a caption.";
      }
    }
    return null;
  },
};

export async function listTeamForAdmin(params: ListParams) {
  const search: Prisma.TeamMemberWhereInput = params.q
    ? {
        OR: [
          { name: { contains: params.q, mode: "insensitive" } },
          { slug: { contains: params.q.toLowerCase() } },
        ],
      }
    : {};
  const where: Prisma.TeamMemberWhereInput = { ...search, status: params.status };
  const db = getDb();
  const [rows, total, grouped] = await Promise.all([
    db.teamMember.findMany({
      where,
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      ...pageWindow(params.page),
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        placeholder: true,
        updatedAt: true,
        roleTitle: true,
      },
    }),
    db.teamMember.count({ where }),
    db.teamMember.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
  ]);
  return {
    rows: rows.map(({ name, ...row }) => ({ ...row, title: name })),
    pageCount: pageCount(total),
    counts: Object.fromEntries(grouped.map((group) => [group.status, group._count._all])),
  };
}

export function getTeamMemberForAdmin(id: string) {
  return getDb().teamMember.findUnique({ where: { id } });
}

export type TeamMemberForAdmin = NonNullable<Awaited<ReturnType<typeof getTeamMemberForAdmin>>>;
