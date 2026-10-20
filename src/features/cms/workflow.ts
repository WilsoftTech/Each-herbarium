import { can, type Permission, type Role } from "@/services/permissions";

/**
 * Editorial workflow: Draft → In review → Published → Archived.
 *
 * Pure rules, shared by every content type. Server Actions call these before
 * writing; the admin UI calls them only to decide which buttons to show.
 */
export const contentStatuses = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export const statusLabel: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

type TransitionRule = {
  label: string;
  from: readonly ContentStatus[];
  to: ContentStatus;
  permission: Permission;
};

export const transitions = {
  submit: {
    label: "Submit for review",
    from: ["DRAFT"],
    to: "IN_REVIEW",
    permission: "content:submit",
  },
  approve: {
    label: "Approve and publish",
    from: ["IN_REVIEW"],
    to: "PUBLISHED",
    permission: "content:publish",
  },
  requestChanges: {
    label: "Return to draft",
    from: ["IN_REVIEW"],
    to: "DRAFT",
    permission: "content:publish",
  },
  unpublish: {
    label: "Unpublish",
    from: ["PUBLISHED"],
    to: "DRAFT",
    permission: "content:publish",
  },
  archive: {
    label: "Archive",
    from: ["DRAFT", "PUBLISHED"],
    to: "ARCHIVED",
    permission: "content:publish",
  },
  restore: {
    label: "Restore to draft",
    from: ["ARCHIVED"],
    to: "DRAFT",
    permission: "content:publish",
  },
} as const satisfies Record<string, TransitionRule>;

export type TransitionName = keyof typeof transitions;
export const transitionNames = Object.keys(transitions) as TransitionName[];

export function canTransition(role: Role, from: ContentStatus, name: TransitionName): boolean {
  const rule: TransitionRule = transitions[name];
  return rule.from.includes(from) && can(role, rule.permission);
}

/**
 * Transitions that take published content off the website. They are blocked
 * while the item has a pending revision, which must be published or
 * discarded first, so a revision never outlives the live version it changes.
 */
const leavesPublished: readonly TransitionName[] = ["unpublish", "archive"];

export function blockedByRevision(name: TransitionName): boolean {
  return leavesPublished.includes(name);
}

/** Transitions available to `role` for content currently in `status`, in display order. */
export function availableTransitions(
  role: Role,
  status: ContentStatus,
  hasRevision = false,
): TransitionName[] {
  return transitionNames.filter(
    (name) =>
      canTransition(role, status, name) &&
      !(hasRevision && status === "PUBLISHED" && blockedByRevision(name)),
  );
}

/**
 * Who may save the editor form for content in each state:
 * - Drafts: every role.
 * - Published: every role, but the save becomes a revision; the live page
 *   changes only when a reviewer approves it.
 * - In review: only roles that can publish (they are about to approve it).
 * - Archived: nobody; restore it first.
 */
export function canEdit(role: Role, status: ContentStatus): boolean {
  switch (status) {
    case "DRAFT":
    case "PUBLISHED":
      return can(role, "content:edit-draft");
    case "IN_REVIEW":
      return can(role, "content:edit-in-review");
    case "ARCHIVED":
      return false;
  }
}

// ---------------------------------------------------------------------------
// Revisions: proposed changes to published content (ADR 0011)
// ---------------------------------------------------------------------------

export type RevisionStatus = Extract<ContentStatus, "DRAFT" | "IN_REVIEW">;

type RevisionRule = {
  label: string;
  from: readonly RevisionStatus[];
  /** "APPLIED" writes the changes to the live item; "DISCARDED" deletes them. */
  to: RevisionStatus | "APPLIED" | "DISCARDED";
  permission: Permission;
};

export const revisionTransitions = {
  submitRevision: {
    label: "Submit changes for review",
    from: ["DRAFT"],
    to: "IN_REVIEW",
    permission: "content:submit",
  },
  approveRevision: {
    label: "Approve and publish changes",
    from: ["IN_REVIEW"],
    to: "APPLIED",
    permission: "content:publish",
  },
  returnRevision: {
    label: "Return changes to draft",
    from: ["IN_REVIEW"],
    to: "DRAFT",
    permission: "content:publish",
  },
  discardRevision: {
    label: "Discard changes",
    from: ["DRAFT", "IN_REVIEW"],
    to: "DISCARDED",
    permission: "content:edit-draft",
  },
} as const satisfies Record<string, RevisionRule>;

export type RevisionTransitionName = keyof typeof revisionTransitions;
export const revisionTransitionNames = Object.keys(revisionTransitions) as RevisionTransitionName[];

export function isRevisionTransition(name: string): name is RevisionTransitionName {
  return (revisionTransitionNames as string[]).includes(name);
}

export function canTransitionRevision(
  role: Role,
  from: RevisionStatus,
  name: RevisionTransitionName,
): boolean {
  const rule: RevisionRule = revisionTransitions[name];
  if (!rule.from.includes(from) || !can(role, rule.permission)) return false;
  // Changes waiting for review can be withdrawn only by someone who reviews them.
  if (name === "discardRevision" && from === "IN_REVIEW") return can(role, "content:publish");
  return true;
}

export function availableRevisionTransitions(
  role: Role,
  status: RevisionStatus,
): RevisionTransitionName[] {
  return revisionTransitionNames.filter((name) => canTransitionRevision(role, status, name));
}

/** Who may change a revision's content: the same rule as for drafts and items in review. */
export function canEditRevision(role: Role, status: RevisionStatus): boolean {
  return canEdit(role, status);
}

/** Whether the editor form is enabled for an item and its pending revision, if any. */
export function canEditItem(
  role: Role,
  status: ContentStatus,
  revisionStatus?: RevisionStatus | null,
): boolean {
  return status === "PUBLISHED" && revisionStatus
    ? canEditRevision(role, revisionStatus)
    : canEdit(role, status);
}

/** Only content that is not live can be deleted, and only by roles allowed to delete. */
export function canDelete(role: Role, status: ContentStatus): boolean {
  return (status === "DRAFT" || status === "ARCHIVED") && can(role, "content:delete");
}

/** Whether a status change alters what the public site shows. */
export function affectsPublicSite(from: ContentStatus, to: ContentStatus): boolean {
  return from === "PUBLISHED" || to === "PUBLISHED";
}
