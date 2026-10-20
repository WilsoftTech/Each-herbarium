"use server";

import { redirect } from "next/navigation";
import { applyDelete, applySave, applyTransition, type ActionState } from "@/features/cms";
import { partnerWorkflow } from "./admin";
import { partnerSave } from "./save";

export async function savePartner(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(partnerWorkflow, form, partnerSave);
}

export async function transitionPartner(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyTransition(partnerWorkflow, form, partnerSave);
}

export async function deletePartner(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(partnerWorkflow, form, () => redirect("/admin/partners?deleted=1"));
}
