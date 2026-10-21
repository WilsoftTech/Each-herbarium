import "server-only";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { PrismaClient, Prisma } from "@/generated/prisma/client";
import { contentTags, type ContentCollection } from "@/lib/cache-tags";
import { authorize, requireAdmin, type AdminSession } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { getDb, transactionOptions, withRollback } from "@/services/db";
import type { ActionState } from "./action-state";
import { checkbox, text } from "./form-data";
import { ActionError, ConflictError, runAction } from "./run-action";
import {
  affectsPublicSite,
  blockedByRevision,
  canDelete,
  canEdit,
  canEditRevision,
  canTransition,
  canTransitionRevision,
  isRevisionTransition,
  revisionTransitions,
  transitionNames,
  transitions,
  type ContentStatus,
  type RevisionStatus,
  type RevisionTransitionName,
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
  /** Null only for an explicitly authorised system seed/CLI operation. */
  updatedById: string | null;
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

export type SaveOperations<T> = {
  /** Reads and validates the form. Throws ActionError with field errors. */
  parse(form: FormData): T;
  /** Validates stored revision data again, with the same schema as `parse`. */
  revive(data: unknown): T;
  /** Creates a draft and returns its id. */
  create(
    db: Prisma.TransactionClient,
    input: T,
    userId: string | null,
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
    userId: string | null,
  ): Promise<number>;
  editPath(id: string): string;
};

/** A pending revision, as the editor and workflow panel see it. */
export type RevisionInfo = {
  id: string;
  entityId: string;
  status: RevisionStatus;
  version: number;
  baseVersion: number;
  data: unknown;
  submittedAt: Date | null;
  updatedById: string | null;
  updatedAt: Date;
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

function toRevisionInfo(row: {
  id: string;
  entityId: string;
  status: ContentStatus;
  version: number;
  baseVersion: number;
  data: Prisma.JsonValue;
  submittedAt: Date | null;
  updatedById: string | null;
  updatedAt: Date;
}): RevisionInfo {
  // The CHECK constraint allows only these two statuses.
  return { ...row, status: row.status === "IN_REVIEW" ? "IN_REVIEW" : "DRAFT" };
}

function findRevisionRow(db: Db, collection: ContentCollection, entityId: string) {
  return db.contentRevision.findUnique({
    where: { collection_entityId: { collection, entityId } },
  });
}

/** The pending revision of an item, or null. Admin pages call requireAdmin() first. */
export async function getRevision(
  collection: ContentCollection,
  entityId: string,
  db: Db = getDb(),
): Promise<RevisionInfo | null> {
  const row = await findRevisionRow(db, collection, entityId);
  return row && toRevisionInfo(row);
}

/**
 * Runs `read` against the item as it would be if `revision` were approved,
 * inside a transaction that is always rolled back. Returns an error message
 * instead when the stored changes no longer validate (for example a chosen
 * image was deleted).
 */
export async function readWithRevision<T, R>(
  collection: WorkflowCollection,
  ops: SaveOperations<T>,
  revision: RevisionInfo,
  read: (db: Prisma.TransactionClient) => Promise<R>,
): Promise<{ value: R | null; error: string | null }> {
  try {
    const value = await withRollback(getDb(), async (tx) => {
      const row = await collection.find(tx, revision.entityId);
      if (!row) return null;
      const input = ops.revive(revision.data);
      const count = await ops.update(tx, row.id, row.version, input, revision.updatedById ?? "");
      return count === 1 ? read(tx) : null;
    });
    return { value, error: null };
  } catch (error) {
    if (error instanceof ActionError) return { value: null, error: error.message };
    throw error;
  }
}

/**
 * Loads an item for its editor page: the live row, and the same row with the
 * pending revision applied (what the form shows). The draft's `version` is
 * the revision's, because that is what the form must post back.
 */
export async function loadForEditing<T, R extends { version: number }>(
  collection: WorkflowCollection,
  ops: SaveOperations<T>,
  id: string,
  read: (db: Db) => Promise<R | null>,
): Promise<{
  live: R;
  draft: R;
  revision: RevisionInfo | null;
  revisionError: string | null;
} | null> {
  const [live, revision] = await Promise.all([
    read(getDb()),
    getRevision(collection.collection, id),
  ]);
  if (!live) return null;
  if (!revision) return { live, draft: live, revision: null, revisionError: null };
  const applied = await readWithRevision(collection, ops, revision, read);
  return {
    live,
    draft: applied.value ? { ...applied.value, version: revision.version } : live,
    revision,
    revisionError: applied.error,
  };
}

/**
 * What an admin preview shows: the item mapped to its public contract, with
 * the pending revision applied when there is one. `map` is the same function
 * the public page uses; when it rejects the data, `error` explains why.
 * Returns null when the item does not exist.
 */
export async function loadPreview<T, Row extends { status: ContentStatus }, V>(
  collection: WorkflowCollection,
  ops: SaveOperations<T>,
  id: string,
  read: (db: Db) => Promise<Row | null>,
  map: (row: Row) => V,
  invalid: string,
): Promise<{
  status: ContentStatus;
  value: V | null;
  revision: RevisionInfo | null;
  error: string | null;
} | null> {
  const revision = await getRevision(collection.collection, id);
  const applied = revision
    ? await readWithRevision(collection, ops, revision, read)
    : { value: await read(getDb()), error: null };
  if (!applied.value) {
    return applied.error
      ? { status: "PUBLISHED", value: null, revision, error: applied.error }
      : null;
  }
  try {
    return { status: applied.value.status, value: map(applied.value), revision, error: null };
  } catch {
    return { status: applied.value.status, value: null, revision, error: invalid };
  }
}

/** Applies a workflow transition. Shared body of every `transition<Type>` Server Action. */
export async function applyTransition<T>(
  collection: WorkflowCollection,
  form: FormData,
  ops: SaveOperations<T>,
): Promise<ActionState> {
  const name = text(form, "transition");
  if (isRevisionTransition(name)) return applyRevisionTransition(collection, form, ops, name);

  return runAction(async () => {
    const session = await requireAdmin();
    const { id, version } = readTarget(form);
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
      if (blockedByRevision(name) && (await findRevisionRow(tx, collection.collection, id))) {
        throw new ActionError(
          "This item has changes waiting to be published. Publish or discard them first.",
        );
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
    // The editor shows the new status and the actions it now allows.
    refresh();
    return { ok: true, message: `${rule.label}: done.` };
  });
}

/**
 * Submits, approves, returns or discards a pending revision. Approval applies
 * the stored changes to the live row through the feature's own `update`
 * (same validation and relation handling as a direct save), re-checks the
 * publishing rules and deletes the revision, all in one transaction.
 */
async function applyRevisionTransition<T>(
  collection: WorkflowCollection,
  form: FormData,
  ops: SaveOperations<T>,
  name: RevisionTransitionName,
): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    const { id, version } = readTarget(form);
    const revisionId = text(form, "revision");
    const rule = revisionTransitions[name];
    authorize(session, rule.permission);

    const applied = await getDb().$transaction(async (tx) => {
      const row = await collection.find(tx, id);
      if (!row) throw new ActionError(`This ${collection.label.toLowerCase()} no longer exists.`);
      const stored = await findRevisionRow(tx, collection.collection, id);
      if (!stored || stored.id !== revisionId) {
        throw new ActionError("These changes are no longer pending. Reload the page.");
      }
      if (stored.version !== version) throw new ConflictError();
      const revision = toRevisionInfo(stored);
      if (!canTransitionRevision(session.role, revision.status, name)) {
        throw new ActionError(
          revision.status === "IN_REVIEW"
            ? "Changes waiting for review can only be changed by a reviewer or administrator."
            : "Changes that are still a draft cannot be changed that way.",
        );
      }

      if (rule.to === "DISCARDED") {
        await tx.contentRevision.delete({ where: { id: revision.id } });
      } else if (rule.to === "APPLIED") {
        if (row.status !== "PUBLISHED") {
          throw new ActionError("This item is no longer published. Discard these changes.");
        }
        if (row.version !== revision.baseVersion) throw new ConflictError();
        const input = ops.revive(revision.data);
        const count = await ops.update(tx, id, row.version, input, session.userId);
        if (count !== 1) throw new ConflictError();
        const problem = await collection.checkPublishable(tx, id);
        if (problem) throw new ActionError(`Not published: ${problem}`);
        await tx.contentRevision.delete({ where: { id: revision.id } });
      } else {
        const { count } = await tx.contentRevision.updateMany({
          where: { id: revision.id, version },
          data: {
            status: rule.to,
            submittedAt: rule.to === "IN_REVIEW" ? new Date() : null,
            updatedById: session.userId,
            version: { increment: 1 },
          },
        });
        if (count !== 1) throw new ConflictError();
      }

      await audit(tx, session, collection, row, verbOf(name), `${rule.label}: ${row.label}`, {
        revision: revision.id,
        from: revision.status,
        to: rule.to,
      });
      return rule.to === "APPLIED";
    }, transactionOptions);

    if (applied) expireCollection(collection);
    // The editor shows the pending changes' new state (or that they are gone).
    refresh();
    return { ok: true, message: `${rule.label}: done.` };
  });
}

