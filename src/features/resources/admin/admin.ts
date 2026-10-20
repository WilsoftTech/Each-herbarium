import "server-only";
import { z } from "zod";
import {
  formData,
  readSeoFields,
  pageCount,
  pageWindow,
  type ListParams,
  type WorkflowCollection,
} from "@/features/cms";
import { mediaSelect, toDocumentAsset } from "@/features/media";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import { seoInputSchema, slugSchema } from "@/validation/content";
import { articleInclude, toResource } from "../queries";

type Db = PrismaClient | Prisma.TransactionClient;

const isoDate = z.iso.date("Use the date picker or YYYY-MM-DD.").nullable();

export const articleTypes = ["PUBLICATION", "GUIDE", "STORY"] as const;

export const articleInputSchema = z.object({
  type: z.enum(articleTypes),
  title: z.string().min(1, "Enter a title.").max(200),
  slug: slugSchema,
  summary: z.string().min(1, "Enter a summary.").max(600),
  publishedOn: isoDate,
  authors: z.array(z.string().min(1).max(200)).max(30),
  body: z.array(z.string().min(1)).max(200),
  imageId: z.string().nullable(),
  documentId: z.string().nullable(),
  placeholder: z.boolean(),
  references: z.array(z.string().min(1).max(600)).max(50, "List at most 50 references."),
  featured: z.boolean(),
  ...seoInputSchema.shape,
});

export type ArticleInput = z.infer<typeof articleInputSchema>;

export function readArticleForm(form: FormData) {
  const { text, optionalText, checkbox, blocks, lines } = formData;
  // Keep line structure inside blocks: lists keep one item per line.
  const body = typeof form.get("body") === "string" ? String(form.get("body")) : "";
  return {
    type: text(form, "type"),
    title: text(form, "title"),
    slug: text(form, "slug"),
    summary: text(form, "summary"),
    publishedOn: optionalText(form, "publishedOn"),
    authors: lines(text(form, "authors")),
    body: blocks(body),
    imageId: optionalText(form, "imageId"),
    documentId: optionalText(form, "documentId"),
    placeholder: checkbox(form, "placeholder"),
    references: lines(text(form, "references")),
    featured: checkbox(form, "featured"),
    ...readSeoFields(form),
  };
}

export const downloadInputSchema = z.object({
  title: z.string().min(1, "Enter a title.").max(200),
  slug: slugSchema,
  summary: z.string().min(1, "Enter a summary.").max(600),
  publishedOn: isoDate,
  documentId: z.string().min(1, "Choose the PDF to download."),
  placeholder: z.boolean(),
});

export type DownloadInput = z.infer<typeof downloadInputSchema>;

export function readDownloadForm(form: FormData) {
  const { text, optionalText, checkbox } = formData;
  return {
    title: text(form, "title"),
    slug: text(form, "slug"),
    summary: text(form, "summary"),
    publishedOn: optionalText(form, "publishedOn"),
    documentId: text(form, "documentId"),
    placeholder: checkbox(form, "placeholder"),
  };
}

export const articleWorkflow: WorkflowCollection = {
  collection: "articles",
  label: "Article",
  async find(db, id) {
    const row = await db.article.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, title: true },
    });
    return row && { ...row, label: row.title };
  },
  updateStatus(db, id, version, change) {
    return db.article.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove(db, id) {
    return db.article.delete({ where: { id } });
  },
  async checkPublishable(db, id) {
    const row = await db.article.findUnique({ where: { id }, include: articleInclude });
    if (!row) return "This article no longer exists.";
    if (row.image && row.image.status !== "READY") return "The image has not finished uploading.";
    if (row.document && row.document.status !== "READY")
      return "The PDF has not finished uploading.";
    try {
      toResource(row);
    } catch {
      return "Some details do not meet the publishing rules. The image needs alt text of at least 20 characters and a caption.";
    }
    return null;
  },
};

export const downloadWorkflow: WorkflowCollection = {
  collection: "resources",
  label: "Resource",
  async find(db, id) {
    const row = await db.resource.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, title: true },
    });
    return row && { ...row, label: row.title };
  },
  updateStatus(db, id, version, change) {
    return db.resource.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove(db, id) {
    return db.resource.delete({ where: { id } });
  },
  async checkPublishable(db, id) {
    const row = await db.resource.findUnique({
      where: { id },
      include: { document: { select: mediaSelect } },
    });
    if (!row) return "This resource no longer exists.";
    if (row.document.status !== "READY") return "The PDF has not finished uploading.";
    try {
      toDocumentAsset(row.document);
    } catch {
      return "The document cannot be published.";
    }
    return null;
  },
};

function searchWhere(q: string | undefined) {
  return q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q.toLowerCase() } },
        ],
      }
    : {};
}

export async function listArticlesForAdmin(params: ListParams) {
  const search: Prisma.ArticleWhereInput = searchWhere(params.q);
  const where: Prisma.ArticleWhereInput = { ...search, status: params.status };
  const db = getDb();
  const [rows, total, grouped] = await Promise.all([
    db.article.findMany({
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
        type: true,
      },
    }),
    db.article.count({ where }),
    db.article.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
  ]);
  return {
    rows,
    pageCount: pageCount(total),
    counts: Object.fromEntries(grouped.map((group) => [group.status, group._count._all])),
  };
}

export async function listDownloadsForAdmin(params: ListParams) {
  const search: Prisma.ResourceWhereInput = searchWhere(params.q);
  const where: Prisma.ResourceWhereInput = { ...search, status: params.status };
  const db = getDb();
  const [rows, total, grouped] = await Promise.all([
    db.resource.findMany({
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
      },
    }),
    db.resource.count({ where }),
    db.resource.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
  ]);
  return {
    rows,
    pageCount: pageCount(total),
    counts: Object.fromEntries(grouped.map((group) => [group.status, group._count._all])),
  };
}

export function getArticleForAdmin(id: string, db: Db = getDb()) {
  return db.article.findUnique({ where: { id } });
}

export type ArticleForAdmin = NonNullable<Awaited<ReturnType<typeof getArticleForAdmin>>>;

export function getDownloadForAdmin(id: string, db: Db = getDb()) {
  return db.resource.findUnique({ where: { id } });
}

export type DownloadForAdmin = NonNullable<Awaited<ReturnType<typeof getDownloadForAdmin>>>;

/** YYYY-MM-DD for a date input. */
export const dateInputValue = (date: Date | null | undefined) =>
  date ? date.toISOString().slice(0, 10) : "";
