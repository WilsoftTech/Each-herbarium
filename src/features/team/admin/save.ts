import "server-only";
import { ActionError, parseInput, type SaveOperations } from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { readTeamMemberForm, teamMemberInputSchema, type TeamMemberInput } from "./admin";

async function checkPhoto(db: Prisma.TransactionClient, input: TeamMemberInput) {
  const problem = input.photoId ? await assertMedia(db, [input.photoId], "IMAGE") : null;
  if (problem) throw new ActionError("Check the highlighted fields.", { photoId: problem });
}

/** How the team editor creates and updates rows (also applies approved revisions). */
export const teamMemberSave: SaveOperations<TeamMemberInput> = {
  parse: (data) => parseInput(teamMemberInputSchema, readTeamMemberForm(data)),
  revive: (data) => parseInput(teamMemberInputSchema, data),
  async create(db, input, userId) {
    await checkPhoto(db, input);
    const row = await db.teamMember.create({
      data: { ...input, createdById: userId, updatedById: userId },
    });
    return { id: row.id, label: row.name };
  },
  async update(db, id, version, input, userId) {
    await checkPhoto(db, input);
    const { count } = await db.teamMember.updateMany({
      where: { id, version },
      data: { ...input, updatedById: userId, version: { increment: 1 } },
    });
    return count;
  },
  editPath: (id) => `/admin/team/${id}`,
};
