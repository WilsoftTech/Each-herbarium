"use server";

import { redirect } from "next/navigation";
import {
  ActionError,
  applyDelete,
  applySave,
  applyTransition,
  parseInput,
  type ActionState,
} from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import {
  readTeamMemberForm,
  teamMemberInputSchema,
  teamWorkflow,
  type TeamMemberInput,
} from "./admin";

async function checkPhoto(db: Prisma.TransactionClient, input: TeamMemberInput) {
  const problem = input.photoId ? await assertMedia(db, [input.photoId], "IMAGE") : null;
  if (problem) throw new ActionError("Check the highlighted fields.", { photoId: problem });
}

export async function saveTeamMember(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(teamWorkflow, form, {
    parse: (data) => parseInput(teamMemberInputSchema, readTeamMemberForm(data)),
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
  });
}

export async function transitionTeamMember(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return applyTransition(teamWorkflow, form);
}

export async function deleteTeamMember(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(teamWorkflow, form, () => redirect("/admin/team?deleted=1"));
}