/** Audit verbs: "revision-submit", "revision-approve", "revision-return", "revision-discard". */
function verbOf(name: RevisionTransitionName): string {
  return `revision-${name.replace("Revision", "")}`;
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
      // Revisions exist only for published items; this keeps the table clean regardless.
      await tx.contentRevision.deleteMany({
        where: { collection: collection.collection, entityId: id },
      });
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

/**
 * Creates or updates content from an editor form. Shared body of every
 * `save<Type>` Server Action.
 *
 * - No id: creates a draft.
 * - Draft or in review: updates the row (it is not on the website).
 * - Published: saves the input as the item's pending revision. The live row
 *   is not touched, so the website keeps showing the approved version until
 *   a reviewer approves the revision. The changes are first applied in a
 *   rolled-back transaction to check they would still be publishable.
 */
export async function applySave<T>(
  collection: WorkflowCollection,
  form: FormData,
  ops: SaveOperations<T>,
): Promise<ActionState> {
  let savedId = "";
  let message = "saved=1";
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
    const revisionId = text(form, "revision");
    const input = ops.parse(form);
    const current = await collection.find(db, id);
    if (!current) throw new ActionError(`This ${collection.label.toLowerCase()} no longer exists.`);

    if (current.status === "PUBLISHED") {
      await saveRevision(collection, ops, session, current, input, { version, revisionId });
      savedId = id;
      message = "revision=1";
      return;
    }

    await db.$transaction(async (tx) => {
      const row = await collection.find(tx, id);
      if (!row) throw new ActionError(`This ${collection.label.toLowerCase()} no longer exists.`);
      // A revision form posted after the item was unpublished, or a stale form.
      if (revisionId || row.status === "PUBLISHED" || row.version !== version) {
        throw new ConflictError();
      }
      if (!canEdit(session.role, row.status)) {
        throw new ActionError(
          row.status === "ARCHIVED"
            ? "Restore this item to draft before editing it."
            : "Only reviewers and administrators can edit content that is in review.",
        );
      }
      const count = await ops.update(tx, id, version, input, session.userId);
      if (count !== 1) throw new ConflictError();
      await audit(tx, session, collection, row, "update", `Updated: ${row.label}`, {
        status: row.status,
      });
    }, transactionOptions);
    savedId = id;
  });

  if (!state.ok) return state;
  redirect(`${ops.editPath(savedId)}?${message}`);
}

