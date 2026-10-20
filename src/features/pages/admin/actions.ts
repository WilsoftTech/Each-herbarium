"use server";

import { applySave, applyTransition, type ActionState } from "@/features/cms";
import { pageWorkflow } from "./admin";
import { pageSave } from "./save";

export async function savePage(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(pageWorkflow, form, pageSave);
}

export async function transitionPage(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyTransition(pageWorkflow, form, pageSave);
}
