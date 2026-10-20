import "server-only";
import { loadForEditing, loadPreview } from "@/features/cms";
import { pageSchema } from "../schema";
import { getPageForAdmin, pageWorkflow } from "./admin";
import { pageSave } from "./save";

/** The live page and, if it has pending changes, the form values with them applied. */
export function getPageEditor(id: string) {
  return loadForEditing(pageWorkflow, pageSave, id, (db) => getPageForAdmin(id, db));
}

/** A page mapped to the public contract for the admin preview, pending changes applied. */
export function getPagePreview(id: string) {
  return loadPreview(
    pageWorkflow,
    pageSave,
    id,
    (db) => db.page.findUnique({ where: { id } }),
    (row) => pageSchema.parse({ ...row, status: row.placeholder ? "placeholder" : "published" }),
    "Add a title, a label and a description of at least 30 characters to preview.",
  );
}
