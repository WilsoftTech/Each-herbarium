import "server-only";
import { z } from "zod";
import { formData, type WorkflowCollection } from "@/features/cms";
import { getDb } from "@/services/db";
import { pageSchema } from "../schema";

/** Managed pages have fixed slugs (each belongs to a route), so only their words change. */
export const pageInputSchema = z.object({
  title: z.string().min(1, "Enter a title.").max(120),
  description: z
    .string()
    .min(30, "Write at least 30 characters: search engines show this description.")
    .max(300),
  eyebrow: z.string().min(1, "Enter a short label, such as Policies.").max(60),
  lead: z.string().max(600),
  body: z.string().min(1, "Enter the page text.").max(50_000),
});

export type PageInput = z.infer<typeof pageInputSchema>;

export function readPageForm(form: FormData) {
  const { text } = formData;
  return {
    title: text(form, "title"),
    description: text(form, "description"),
    eyebrow: text(form, "eyebrow"),
    lead: text(form, "lead"),
    // Keep line structure: the rich-text format depends on it.
    body: (typeof form.get("body") === "string" ? String(form.get("body")) : "").trim(),
  };
}

export const pageWorkflow: WorkflowCollection = {
  collection: "pages",
  label: "Page",
  async find(db, id) {
    const row = await db.page.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, title: true },
    });
    return row && { ...row, label: row.title };
  },
  updateStatus(db, id, version, change) {
    return db.page.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove() {
    // Never called: managed pages are not deletable (no delete action is exposed).
    return Promise.reject(new Error("Managed pages cannot be deleted."));
  },
  async checkPublishable(db, id) {
    const row = await db.page.findUnique({ where: { id } });
    if (!row) return "This page no longer exists.";
    const result = pageSchema.safeParse({
      ...row,
      status: row.placeholder ? "placeholder" : "published",
    });
    return result.success
      ? null
      : "The page needs a title, a label and a description of at least 30 characters.";
  },
};

export function listPagesForAdmin() {
  return getDb().page.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, slug: true, status: true, placeholder: true, updatedAt: true },
    take: 50,
  });
}

export function getPageForAdmin(id: string) {
  return getDb().page.findUnique({ where: { id } });
}

export type PageForAdmin = NonNullable<Awaited<ReturnType<typeof getPageForAdmin>>>;

export async function getPagePreview(id: string) {
  const row = await getDb().page.findUnique({ where: { id } });
  if (!row) return null;
  const result = pageSchema.safeParse({
    ...row,
    status: row.placeholder ? "placeholder" : "published",
  });
  return {
    page: result.success ? result.data : null,
    status: row.status,
    error: result.success
      ? null
      : "Add a title, a label and a description of at least 30 characters to preview.",
  };
}
