import { describe, expect, it } from "vitest";
import {
  affectsPublicSite,
  availableRevisionTransitions,
  availableTransitions,
  canDelete,
  canEdit,
  canEditItem,
  canTransition,
  canTransitionRevision,
  contentStatuses,
} from "@/features/cms/workflow";

describe("editorial workflow", () => {
  it("follows Draft → Review → Published → Archived", () => {
    expect(availableTransitions("admin", "DRAFT")).toEqual(["submit", "archive"]);
    expect(availableTransitions("admin", "IN_REVIEW")).toEqual(["approve", "requestChanges"]);
    expect(availableTransitions("admin", "PUBLISHED")).toEqual(["unpublish", "archive"]);
    expect(availableTransitions("admin", "ARCHIVED")).toEqual(["restore"]);
  });

  it("never publishes without review: approve only from In review", () => {
    for (const role of ["admin", "reviewer", "editor"] as const) {
      expect(canTransition(role, "DRAFT", "approve")).toBe(false);
      expect(canTransition(role, "ARCHIVED", "approve")).toBe(false);
      expect(canTransition(role, "PUBLISHED", "approve")).toBe(false);
    }
  });

  it("lets editors only submit drafts", () => {
    expect(availableTransitions("editor", "DRAFT")).toEqual(["submit"]);
    for (const status of ["IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const) {
      expect(availableTransitions("editor", status)).toEqual([]);
    }
  });

  it("lets reviewers approve, return, unpublish, archive and restore", () => {
    expect(canTransition("reviewer", "IN_REVIEW", "approve")).toBe(true);
    expect(canTransition("reviewer", "IN_REVIEW", "requestChanges")).toBe(true);
    expect(canTransition("reviewer", "PUBLISHED", "unpublish")).toBe(true);
    expect(canTransition("reviewer", "PUBLISHED", "archive")).toBe(true);
    expect(canTransition("reviewer", "ARCHIVED", "restore")).toBe(true);
  });

  it("locks content in review to roles that can publish", () => {
    expect(canEdit("editor", "DRAFT")).toBe(true);
    expect(canEdit("editor", "IN_REVIEW")).toBe(false);
    expect(canEdit("reviewer", "IN_REVIEW")).toBe(true);
    for (const role of ["admin", "reviewer", "editor"] as const) {
      expect(canEdit(role, "ARCHIVED")).toBe(false);
    }
  });

  it("deletes only drafts and archived items, and only as an administrator", () => {
    expect(contentStatuses.filter((status) => canDelete("admin", status))).toEqual([
      "DRAFT",
      "ARCHIVED",
    ]);
    for (const status of contentStatuses) {
      expect(canDelete("reviewer", status)).toBe(false);
      expect(canDelete("editor", status)).toBe(false);
    }
  });

  it("knows which changes alter the public site", () => {
    expect(affectsPublicSite("IN_REVIEW", "PUBLISHED")).toBe(true);
    expect(affectsPublicSite("PUBLISHED", "DRAFT")).toBe(true);
    expect(affectsPublicSite("PUBLISHED", "ARCHIVED")).toBe(true);
    expect(affectsPublicSite("DRAFT", "IN_REVIEW")).toBe(false);
    expect(affectsPublicSite("ARCHIVED", "DRAFT")).toBe(false);
  });

  it("lets every role propose changes to published content (saved as a revision)", () => {
    for (const role of ["admin", "reviewer", "editor"] as const) {
      expect(canEdit(role, "PUBLISHED")).toBe(true);
    }
  });

  it("hides unpublish and archive while a revision is pending", () => {
    expect(availableTransitions("admin", "PUBLISHED", true)).toEqual([]);
    expect(availableTransitions("admin", "PUBLISHED", false)).toEqual(["unpublish", "archive"]);
    // A pending revision only exists for published items; other states are unaffected.
    expect(availableTransitions("admin", "DRAFT", true)).toEqual(["submit", "archive"]);
  });
});

describe("revision workflow", () => {
  it("lets editors submit and discard their draft changes, nothing more", () => {
    expect(availableRevisionTransitions("editor", "DRAFT")).toEqual([
      "submitRevision",
      "discardRevision",
    ]);
    expect(availableRevisionTransitions("editor", "IN_REVIEW")).toEqual([]);
  });

  it("lets reviewers approve, return or discard changes in review", () => {
    expect(availableRevisionTransitions("reviewer", "IN_REVIEW")).toEqual([
      "approveRevision",
      "returnRevision",
      "discardRevision",
    ]);
  });

  it("never applies changes without review: approve only from In review", () => {
    for (const role of ["admin", "reviewer", "editor"] as const) {
      expect(canTransitionRevision(role, "DRAFT", "approveRevision")).toBe(false);
    }
    expect(canTransitionRevision("editor", "IN_REVIEW", "approveRevision")).toBe(false);
  });

  it("locks changes in review to roles that can publish", () => {
    expect(canEditItem("editor", "PUBLISHED", "DRAFT")).toBe(true);
    expect(canEditItem("editor", "PUBLISHED", "IN_REVIEW")).toBe(false);
    expect(canEditItem("reviewer", "PUBLISHED", "IN_REVIEW")).toBe(true);
    expect(canEditItem("editor", "PUBLISHED", null)).toBe(true);
  });
});
