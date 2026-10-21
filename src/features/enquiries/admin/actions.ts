"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { ActionError, formData, parseInput, runAction, type ActionState } from "@/features/cms";
import { authorize, requireAdmin } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { getDb, transactionOptions } from "@/services/db";
import { deliverEnquiry } from "../delivery";

const { text } = formData;

const statusInput = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"], { error: "Choose a status." }),
});

const statusLabel = { NEW: "new", IN_PROGRESS: "in progress", CLOSED: "closed" } as const;

/** Marks an enquiry new, in progress or closed. Audited. */
export async function updateEnquiryStatus(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "enquiries:manage");
    const input = parseInput(statusInput, { id: text(form, "id"), status: text(form, "status") });

    await getDb().$transaction(async (tx) => {
      await tx.inquiry.update({ where: { id: input.id }, data: { status: input.status } });
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: "enquiry.status",
        entityType: "enquiry",
        entityId: input.id,
        summary: `Marked an enquiry ${statusLabel[input.status]}`,
      });
    }, transactionOptions);

    refresh();
    return { ok: true, message: "Status saved." };
  });
}

/** Sends any email for the enquiry that has not been sent yet. Audited. */
export async function retryEnquiryDelivery(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "enquiries:manage");
    const id = text(form, "id");
    const db = getDb();
    const enquiry = await db.inquiry.findUnique({ where: { id }, select: { id: true } });
    if (!enquiry) throw new ActionError("This enquiry no longer exists.");

    await deliverEnquiry(id);
    const after = await db.inquiry.findUniqueOrThrow({
      where: { id },
      select: { notificationStatus: true, acknowledgementStatus: true },
    });
    await recordAudit(db, {
      actorId: session.userId,
      actorEmail: session.email,
      action: "enquiry.retry-email",
      entityType: "enquiry",
      entityId: id,
      summary: "Retried enquiry emails",
      metadata: after,
    });

    refresh();
    const sent = after.notificationStatus === "SENT" && after.acknowledgementStatus === "SENT";
    if (sent) return { ok: true, message: "Emails sent." };
    return {
      ok: false,
      message:
        after.notificationStatus === "NOT_CONFIGURED"
          ? "Email is not configured for this website. The enquiry is stored and can be answered directly."
          : "Some emails could not be sent. The error is shown below.",
    };
  });
}
