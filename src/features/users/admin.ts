import "server-only";
import { randomBytes } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import { authResult, getAuth } from "@/services/auth";
import type { Role } from "@/services/permissions";

/** A random temporary password (22 URL-safe characters, ~128 bits). Shown once to the administrator. */
export function generateTemporaryPassword(): string {
  return randomBytes(16).toString("base64url");
}

type Db = Prisma.TransactionClient;

/**
 * Creates a managed identity and links its ID to CMS staff membership.
 * A failed local write may leave an identity without CMS access (ADR 0010).
 */
export async function createStaffUser(
  db: Db,
  input: { name: string; email: string; role: Role },
  password: string,
): Promise<{ id: string }> {
  const { user } = authResult(
    await getAuth().managed.admin.createUser({
      name: input.name,
      email: input.email,
      password,
      role: input.role === "admin" ? "admin" : "user",
    }),
  );
  const id = user.id;
  await db.user.create({
    data: {
      id,
      name: input.name,
      email: input.email,
      role: input.role,
      emailVerified: true,
      active: true,
    },
  });
  return { id };
}

/** Replaces a user's password and signs them out everywhere. */
export async function setStaffPassword(_db: Db, userId: string, password: string): Promise<void> {
  void _db;
  authResult(await getAuth().managed.admin.setUserPassword({ userId, newPassword: password }));
  authResult(await getAuth().managed.admin.revokeUserSessions({ userId }));
}

export function listUsers() {
  return getDb().user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    take: 200,
  });
}

export function getUser(id: string) {
  return getDb().user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
}

export type StaffUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

/** Active administrators other than `exceptId`; at least one must always remain. */
export function countOtherActiveAdmins(db: Db, exceptId: string): Promise<number> {
  return db.user.count({ where: { role: "admin", active: true, id: { not: exceptId } } });
}
