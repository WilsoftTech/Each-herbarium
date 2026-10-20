import "server-only";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";

/** A client or an open transaction, so audit rows commit with the change they describe. */
type AuditWriter = Pick<PrismaClient, "auditEvent"> | Prisma.TransactionClient;

export type AuditInput = {
  actorId: string | null;
  actorEmail?: string | null;
  /** `<entity>.<verb>`, e.g. "project.approve". */
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  /** Small, non-sensitive context (never passwords, tokens or file contents). */
  metadata?: Prisma.InputJsonValue;
};

/** Appends an audit event. The table rejects updates and deletes (migration trigger). */
export async function recordAudit(writer: AuditWriter, input: AuditInput): Promise<void> {
  await writer.auditEvent.create({
    data: {
      actorId: input.actorId,
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary: input.summary.slice(0, 500),
      metadata: input.metadata,
    },
  });
}
