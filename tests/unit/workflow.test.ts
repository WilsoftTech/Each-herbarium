import { describe, expect, it } from "vitest";
import {
  affectsPublicSite,
  availableTransitions,
  canDelete,
  canEdit,
  canTransition,
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

  it("locks content in review or published to roles that can publish", () => {
    expect(canEdit("editor", "DRAFT")).toBe(true);
    expect(canEdit("editor", "IN_REVIEW")).toBe(false);
    expect(canEdit("editor", "PUBLISHED")).toBe(false);
    expect(canEdit("reviewer", "PUBLISHED")).toBe(true);
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
});
