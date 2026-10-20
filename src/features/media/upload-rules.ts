import { imageSize } from "image-size";

/**
 * Upload validation, independent of storage so it can be tested directly.
 *
 * A file is accepted only when its declared MIME type is on the allowlist,
 * its size is within the limit, and its leading bytes carry the signature of
 * that same type. SVG and HTML are never accepted: they can carry scripts.
 */

/** Vercel functions accept request bodies up to 4.5 MB; leave room for the form fields. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Larger images are rejected before they reach the image optimiser. */
export const MAX_IMAGE_DIMENSION = 12_000;

export const allowedUploadTypes = {
  "image/jpeg": { extension: "jpg", kind: "IMAGE" },
  "image/png": { extension: "png", kind: "IMAGE" },
  "image/webp": { extension: "webp", kind: "IMAGE" },
  "image/avif": { extension: "avif", kind: "IMAGE" },
  "application/pdf": { extension: "pdf", kind: "DOCUMENT" },
} as const;

export type AllowedMimeType = keyof typeof allowedUploadTypes;
export type UploadKind = (typeof allowedUploadTypes)[AllowedMimeType]["kind"];

const ascii = (bytes: Uint8Array, start: number, end: number) =>
  String.fromCharCode(...bytes.subarray(start, end));

/** The allowed type the file's signature (magic number) identifies, or null. */
export function sniffMimeType(bytes: Uint8Array): AllowedMimeType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value)
  ) {
    return "image/png";
  }
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") {
    return "image/webp";
  }
  if (
    bytes.length >= 12 &&
    ascii(bytes, 4, 8) === "ftyp" &&
    /^avi[fs]$/.test(ascii(bytes, 8, 12))
  ) {
    return "image/avif";
  }
  if (bytes.length >= 5 && ascii(bytes, 0, 5) === "%PDF-") return "application/pdf";
  return null;
}

export type UploadCheck =
  | {
      ok: true;
      mimeType: AllowedMimeType;
      kind: UploadKind;
      extension: string;
      width: number | null;
      height: number | null;
    }
  | { ok: false; error: string };

export function checkUpload(file: {
  declaredType: string;
  size: number;
  bytes: Uint8Array;
}): UploadCheck {
  if (file.size === 0 || file.bytes.length === 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_UPLOAD_BYTES || file.bytes.length > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "The file is larger than 4 MB." };
  }

  const declared = file.declaredType.toLowerCase();
  if (!(declared in allowedUploadTypes)) {
    return { ok: false, error: "Upload a JPEG, PNG, WebP or AVIF image, or a PDF document." };
  }
  const mimeType = declared as AllowedMimeType;

  if (sniffMimeType(file.bytes) !== mimeType) {
    return { ok: false, error: "The file's contents do not match its type." };
  }

  const { kind, extension } = allowedUploadTypes[mimeType];
  if (kind === "DOCUMENT") {
    return { ok: true, mimeType, kind, extension, width: null, height: null };
  }

  let size: ReturnType<typeof imageSize>;
  try {
    size = imageSize(file.bytes);
  } catch {
    return { ok: false, error: "The image could not be read." };
  }
  if (!size.width || !size.height) return { ok: false, error: "The image could not be read." };
  if (size.width > MAX_IMAGE_DIMENSION || size.height > MAX_IMAGE_DIMENSION) {
    return {
      ok: false,
      error: `Images must be at most ${MAX_IMAGE_DIMENSION} pixels on each side.`,
    };
  }

  // EXIF orientations 5–8 are rotated a quarter turn when displayed.
  const rotated = (size.orientation ?? 1) >= 5;
  return {
    ok: true,
    mimeType,
    kind,
    extension,
    width: rotated ? size.height : size.width,
    height: rotated ? size.width : size.height,
  };
}

/** Random, unguessable object key. Nothing from the user (such as the file name) is used. */
export function createStorageKey(extension: string, now: Date, uuid: string): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `media/${year}/${month}/${uuid}.${extension}`;
}

/** Keys the /media route will serve: exactly the shape createStorageKey produces. */
export const storageKeyPattern = /^media\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|pdf)$/;
