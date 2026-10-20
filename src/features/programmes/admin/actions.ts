"use server";

import { redirect } from "next/navigation";
import { applyDelete, applySave, applyTransition, type ActionState } from "@/features/cms";
import { programmeWorkflow } from "./admin";
import { programmeSave } from "./save";

export async function saveProgramme(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(programmeWorkflow, form, programmeSave);
}

export async function transitionProgramme(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return applyTransition(programmeWorkflow, form, programmeSave);
}

export async function deleteProgramme(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(programmeWorkflow, form, () => redirect("/admin/programmes?deleted=1"));
}
