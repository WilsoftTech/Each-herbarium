import "server-only";
import { ActionError, parseInput, type SaveOperations } from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import {
  articleInputSchema,
  downloadInputSchema,
  readArticleForm,
  readDownloadForm,
  type ArticleInput,
  type DownloadInput,
} from "./admin";

const toDate = (value: string | null) => (value ? new Date(`${value}T00:00:00Z`) : null);

async function checkArticleMedia(db: Prisma.TransactionClient, input: ArticleInput) {
  const errors: Record<string, string> = {};
  const image = input.imageId ? await assertMedia(db, [input.imageId], "IMAGE") : null;
  if (image) errors.imageId = image;
  const document = input.documentId ? await assertMedia(db, [input.documentId], "DOCUMENT") : null;
  if (document) errors.documentId = document;
  if (Object.keys(errors).length) throw new ActionError("Check the highlighted fields.", errors);
}

async function checkDownloadMedia(db: Prisma.TransactionClient, input: DownloadInput) {
  const problem = await assertMedia(db, [input.documentId], "DOCUMENT");
  if (problem) throw new ActionError("Check the highlighted fields.", { documentId: problem });
}

/** How the article editor creates and updates rows (also applies approved revisions). */
export const articleSave: SaveOperations<ArticleInput> = {
  parse: (data) => parseInput(articleInputSchema, readArticleForm(data)),
  revive: (data) => parseInput(articleInputSchema, data),
  async create(db, input, userId) {
    await checkArticleMedia(db, input);
    const row = await db.article.create({
      data: {
        ...input,
        publishedOn: toDate(input.publishedOn),
        createdById: userId,
        updatedById: userId,
      },
    });
    return { id: row.id, label: row.title };
  },
  async update(db, id, version, input, userId) {
    await checkArticleMedia(db, input);
    const { count } = await db.article.updateMany({
      where: { id, version },
      data: {
        ...input,
        publishedOn: toDate(input.publishedOn),
        updatedById: userId,
        version: { increment: 1 },
      },
    });
    return count;
  },
  editPath: (id) => `/admin/articles/${id}`,
};

/** How the resource (download) editor creates and updates rows. */
export const downloadSave: SaveOperations<DownloadInput> = {
  parse: (data) => parseInput(downloadInputSchema, readDownloadForm(data)),
  revive: (data) => parseInput(downloadInputSchema, data),
  async create(db, input, userId) {
    await checkDownloadMedia(db, input);
    const row = await db.resource.create({
      data: {
        ...input,
        publishedOn: toDate(input.publishedOn),
        createdById: userId,
        updatedById: userId,
      },
    });
    return { id: row.id, label: row.title };
  },
  async update(db, id, version, input, userId) {
    await checkDownloadMedia(db, input);
    const { count } = await db.resource.updateMany({
      where: { id, version },
      data: {
        ...input,
        publishedOn: toDate(input.publishedOn),
        updatedById: userId,
        version: { increment: 1 },
      },
    });
    return count;
  },
  editPath: (id) => `/admin/resources/${id}`,
};
