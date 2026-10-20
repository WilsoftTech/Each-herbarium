"use server";

import { redirect } from "next/navigation";
import { applyDelete, applySave, applyTransition, type ActionState } from "@/features/cms";
import { teamWorkflow } from "./admin";
import { teamMemberSave } from "./save";

export async function saveTeamMember(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(teamWorkflow, form, teamMemberSave);
}

export async function transitionTeamMember(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return applyTransition(teamWorkflow, form, teamMemberSave);
}

export async function deleteTeamMember(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(teamWorkflow, form, () => redirect("/admin/team?deleted=1"));
}
