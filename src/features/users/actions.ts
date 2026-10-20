"use server";

import { z } from "zod";
import { ActionError, formData, parseInput, runAction, type ActionState } from "@/features/cms";
import { Prisma } from "@/generated/prisma/client";
import { authorize, requireAdmin, type AdminSession } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { authResult, getAuth } from "@/services/auth";
import { getDb, transactionOptions } from "@/services/db";
import { roleSchema } from "@/services/permissions";
import { checkRateLimit, rateLimits } from "@/services/rate-limit";
import {
  countOtherActiveAdmins,
  createStaffUser,
  generateTemporaryPassword,
  setStaffPassword,
} from "./admin";

const newUserSchema = z.object({
  name: z.string().min(1, "Enter their name.").max(200),
  email: z.email("Enter a valid email address.").max(254),
  role: roleSchema,
});

async function authorizeUserManagement(): Promise<AdminSession> {
  const session = await requireAdmin();
  authorize(session, "users:manage");
  const limit = await checkRateLimit(rateLimits.userManagement, session.userId);
  if (!limit.allowed) throw new ActionError("Too many changes in a short time. Try again shortly.");
  return session;
}

/** Creates an account with a one-time temporary password, shown to the administrator once. */
export async function createUser(_state: ActionState, form: FormData): Promise<ActionState> {
  return runAction(async () => {
    const session = await authorizeUserManagement();
    const input = parseInput(newUserSchema, {
      name: formData.text(form, "name"),
      email: formData.text(form, "email").toLowerCase(),
      role: formData.text(form, "role"),
    });
    const password = generateTemporaryPassword();

    if (await getDb().user.findUnique({ where: { email: input.email }, select: { id: true } })) {
      throw new ActionError("Check the highlighted fields.", {
        email: "An account with this email already exists.",
      });
    }

    try {
      await getDb().$transaction(async (tx) => {
        const user = await createStaffUser(tx, input, password);
        await recordAudit(tx, {
          actorId: session.userId,
          actorEmail: session.email,
          action: "user.create",
          entityType: "user",
          entityId: user.id,
          summary: `Created ${input.role} account for ${input.email}`,
        });
      }, transactionOptions);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ActionError("Check the highlighted fields.", {
          email: "An account with this email already exists.",
        });
      }
      throw error;
    }

    return {
      ok: true,
      message: `Account created. Temporary password (shown only now): ${password} — give it to ${input.name} securely; they should change it after signing in.`,
    };
  });
}

/** Changes role or active state. Signs the user out so the change applies at once. */
export async function updateUser(_state: ActionState, form: FormData): Promise<ActionState> {
  return runAction(async () => {
    const session = await authorizeUserManagement();
    const id = formData.text(form, "id");
    const role = roleSchema.safeParse(formData.text(form, "role"));
    if (!role.success) throw new ActionError("Choose a role.", { role: "Choose a role." });
    const active = formData.checkbox(form, "active");

    if (id === session.userId && (role.data !== session.role || !active)) {
      throw new ActionError(
        "You cannot change your own role or deactivate yourself. Ask another administrator.",
      );
    }

    await getDb().$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id } });
      if (!user) throw new ActionError("This account no longer exists.");
      const losesAdmin = user.role === "admin" && user.active && (role.data !== "admin" || !active);
      if (losesAdmin && (await countOtherActiveAdmins(tx, id)) === 0) {
        throw new ActionError("At least one active administrator must remain.");
      }
      await tx.user.update({ where: { id }, data: { role: role.data, active } });
      authResult(
        await getAuth().managed.admin.setRole({
          userId: id,
          role: role.data === "admin" && active ? "admin" : "user",
        }),
      );
      authResult(await getAuth().managed.admin.revokeUserSessions({ userId: id }));
      await tx.session.deleteMany({ where: { userId: id } });
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: "user.update",
        entityType: "user",
        entityId: id,
        summary: `Set ${user.email} to ${role.data}${active ? "" : " (deactivated)"}`,
        metadata: {
          from: { role: user.role, active: user.active },
          to: { role: role.data, active },
        },
      });
    }, transactionOptions);

    return { ok: true, message: "Saved. The user has been signed out so the change applies now." };
  });
}

/** Issues a new temporary password and signs the user out everywhere. */
export async function resetUserPassword(_state: ActionState, form: FormData): Promise<ActionState> {
  return runAction(async () => {
    const session = await authorizeUserManagement();
    const id = formData.text(form, "id");
    if (id === session.userId) {
      throw new ActionError("Change your own password from Your account.");
    }
    const password = generateTemporaryPassword();

    await getDb().$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id }, select: { email: true } });
      if (!user) throw new ActionError("This account no longer exists.");
      await setStaffPassword(tx, id, password);
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: "user.password-reset",
        entityType: "user",
        entityId: id,
        summary: `Reset the password of ${user.email}`,
      });
    }, transactionOptions);

    return {
      ok: true,
      message: `New temporary password (shown only now): ${password} — give it to the user securely.`,
    };
  });
}
