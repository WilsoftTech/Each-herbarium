import "server-only";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { PrismaClient, Prisma } from "@/generated/prisma/client";
import { contentTags, type ContentCollection } from "@/lib/cache-tags";
import { authorize, requireAdmin, type AdminSession } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { getDb, transactionOptions } from "@/services/db";
import type { ActionState } from "./action-state";
import { checkbox, text } from "./form-data";
import { ActionError, ConflictError, runAction } from "./run-action";
import {
  affectsPublicSite,
  canDelete,
  canEdit,
  canTransition,
  transitionNames,
  transitions,
  type ContentStatus,
  type TransitionName,
} from "./workflow";

type Db = PrismaClient | Prisma.TransactionClient;

export type WorkflowRow = {
  id: string;
  slug: string;
  status: ContentStatus;
  version: number;
  /** Title or name, for audit summaries. */
  label: string;
};

export type StatusChange = {
  status: ContentStatus;
  publishedAt?: Date | null;
  updatedById: string;
};

/**
 * What the shared workflow needs from one content type. Each feature defines
 * its own adapter, so this module never imports content features.
 */
export type WorkflowCollection = {
  collection: ContentCollection;
  /** Singular, for messages: "Project". */
  label: string;
  find(db: Db, id: string): Promise<WorkflowRow | null>;
  /** Must update only when `version` matches, and increment it. */
  updateStatus(
    db: Db,
    id: string,
    version: number,
    change: StatusChange,
  ): Promise<{ count: number }>;
  remove(db: Db, id: string): Promise<unknown>;
  /**
   * Returns a reason the item cannot be published yet (missing consent, image
   * not ready, data breaking the public contract), or null.
   */
  checkPublishable(db: Db, id: string): Promise<string | null>;
  /** Extra cache tags expired with this collection's own tag. */
  relatedTags?: readonly string[];
};

/** Expires the public cache entries that show this collection. */
export function expireCollection(collection: WorkflowCollection): void {
  updateTag(contentTags[collection.collection]);
  for (const tag of collection.relatedTags ?? []) updateTag(tag);
}

/** Reads the id and expected version every workflow form posts. */
export function readTarget(form: FormData): { id: string; version: number } {
  const id = text(form, "id");
  const version = Number(text(form, "version"));
  if (!id || !Number.isInteger(version) || version < 1) throw new ActionError("Invalid request.");
  return { id, version };
}

function isTransitionName(value: string): value is TransitionName {
  return (transitionNames as string[]).includes(value);
}

/** Applies a workflow transition. Shared body of every `transition<Type>` Server Action. */
export async function applyTransition(
  collection: WorkflowCollection,
  form: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    const { id, version } = readTarget(form);
    const name = text(form, "transition");
    if (!isTransitionName(name)) throw new ActionError("Unknown action.");
    const rule = transitions[name];
    authorize(session, rule.permission);

    const db = getDb();
    const result = await db.$transaction(async (tx) => {
      const row = await collection.find(tx, id);
      if (!row) throw new ActionError(`This ${collection.label.toLowerCase()} no longer exists.`);
      if (row.version !== version) throw new ConflictError();
      if (!canTransition(session.role, row.status, name)) {
        throw new ActionError(`A ${statusWord(row.status)} item cannot be changed that way.`);
      }
      if (rule.to === "PUBLISHED") {
        const problem = await collection.checkPublishable(tx, id);
        if (problem) throw new ActionError(problem);
      }

      const change: StatusChange = { status: rule.to, updatedById: session.userId };
      if (rule.to === "PUBLISHED") change.publishedAt = new Date();
      if (row.status === "PUBLISHED" && rule.to !== "PUBLISHED") change.publishedAt = null;

      const { count } = await collection.updateStatus(tx, id, version, change);
      if (count !== 1) throw new ConflictError();

      await audit(tx, session, collection, row, `${name}`, `${rule.label}: ${row.label}`, {
        from: row.status,
        to: rule.to,
      });
      return { from: row.status, to: rule.to };
    }, transactionOptions);

    if (affectsPublicSite(result.from, result.to)) expireCollection(collection);
    return { ok: true, message: `${rule.label}: done.` };
  });
}

