import "server-only";
import { loadForEditing } from "@/features/cms";
import { getPartnerForAdmin, partnerWorkflow } from "./admin";
import { partnerSave } from "./save";

/** The live partner and, if it has pending changes, the form values with them applied. */
export function getPartnerEditor(id: string) {
  return loadForEditing(partnerWorkflow, partnerSave, id, (db) => getPartnerForAdmin(id, db));
}
