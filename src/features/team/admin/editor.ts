import "server-only";
import { loadForEditing } from "@/features/cms";
import { getTeamMemberForAdmin, teamWorkflow } from "./admin";
import { teamMemberSave } from "./save";

/** The live team member and, if they have pending changes, the form values with them applied. */
export function getTeamMemberEditor(id: string) {
  return loadForEditing(teamWorkflow, teamMemberSave, id, (db) => getTeamMemberForAdmin(id, db));
}