async function saveRevision<T>(
  collection: WorkflowCollection,
  ops: SaveOperations<T>,
  session: AdminSession,
  current: WorkflowRow,
  input: T,
  posted: { version: number; revisionId: string },
): Promise<void> {
  authorize(session, "content:edit-draft");
  const db = getDb();

  // Would these changes still be publishable? Applied and rolled back.
  const problem = await withRollback(db, async (tx) => {
    const count = await ops.update(tx, current.id, current.version, input, session.userId);
    if (count !== 1) throw new ConflictError();
    return collection.checkPublishable(tx, current.id);
  });
  if (problem) throw new ActionError(`Not saved: ${problem}`);

  // Stored as JSON; every input schema uses JSON-safe values (dates as ISO strings).
  const data = input as unknown as Prisma.InputJsonValue;

  await db.$transaction(async (tx) => {
    const row = await collection.find(tx, current.id);
    if (!row || row.status !== "PUBLISHED") throw new ConflictError();
    const existing = await findRevisionRow(tx, collection.collection, row.id);

    if (existing) {
      if (existing.id !== posted.revisionId || existing.version !== posted.version) {
        throw new ConflictError();
      }
      const status = toRevisionInfo(existing).status;
      if (!canEditRevision(session.role, status)) {
        throw new ActionError(
          "These changes are waiting for review. Only reviewers and administrators can change them.",
        );
      }
      const { count } = await tx.contentRevision.updateMany({
        where: { id: existing.id, version: posted.version },
        data: { data, updatedById: session.userId, version: { increment: 1 } },
      });
      if (count !== 1) throw new ConflictError();
    } else {
      if (posted.revisionId || row.version !== posted.version) throw new ConflictError();
      await tx.contentRevision.create({
        data: {
          collection: collection.collection,
          entityId: row.id,
          baseVersion: row.version,
          data,
          createdById: session.userId,
          updatedById: session.userId,
        },
      });
    }

    await audit(tx, session, collection, row, "revise", `Saved changes for review: ${row.label}`);
  }, transactionOptions);
}
