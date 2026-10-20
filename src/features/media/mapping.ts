import type { Prisma } from "@/generated/prisma/client";
import { documentAssetSchema, mediaAssetSchema, type DocumentAsset } from "@/validation/content";
import type { MediaAsset } from "@/config/media";

/** Columns every content query selects for an attached image or document. */
export const mediaSelect = {
  id: true,
  storage: true,
  key: true,
  kind: true,
  status: true,
  mimeType: true,
  byteSize: true,
  fileName: true,
  width: true,
  height: true,
  alt: true,
  caption: true,
  creditAuthor: true,
  license: true,
  licenseUrl: true,
  sourceUrl: true,
} as const satisfies Prisma.MediaAssetSelect;

export type MediaRow = Prisma.MediaAssetGetPayload<{ select: typeof mediaSelect }>;

/** Public URL path: static files keep their /public path, R2 objects go through /media. */
export function mediaSrc(row: Pick<MediaRow, "storage" | "key">): string {
  return row.storage === "STATIC" ? row.key : `/${row.key}`;
}

/** Maps an image row to the public contract. Throws if the row breaks it. */
export function toMediaAsset(row: MediaRow): MediaAsset {
  return mediaAssetSchema.parse({
    src: mediaSrc(row),
    width: row.width,
    height: row.height,
    alt: row.alt,
    caption: row.caption,
    credit: {
      author: row.creditAuthor,
      license: row.license,
      licenseUrl: row.licenseUrl,
      sourceUrl: row.sourceUrl,
    },
  });
}

export function toDocumentAsset(row: MediaRow): DocumentAsset {
  return documentAssetSchema.parse({
    src: mediaSrc(row),
    fileName: row.fileName,
    mimeType: row.mimeType,
    byteSize: row.byteSize,
  });
}

/** Only finished uploads may appear on public pages. */
export function isUsable(row: MediaRow | null | undefined): row is MediaRow {
  return row?.status === "READY";
}

/**
 * Usable images keyed by media id, for content that refers to images by id
 * (designed page sections). Unfinished uploads and images without the
 * required alt text and caption are left out.
 */
export function usableImages(rows: readonly MediaRow[]): Record<string, MediaAsset> {
  const images: Record<string, MediaAsset> = {};
  for (const row of rows) {
    if (!isUsable(row)) continue;
    try {
      images[row.id] = toMediaAsset(row);
    } catch {
      // Left out: publishing refuses such images, and pages skip them.
    }
  }
  return images;
}
