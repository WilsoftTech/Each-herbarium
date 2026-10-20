"use server";

import { redirect } from "next/navigation";
import {
  applyDelete,
  applySave,
  applyTransition,
  parseInput,
  type ActionState,
} from "@/features/cms";
import { partnerInputSchema, partnerWorkflow, readPartnerForm } from "./admin";

export async function savePartner(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(partnerWorkflow, form, {
    parse: (data) => parseInput(partnerInputSchema, readPartnerForm(data)),
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
  });
}

export async function transitionPartner(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyTransition(partnerWorkflow, form);
}

export async function deletePartner(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(partnerWorkflow, form, () => redirect("/admin/partners?deleted=1"));
}
