import { vi } from "vitest";
import { randomUUID } from "node:crypto";
import type { Role } from "@/services/permissions";

/**
 * Stand-in for the Better Auth instance (`@/services/auth`), installed by
 * tests/unit/setup.ts. Tests choose who is "signed in"; everything else
 * (requireAdmin, permissions, actions, the database) is the real code.
 */
type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role | string;
  active: boolean;
};

let current: SessionUser | null = null;

export function actAs(user: SessionUser | null): void {
  current = user;
}

export const authApi = {
  getSession: vi.fn(async () =>
    current ? { session: { id: "test-session", userId: current.id }, user: { ...current } } : null,
  ),
  signInEmail: vi.fn(async () => ({})),
  signOut: vi.fn(async () => ({})),
  changePassword: vi.fn(async () => ({})),
};

export function getAuth() {
  return { api: authApi, managed: { admin: managedAdmin } };
}

export const managedAdmin = {
  createUser: vi.fn(async () => ({ data: { user: { id: randomUUID() } }, error: null })),
  setRole: vi.fn(async () => ({ data: { success: true }, error: null })),
  setUserPassword: vi.fn(async () => ({ data: { success: true }, error: null })),
  revokeUserSessions: vi.fn(async () => ({ data: { success: true }, error: null })),
};

export function authResult<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw new Error("Managed Auth failed");
  return result.data;
}

export const SESSION_TTL_SECONDS = 60 * 60 * 8;
