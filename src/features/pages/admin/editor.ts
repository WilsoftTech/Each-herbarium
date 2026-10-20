import "server-only";
import { loadForEditing, loadPreview } from "@/features/cms";
import { readHomeRow, toHomePage, toPage, type HomeRow } from "../queries";
import { pageEntry } from "../registry";
import type { HomePage, Page } from "../schema";
import { getPageForAdmin, pageWorkflow } from "./admin";
import { pageSave } from "./save";

/** The live page and, if it has pending changes, the form values with them applied. */
export function getPageEditor(id: string) {
  return loadForEditing(pageWorkflow, pageSave, id, (db) => getPageForAdmin(id, db));
}

export type PagePreview =
  { kind: "home"; home: HomePage } | { kind: "landing" | "prose"; page: Page; route: string };

function toPreview(row: HomeRow): PagePreview {
  const entry = pageEntry(row.slug);
  if (!entry) throw new Error("Unknown page");
  return entry.kind === "home"
    ? { kind: "home", home: toHomePage(row) }
    : { kind: entry.kind, page: toPage(row), route: entry.route };
}

/** A page mapped to the public contract for the admin preview, pending changes applied. */
export function getPagePreview(id: string) {
  return loadPreview(
    pageWorkflow,
    pageSave,
    id,
    (db) => readHomeRow(db, { id }),
    toPreview,
    "Fill in the title, label, description (at least 30 characters) and, on the homepage, every section to preview.",
  );
}
