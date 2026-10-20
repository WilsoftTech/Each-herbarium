import "server-only";
import { ActionError, parseInput, type SaveOperations } from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { partnerInputSchema, readPartnerForm, type PartnerInput } from "./admin";

async function checkLogo(db: Prisma.TransactionClient, input: PartnerInput) {
  const problem = input.logoId ? await assertMedia(db, [input.logoId], "IMAGE") : null;
  if (problem) throw new ActionError("Check the highlighted fields.", { logoId: problem });
}

/** How the partner editor creates and updates rows (also applies approved revisions). */
export const partnerSave: SaveOperations<PartnerInput> = {
  parse: (data) => parseInput(partnerInputSchema, readPartnerForm(data)),
  revive: (data) => parseInput(partnerInputSchema, data),
  async create(db, input, userId) {
    await checkLogo(db, input);
    // Partners are always independent of EACH (AGENTS.md §1); not editable.
    const row = await db.partner.create({
      data: {
        ...input,
        relationship: "independent-partner",
        createdById: userId,
        updatedById: userId,
      },
    });
    return { id: row.id, label: row.name };
  },
  async update(db, id, version, input, userId) {
    await checkLogo(db, input);
    const { count } = await db.partner.updateMany({
      where: { id, version },
      data: { ...input, updatedById: userId, version: { increment: 1 } },
    });
    return count;
  },
  editPath: (id) => `/admin/partners/${id}`,
};
