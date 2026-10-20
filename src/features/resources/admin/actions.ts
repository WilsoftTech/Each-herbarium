"use server";

import { redirect } from "next/navigation";
import { applyDelete, applySave, applyTransition, type ActionState } from "@/features/cms";
import { articleWorkflow, downloadWorkflow } from "./admin";
import { articleSave, downloadSave } from "./save";

export async function saveArticle(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(articleWorkflow, form, articleSave);
}

export async function transitionArticle(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyTransition(articleWorkflow, form, articleSave);
}

export async function deleteArticle(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(articleWorkflow, form, () => redirect("/admin/articles?deleted=1"));
}

export async function saveDownload(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(downloadWorkflow, form, downloadSave);
}

export async function transitionDownload(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return applyTransition(downloadWorkflow, form, downloadSave);
}

export async function deleteDownload(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(downloadWorkflow, form, () => redirect("/admin/resources?deleted=1"));
}
