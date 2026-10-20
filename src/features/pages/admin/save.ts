import "server-only";
import { ActionError, parseInput, type SaveOperations } from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { homeImageIds } from "../home-content";
import { pageEntry } from "../registry";
import { pageInputSchema, parseHomeContent, readPageForm, type PageInput } from "./admin";

/**
 * Checks the fields that depend on the kind of page (page registry) and
 * returns the values to store: prose pages keep their body, the homepage its
 * validated sections, landing pages neither.
 */
async function prepare(db: Prisma.TransactionClient, slug: string, input: PageInput) {
  const entry = pageEntry(slug);
  if (!entry) throw new ActionError("This page has no route on the website.");
  const errors: Record<string, string> = {};

  const image = input.heroImageId ? await assertMedia(db, [input.heroImageId], "IMAGE") : null;
  if (image) errors.heroImageId = image;

  let content: Prisma.InputJsonValue = {};
  if (entry.kind === "prose" && !input.body.trim()) errors.body = "Enter the page text.";
  if ("imageRequired" in entry && !input.heroImageId) {
    errors.heroImageId = "This page opens with a full-width photograph. Choose one.";
  }
  if (entry.kind === "home") {
    const parsed = parseHomeContent(input.content);
    if (parsed.errors) {
      Object.assign(errors, parsed.errors);
    } else {
      const missing = await assertMedia(db, homeImageIds(parsed.content), "IMAGE");
      if (missing) errors["content.heritage.imageId"] ??= missing;
      content = parsed.content;
    }
  }
  if (Object.keys(errors).length) throw new ActionError("Check the highlighted fields.", errors);

  return {
    title: input.title,
    description: input.description,
    eyebrow: input.eyebrow,
    lead: input.lead,
    body: entry.kind === "prose" ? input.body : "",
    heroImageId: input.heroImageId,
    seoTitle: input.seoTitle,
    noindex: input.noindex,
    content,
  };
}

/** How the page editor updates rows (also applies approved revisions). */
export const pageSave: SaveOperations<PageInput> = {
  parse: (data) => parseInput(pageInputSchema, readPageForm(data)),
  revive: (data) => parseInput(pageInputSchema, data),
  create() {
    // Managed pages belong to fixed routes; they are created by the seed only.
    throw new ActionError("Pages cannot be created here.");
  },
  async update(db, id, version, input, userId) {
    const current = await db.page.findUnique({ where: { id }, select: { slug: true } });
    if (!current) return 0;
    const data = await prepare(db, current.slug, input);
    const { count } = await db.page.updateMany({
      where: { id, version },
      data: { ...data, updatedById: userId, version: { increment: 1 } },
    });
    return count;
  },
  editPath: (id) => `/admin/pages/${id}`,
};
