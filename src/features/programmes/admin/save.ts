import "server-only";
import { ActionError, parseInput, type SaveOperations } from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { bespokeProgrammeSlugs } from "../schema";
import { programmeInputSchema, readProgrammeForm, type ProgrammeInput } from "./admin";

async function checkImage(db: Prisma.TransactionClient, input: ProgrammeInput) {
  const problem = await assertMedia(db, [input.imageId], "IMAGE");
  if (problem) throw new ActionError("Check the highlighted fields.", { imageId: problem });
}

/** How the programme editor creates and updates rows (also applies approved revisions). */
export const programmeSave: SaveOperations<ProgrammeInput> = {
  parse: (data) => parseInput(programmeInputSchema, readProgrammeForm(data)),
  revive: (data) => parseInput(programmeInputSchema, data),
  async create(db, input, userId) {
    await checkImage(db, input);
    const row = await db.programme.create({
      data: { ...input, createdById: userId, updatedById: userId },
    });
    return { id: row.id, label: row.title };
  },
  async update(db, id, version, input, userId) {
    await checkImage(db, input);
    // The founding programmes have designed pages at fixed addresses.
    const current = await db.programme.findUnique({ where: { id }, select: { slug: true } });
    const fixed = (bespokeProgrammeSlugs as readonly string[]).includes(current?.slug ?? "");
    if (fixed && current?.slug !== input.slug) {
      throw new ActionError("Check the highlighted fields.", {
        slug: "This programme has its own designed page, so its slug cannot change.",
      });
    }
    const { count } = await db.programme.updateMany({
      where: { id, version },
      data: { ...input, updatedById: userId, version: { increment: 1 } },
    });
    return count;
  },
  editPath: (id) => `/admin/programmes/${id}`,
};
