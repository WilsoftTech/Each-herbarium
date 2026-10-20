import "server-only";
import { ActionError, parseInput, type SaveOperations } from "@/features/cms";
import { pageInputSchema, readPageForm, type PageInput } from "./admin";

/** How the page editor updates rows (also applies approved revisions). */
export const pageSave: SaveOperations<PageInput> = {
  parse: (data) => parseInput(pageInputSchema, readPageForm(data)),
  revive: (data) => parseInput(pageInputSchema, data),
  create() {
    // Managed pages belong to fixed routes; they are created by the seed only.
    throw new ActionError("Pages cannot be created here.");
  },
  async update(db, id, version, input, userId) {
    const { count } = await db.page.updateMany({
      where: { id, version },
      data: { ...input, updatedById: userId, version: { increment: 1 } },
    });
    return count;
  },
  editPath: (id) => `/admin/pages/${id}`,
};
