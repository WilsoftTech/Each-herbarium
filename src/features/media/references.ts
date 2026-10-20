import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/services/db";

type Db = Prisma.TransactionClient;

export type MediaOption = {
  id: string;
  label: string;
  src: string;
  kind: "IMAGE" | "DOCUMENT";
};

/**
 * Throws a field error unless every id is a finished upload of the given
 * kind. Foreign keys guarantee the rows exist; this also checks the kind and
 * that the upload completed.
 */
export async function assertMedia(
  db: Db,
  ids: readonly string[],
  kind: "IMAGE" | "DOCUMENT",
): Promise<string | null> {
  const unique = [...new Set(ids)];
  if (!unique.length) return null;
  const found = await db.mediaAsset.count({
    where: { id: { in: unique }, kind, status: "READY" },
  });
  return found === unique.length
    ? null
    : kind === "IMAGE"
      ? "Choose an image from the media library."
      : "Choose a PDF from the media library.";
}

/** Ready media for pickers in editor forms, newest first (at most 500). */
export async function listMediaOptions(kind: "IMAGE" | "DOCUMENT"): Promise<MediaOption[]> {
  const rows = await getDb().mediaAsset.findMany({
    where: { kind, status: "READY" },
    orderBy: { createdAt: "desc" },
    select: { id: true, storage: true, key: true, kind: true, caption: true, fileName: true },
    take: 500,
  });
  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    label: row.caption ? `${row.caption} (${row.fileName})` : row.fileName,
    src: row.storage === "STATIC" ? row.key : `/${row.key}`,
  }));
}
