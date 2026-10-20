import "server-only";
import { loadForEditing, loadPreview } from "@/features/cms";
import { isLandingSlug } from "../landing-content";
import { readPageRow, toHomePage, toLandingPage, toPage, type PageRowWithMedia } from "../queries";
import { pageEntry } from "../registry";
import type { AnyLandingPage, HomePage, Page } from "../schema";
import { getPageForAdmin, pageWorkflow } from "./admin";
import { pageSave } from "./save";

/** The live page and, if it has pending changes, the form values with them applied. */
export function getPageEditor(id: string) {
  return loadForEditing(pageWorkflow, pageSave, id, (db) => getPageForAdmin(id, db));
}

export type PagePreview =
  | { kind: "home"; home: HomePage }
  | { kind: "landing"; landing: AnyLandingPage }
  | { kind: "prose"; page: Page };

function toPreview(row: PageRowWithMedia): PagePreview {
  const entry = pageEntry(row.slug);
  if (!entry) throw new Error("Unknown page");
  if (entry.kind === "home") return { kind: "home", home: toHomePage(row) };
  if (isLandingSlug(row.slug)) {
    return { kind: "landing", landing: toLandingPage(row.slug, row) as AnyLandingPage };
  }
  return { kind: "prose", page: toPage(row) };
}

/** A page mapped to the public contract for the admin preview, pending changes applied. */
export function getPagePreview(id: string) {
  return loadPreview(
    pageWorkflow,
    pageSave,
    id,
    (db) => readPageRow(db, { id }),
    toPreview,
    "Fill in the title, label, description (at least 30 characters) and every section to preview.",
  );
}
