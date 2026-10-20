"use server";

import { redirect } from "next/navigation";
import { applyDelete, applySave, applyTransition, type ActionState } from "@/features/cms";
import { projectSave } from "./save";
import { projectWorkflow } from "./workflow";

export async function saveProject(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(projectWorkflow, form, projectSave);
}

export async function transitionProject(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyTransition(projectWorkflow, form, projectSave);
}

export async function deleteProject(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(projectWorkflow, form, () => redirect("/admin/projects?deleted=1"));
}
