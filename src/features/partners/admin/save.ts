import "server-only";
import { parseInput, type SaveOperations } from "@/features/cms";
import { partnerInputSchema, readPartnerForm, type PartnerInput } from "./admin";

/** How the partner editor creates and updates rows (also applies approved revisions). */
export const partnerSave: SaveOperations<PartnerInput> = {
  parse: (data) => parseInput(partnerInputSchema, readPartnerForm(data)),
  revive: (data) => parseInput(partnerInputSchema, data),
  async create(db, input, userId) {
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
    const { count } = await db.partner.updateMany({
      where: { id, version },
      data: { ...input, updatedById: userId, version: { increment: 1 } },
    });
    return count;
  },
  editPath: (id) => `/admin/partners/${id}`,
};
