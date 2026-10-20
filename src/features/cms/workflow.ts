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

/** Transitions available to `role` for content currently in `status`, in display order. */
export function availableTransitions(role: Role, status: ContentStatus): TransitionName[] {
  return transitionNames.filter((name) => canTransition(role, status, name));
}

/**
 * Drafts are editable by every role. Content in review or published is
 * editable only by roles that can publish, because their changes go live.
 * Archived content must be restored before it is edited.
 */
export function canEdit(role: Role, status: ContentStatus): boolean {
  switch (status) {
    case "DRAFT":
      return can(role, "content:edit-draft");
    case "IN_REVIEW":
    case "PUBLISHED":
      return can(role, "content:edit-live");
    case "ARCHIVED":
      return false;
  }
}

/** Only content that is not live can be deleted, and only by roles allowed to delete. */
export function canDelete(role: Role, status: ContentStatus): boolean {
  return (status === "DRAFT" || status === "ARCHIVED") && can(role, "content:delete");
}

/** Whether a status change alters what the public site shows. */
export function affectsPublicSite(from: ContentStatus, to: ContentStatus): boolean {
  return from === "PUBLISHED" || to === "PUBLISHED";
}
