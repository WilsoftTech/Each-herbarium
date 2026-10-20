import "server-only";
import { z } from "zod";
import {
  formData,
  readSections,
  readSeoFields,
  pageCount,
  pageWindow,
  sectionImageIds,
  sectionsKeyField,
  type ListParams,
  type WorkflowCollection,
} from "@/features/cms";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import { seoInputSchema, slugSchema } from "@/validation/content";
import { designedProgrammeSections, isDesignedProgrammeSlug } from "../designed-content";
import { programmeSelect, readDesignedProgramme, toProgramme } from "../queries";

type Db = PrismaClient | Prisma.TransactionClient;

export const programmeInputSchema = z.object({
  title: z.string().min(1, "Enter a title.").max(120),
  slug: slugSchema,
  summary: z.string().min(1, "Enter a one-sentence summary.").max(300),
  intro: z.string().min(1, "Enter the opening paragraph.").max(2000),
  imageId: z.string().min(1, "Choose an image."),
  sortOrder: z.number("Enter a whole number.").int().min(0).max(10_000),
  placeholder: z.boolean(),
  category: z.string().trim().max(60),
  objectives: z.array(z.string().min(1).max(400)).max(20, "List at most 20 objectives."),
  body: z.string().max(20_000),
  featured: z.boolean(),
  /** Designed page sections of a founding programme; checked against its declaration when saving. */
  content: z.unknown().nullable(),
  ...seoInputSchema.shape,
});

export type ProgrammeInput = z.infer<typeof programmeInputSchema>;

/** Reads a founding programme's designed sections editor, or null if absent. */
function readDesignedContent(form: FormData): unknown {
  const slug = formData.text(form, sectionsKeyField);
  return isDesignedProgrammeSlug(slug) ? readSections(form, designedProgrammeSections[slug]) : null;
}

export function readProgrammeForm(form: FormData) {
  const { text, checkbox, integer, lines } = formData;
  return {
    title: text(form, "title"),
    slug: text(form, "slug"),
    summary: text(form, "summary"),
    intro: text(form, "intro"),
    imageId: text(form, "imageId"),
    sortOrder: integer(form, "sortOrder"),
    placeholder: checkbox(form, "placeholder"),
    category: text(form, "category"),
    objectives: lines(text(form, "objectives")),
    // Keep line structure: the rich-text format depends on it.
    body: (typeof form.get("body") === "string" ? String(form.get("body")) : "").trim(),
    featured: checkbox(form, "featured"),
    content: readDesignedContent(form),
    ...readSeoFields(form),
  };
}

export const programmeWorkflow: WorkflowCollection = {
  collection: "programmes",
  label: "Programme",
  async find(db, id) {
    const row = await db.programme.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, title: true },
    });
    return row && { ...row, label: row.title };
  },
  updateStatus(db, id, version, change) {
    return db.programme.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove(db, id) {
    return db.programme.delete({ where: { id } });
  },
  async checkPublishable(db, id) {
    const row = await db.programme.findUnique({ where: { id }, select: programmeSelect });
    if (!row) return "This programme no longer exists.";
    if (row.image.status !== "READY") return "The image has not finished uploading.";
    try {
      toProgramme(row);
    } catch {
      return "The image needs alt text of at least 20 characters and a caption before publishing.";
    }
    if (isDesignedProgrammeSlug(row.slug)) {
      let designed;
      try {
        designed = await readDesignedProgramme(db, row.slug, { id });
      } catch {
        return "Fill in every section of the programme's designed page before publishing.";
      }
      const content = designed?.content;
      const ids = sectionImageIds(designedProgrammeSections[row.slug], content);
      if (!ids.every((imageId) => designed?.images[imageId])) {
        return "Every image on the page must be uploaded, with alt text of at least 20 characters and a caption.";
      }
    }
    return null;
  },
};

export async function listProgrammesForAdmin(params: ListParams) {
  const search: Prisma.ProgrammeWhereInput = params.q
    ? {
        OR: [
          { title: { contains: params.q, mode: "insensitive" } },
          { slug: { contains: params.q.toLowerCase() } },
        ],
      }
    : {};
  const where: Prisma.ProgrammeWhereInput = { ...search, status: params.status };
  const db = getDb();
  const [rows, total, grouped] = await Promise.all([
    db.programme.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      ...pageWindow(params.page),
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        placeholder: true,
        updatedAt: true,
        sortOrder: true,
      },
    }),
    db.programme.count({ where }),
    db.programme.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
  ]);
  return {
    rows,
    pageCount: pageCount(total),
    counts: Object.fromEntries(grouped.map((group) => [group.status, group._count._all])),
  };
}

export function getProgrammeForAdmin(id: string, db: Db = getDb()) {
  return db.programme.findUnique({ where: { id } });
}

export type ProgrammeForAdmin = NonNullable<Awaited<ReturnType<typeof getProgrammeForAdmin>>>;
