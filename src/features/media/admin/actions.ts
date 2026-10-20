"use server";

import { createHash, randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  ActionError,
  ConflictError,
  formData,
  parseInput,
  runAction,
  type ActionState,
} from "@/features/cms";
import { contentTags } from "@/lib/cache-tags";
import { authorize, requireAdmin } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { getDb, transactionOptions } from "@/services/db";
import { checkRateLimit, rateLimits } from "@/services/rate-limit";
import { deleteObject, putObject } from "@/services/storage";
import { checkUpload, createStorageKey, MAX_UPLOAD_BYTES } from "../upload-rules";
import { findMediaUsage, mediaMetadataSchema, readMetadataForm } from "./admin";

/** Keeps a safe display name: no paths, no control characters. */
function cleanFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  return base.replace(/[\u0000-\u001f\u007f"<>]/g, "").slice(0, 200) || "file";
}

/**
 * Uploads an image or PDF to Neon Object Storage. The server checks the role, a per-user rate
 * limit, size, MIME type and file signature before anything is stored. A
 * PENDING row is written first, so an object in the bucket always has a row;
 * failures delete the row, and anything left over is removed by
 * `npm run media:cleanup`.
 */
export async function uploadMedia(_state: ActionState, form: FormData): Promise<ActionState> {
  let assetId = "";
  const state = await runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "media:upload");

    const limit = await checkRateLimit(rateLimits.upload, session.userId);
    if (!limit.allowed)
      throw new ActionError("Too many uploads. Wait a few minutes and try again.");

    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      throw new ActionError("Check the highlighted fields.", { file: "Choose a file to upload." });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new ActionError("Check the highlighted fields.", {
        file: "The file is larger than 4 MB.",
      });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const check = checkUpload({ declaredType: file.type, size: file.size, bytes });
    if (!check.ok) throw new ActionError("Check the highlighted fields.", { file: check.error });

    const metadata = parseInput(mediaMetadataSchema, readMetadataForm(form, check.kind));
    const key = createStorageKey(check.extension, new Date(), randomUUID());
    const db = getDb();

    const pending = await db.mediaAsset.create({
      data: {
        storage: "NEON",
        key,
        kind: check.kind,
        status: "PENDING",
        mimeType: check.mimeType,
        byteSize: bytes.byteLength,
        fileName: cleanFileName(file.name),
        checksum: createHash("sha256").update(bytes).digest("hex"),
        width: check.width,
        height: check.height,
        alt: metadata.alt,
        caption: metadata.caption,
        creditAuthor: metadata.creditAuthor,
        license: metadata.license,
        licenseUrl: metadata.licenseUrl,
        sourceUrl: metadata.sourceUrl,
        uploadedById: session.userId,
      },
    });

    try {
      await putObject(key, bytes, check.mimeType);
    } catch (error) {
      console.error("[media upload]", error);
      await db.mediaAsset.delete({ where: { id: pending.id } }).catch(() => undefined);
      throw new ActionError("The file could not be stored. Nothing was saved. Try again.");
    }

    await db.$transaction(async (tx) => {
      await tx.mediaAsset.update({ where: { id: pending.id }, data: { status: "READY" } });
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: "media.upload",
        entityType: "media",
        entityId: pending.id,
        summary: `Uploaded ${pending.fileName}`,
        metadata: { kind: check.kind, mimeType: check.mimeType, byteSize: bytes.byteLength },
      });
    }, transactionOptions);
    assetId = pending.id;
  });

  if (!state.ok) return state;
  redirect(`/admin/media/${assetId}?uploaded=1`);
}

/** Updates alt text, caption and credit. Shown on live pages at once, so reviewers and administrators only. */
export async function updateMediaMetadata(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "media:edit");
    const id = formData.text(form, "id");
    const updatedAt = formData.text(form, "updatedAt");

    const db = getDb();
    await db.$transaction(async (tx) => {
      const asset = await tx.mediaAsset.findUnique({ where: { id } });
      if (!asset) throw new ActionError("This file no longer exists.");
      if (asset.updatedAt.toISOString() !== updatedAt) throw new ConflictError();
      const metadata = parseInput(mediaMetadataSchema, readMetadataForm(form, asset.kind));
      await tx.mediaAsset.update({
        where: { id },
        data: {
          alt: metadata.alt,
          caption: metadata.caption,
          creditAuthor: metadata.creditAuthor,
          license: metadata.license,
          licenseUrl: metadata.licenseUrl,
          sourceUrl: metadata.sourceUrl,
        },
      });
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: "media.update",
        entityType: "media",
        entityId: id,
        summary: `Updated details of ${asset.fileName}`,
      });
    }, transactionOptions);

    updateTag(contentTags.media);
    return { ok: true, message: "Saved. Pages using this file show the new details." };
  });
}

/**
 * Deletes an uploaded file that no content uses. The database row goes first
 * (foreign keys refuse it while content still points at it), then the object.
 * If removing the object fails it is left for the orphan cleanup.
 */
export async function deleteMedia(_state: ActionState, form: FormData): Promise<ActionState> {
  const state = await runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "media:delete");
    if (!formData.checkbox(form, "confirm")) {
      throw new ActionError("Confirm that you want to delete this file.", {
        confirm: "Tick this box to confirm.",
      });
    }
    const id = formData.text(form, "id");
    const db = getDb();

    const removed = await db.$transaction(async (tx) => {
      const asset = await tx.mediaAsset.findUnique({ where: { id } });
      if (!asset) throw new ActionError("This file no longer exists.");
      if (asset.storage === "STATIC") {
        throw new ActionError(
          "This photograph is part of the website's code and cannot be deleted here.",
        );
      }
      const usage = await findMediaUsage(tx, id);
      if (usage.length) {
        throw new ActionError(
          `This file is still used by ${usage.length} item(s). Remove it from them first.`,
        );
      }
      await tx.mediaAsset.delete({ where: { id } });
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: "media.delete",
        entityType: "media",
        entityId: id,
        summary: `Deleted ${asset.fileName}`,
        metadata: { key: asset.key },
      });
      return asset;
    }, transactionOptions);

    try {
      await deleteObject(removed.key);
    } catch (error) {
      console.error("[media delete] object left for cleanup", removed.key, error);
    }
    updateTag(contentTags.media);
  });
  if (!state.ok) return state;
  redirect("/admin/media?deleted=1");
}
