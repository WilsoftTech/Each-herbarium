import { z } from "zod";

/**
 * Roles and permissions for the admin area. This module is the single source
 * of truth: the server enforces it in requireAdmin() and in every action, and
 * the admin UI reads it only to hide controls a user cannot use (hiding is
 * never the security control).
 */
export const roleSchema = z.enum(["admin", "reviewer", "editor"]);
export type Role = z.infer<typeof roleSchema>;

export const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  reviewer: "Reviewer",
  editor: "Editor",
};

const permissions = {
  /** Open the admin area at all. */
  "admin:access": ["admin", "reviewer", "editor"],
  /** Create content and edit it while it is a draft. */
  "content:edit-draft": ["admin", "reviewer", "editor"],
  /** Send a draft for review. */
  "content:submit": ["admin", "reviewer", "editor"],
  /** Edit content that is in review or published (changes go live). */
  "content:edit-live": ["admin", "reviewer"],
  /** Approve, request changes, unpublish, archive and restore. */
  "content:publish": ["admin", "reviewer"],
  /** Permanently delete draft or archived content. */
  "content:delete": ["admin"],
  "media:upload": ["admin", "reviewer", "editor"],
  /** Change alt text, captions and credits (shown on live pages at once). */
  "media:edit": ["admin", "reviewer"],
  "media:delete": ["admin", "reviewer"],
  "settings:edit": ["admin"],
  "users:manage": ["admin"],
  "audit:view": ["admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof permissions;

export function can(role: Role, permission: Permission): boolean {
  return (permissions[permission] as readonly Role[]).includes(role);
}

/** Every permission, for exhaustive tests and documentation. */
export const allPermissions = Object.keys(permissions) as Permission[];
