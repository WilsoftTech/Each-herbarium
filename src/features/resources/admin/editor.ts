import "server-only";
import { loadForEditing, loadPreview } from "@/features/cms";
import { articleInclude, toResource } from "../queries";
import {
  articleWorkflow,
  downloadWorkflow,
  getArticleForAdmin,
  getDownloadForAdmin,
} from "./admin";
import { articleSave, downloadSave } from "./save";

/** The live article and, if it has pending changes, the form values with them applied. */
export function getArticleEditor(id: string) {
  return loadForEditing(articleWorkflow, articleSave, id, (db) => getArticleForAdmin(id, db));
}

export function getDownloadEditor(id: string) {
  return loadForEditing(downloadWorkflow, downloadSave, id, (db) => getDownloadForAdmin(id, db));
}

/** An article mapped to the public contract for the admin preview, pending changes applied. */
export function getArticlePreview(id: string) {
  return loadPreview(
    articleWorkflow,
    articleSave,
    id,
    (db) => db.article.findUnique({ where: { id }, include: articleInclude }),
    toResource,
    "This article cannot be previewed until its image has alt text of at least 20 characters and a caption.",
  );
}
