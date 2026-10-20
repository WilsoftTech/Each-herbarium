import { describe, expect, it } from "vitest";
import {
  allPermissions,
  can,
  roleSchema,
  type Permission,
  type Role,
} from "@/services/permissions";

// The intended matrix, written out independently of the implementation.
const expected: Record<Role, Permission[]> = {
  admin: [...allPermissions],
  reviewer: [
    "admin:access",
    "content:edit-draft",
    "content:submit",
    "content:edit-in-review",
    "content:publish",
    "media:upload",
    "media:edit",
    "media:delete",
  ],
  editor: ["admin:access", "content:edit-draft", "content:submit", "media:upload"],
};

describe("role permissions", () => {
  it.each(roleSchema.options)("%s has exactly the intended permissions", (role) => {
    const granted = allPermissions.filter((permission) => can(role, permission));
    expect(granted.sort()).toEqual([...expected[role]].sort());
  });

  it("only administrators manage users, settings and the audit log", () => {
    for (const permission of [
      "users:manage",
      "settings:edit",
      "audit:view",
      "content:delete",
    ] as const) {
      expect(roleSchema.options.filter((role) => can(role, permission))).toEqual(["admin"]);
    }
  });

  it("editors cannot publish, or change content waiting for review", () => {
    expect(can("editor", "content:publish")).toBe(false);
    expect(can("editor", "content:edit-in-review")).toBe(false);
    expect(can("editor", "media:edit")).toBe(false);
    expect(can("editor", "media:delete")).toBe(false);
  });

  it("rejects unknown roles", () => {
    expect(roleSchema.safeParse("superuser").success).toBe(false);
    expect(roleSchema.safeParse("").success).toBe(false);
  });
});
