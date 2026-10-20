import "server-only";
import { loadForEditing } from "@/features/cms";
import { getProgrammeForAdmin, programmeWorkflow } from "./admin";
import { programmeSave } from "./save";

/** The live programme and, if it has pending changes, the form values with them applied. */
export function getProgrammeEditor(id: string) {
  return loadForEditing(programmeWorkflow, programmeSave, id, (db) => getProgrammeForAdmin(id, db));
}
