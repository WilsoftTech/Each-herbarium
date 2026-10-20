"use server";

import {
  ActionError,
  applySave,
  applyTransition,
  parseInput,
  type ActionState,
} from "@/features/cms";
import { pageInputSchema, pageWorkflow, readPageForm } from "./admin";

export async function savePage(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(pageWorkflow, form, {
    parse: (data) => parseInput(pageInputSchema, readPageForm(data)),
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
  });
}

export async function transitionPage(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyTransition(pageWorkflow, form);
}