/** Permanently deletes a draft or archived item. Shared body of every `delete<Type>` action. */
export async function applyDelete(
  collection: WorkflowCollection,
  form: FormData,
  afterDelete: () => never,
): Promise<ActionState> {
  const state = await runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "content:delete");
    const { id, version } = readTarget(form);
    if (!checkbox(form, "confirm")) {
      throw new ActionError("Confirm that you want to delete this item.", {
        confirm: "Tick this box to confirm.",
      });
    }

    await getDb().$transaction(async (tx) => {
      const row = await collection.find(tx, id);
      if (!row) throw new ActionError(`This ${collection.label.toLowerCase()} no longer exists.`);
      if (row.version !== version) throw new ConflictError();
      if (!canDelete(session.role, row.status)) {
        throw new ActionError(
          "Only draft or archived items can be deleted. Unpublish or archive it first.",
        );
      }
      await collection.remove(tx, id);
      await audit(tx, session, collection, row, "delete", `Deleted: ${row.label}`, {
        slug: row.slug,
        status: row.status,
      });
    }, transactionOptions);
  });
  if (!state.ok) return state;
  afterDelete();
}

function statusWord(status: ContentStatus): string {
  return status === "IN_REVIEW" ? "in-review" : status.toLowerCase();
}

export function audit(
  db: Db,
  session: AdminSession,
  collection: WorkflowCollection,
  row: Pick<WorkflowRow, "id">,
  verb: string,
  summary: string,
  metadata?: Prisma.InputJsonValue,
): Promise<void> {
  return recordAudit(db, {
    actorId: session.userId,
    actorEmail: session.email,
    action: `${collection.collection}.${verb}`,
    entityType: collection.collection,
    entityId: row.id,
    summary,
    metadata,
  });
}

export type SaveOperations<T> = {
  /** Reads and validates the form. Throws ActionError with field errors. */
  parse(form: FormData): T;
  /** Creates a draft and returns its id. */
  create(
    db: Prisma.TransactionClient,
    input: T,
    userId: string,
  ): Promise<{ id: string; label: string }>;
  /**
   * Updates the row only if `version` matches (and increments it), then
   * replaces its relations. Returns the number of rows updated.
   */
  update(
    db: Prisma.TransactionClient,
    id: string,
    version: number,
    input: T,
    userId: string,
  ): Promise<number>;
  editPath(id: string): string;
};

/**
 * Creates or updates content from an editor form. Shared body of every
 * `save<Type>` Server Action. New content always starts as a draft. Editing
 * published content re-checks that it is still publishable and expires the
 * public cache; the whole change commits or rolls back together.
 */
export async function applySave<T>(
  collection: WorkflowCollection,
  form: FormData,
  ops: SaveOperations<T>,
): Promise<ActionState> {
  let savedId = "";
  const state = await runAction(async () => {
    const session = await requireAdmin();
    const db = getDb();

    if (!text(form, "id")) {
      authorize(session, "content:edit-draft");
      const input = ops.parse(form);
      const created = await db.$transaction(async (tx) => {
        const row = await ops.create(tx, input, session.userId);
        await audit(tx, session, collection, row, "create", `Created: ${row.label}`);
        return row;
      }, transactionOptions);
      savedId = created.id;
      return;
    }

    const { id, version } = readTarget(form);
    const input = ops.parse(form);
    const wasLive = await db.$transaction(async (tx) => {
      const row = await collection.find(tx, id);
      if (!row) throw new ActionError(`This ${collection.label.toLowerCase()} no longer exists.`);
      if (row.version !== version) throw new ConflictError();
      if (!canEdit(session.role, row.status)) {
        throw new ActionError(
          row.status === "ARCHIVED"
            ? "Restore this item to draft before editing it."
            : "Only reviewers and administrators can edit content that is in review or published.",
        );
      }
      const count = await ops.update(tx, id, version, input, session.userId);
      if (count !== 1) throw new ConflictError();
      if (row.status === "PUBLISHED") {
        const problem = await collection.checkPublishable(tx, id);
        if (problem) throw new ActionError(`Not saved: ${problem}`);
      }
      await audit(tx, session, collection, row, "update", `Updated: ${row.label}`, {
        status: row.status,
      });
      return row.status === "PUBLISHED";
    }, transactionOptions);

    if (wasLive) expireCollection(collection);
    savedId = id;
  });

  if (!state.ok) return state;
  redirect(`${ops.editPath(savedId)}?saved=1`);
}
