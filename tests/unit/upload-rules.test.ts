import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  checkUpload,
  createStorageKey,
  MAX_UPLOAD_BYTES,
  sniffMimeType,
  storageKeyPattern,
} from "@/features/media/upload-rules";

const jpeg = new Uint8Array(readFileSync("public/images/budongo-forest-tree.jpg"));
const png = new Uint8Array(readFileSync("src/app/icon.png"));
const pdf = new TextEncoder().encode("%PDF-1.7\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n");
const svg = new TextEncoder().encode(
  '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
);
const html = new TextEncoder().encode("<!doctype html><script>alert(1)</script>");

const upload = (declaredType: string, bytes: Uint8Array, size = bytes.byteLength) =>
  checkUpload({ declaredType, size, bytes });

describe("file signatures", () => {
  it("identifies allowed types by their leading bytes", () => {
    expect(sniffMimeType(jpeg)).toBe("image/jpeg");
    expect(sniffMimeType(png)).toBe("image/png");
    expect(sniffMimeType(pdf)).toBe("application/pdf");
    expect(sniffMimeType(new TextEncoder().encode("RIFF\0\0\0\0WEBPVP8 "))).toBe("image/webp");
    expect(
      sniffMimeType(new Uint8Array([0, 0, 0, 28, ...new TextEncoder().encode("ftypavif")])),
    ).toBe("image/avif");
  });

  it("does not recognise scriptable formats", () => {
    expect(sniffMimeType(svg)).toBeNull();
    expect(sniffMimeType(html)).toBeNull();
  });
});

describe("upload validation", () => {
  it("accepts a real JPEG and reads its dimensions", () => {
    const result = upload("image/jpeg", jpeg);
    expect(result).toMatchObject({
      ok: true,
      kind: "IMAGE",
      extension: "jpg",
      width: 1200,
      height: 1600,
    });
  });

  it("accepts a PDF as a document", () => {
    expect(upload("application/pdf", pdf)).toMatchObject({
      ok: true,
      kind: "DOCUMENT",
      width: null,
    });
  });

  it("rejects SVG and HTML even when declared as images", () => {
    expect(upload("image/svg+xml", svg)).toMatchObject({ ok: false });
    expect(upload("image/png", svg)).toMatchObject({
      ok: false,
      error: expect.stringMatching(/do not match/),
    });
    expect(upload("text/html", html)).toMatchObject({ ok: false });
  });

  it("rejects a file whose contents do not match its declared type", () => {
    expect(upload("image/png", jpeg)).toMatchObject({
      ok: false,
      error: expect.stringMatching(/do not match/),
    });
    expect(upload("application/pdf", jpeg)).toMatchObject({ ok: false });
  });

  it("rejects empty and oversized files", () => {
    expect(upload("image/jpeg", new Uint8Array())).toMatchObject({
      ok: false,
      error: "The file is empty.",
    });
    expect(upload("image/jpeg", jpeg, MAX_UPLOAD_BYTES + 1)).toMatchObject({
      ok: false,
      error: "The file is larger than 4 MB.",
    });
  });

  it("rejects a truncated image that cannot be read", () => {
    expect(upload("image/png", png.subarray(0, 12))).toMatchObject({ ok: false });
  });
});

describe("storage keys", () => {
  it("are random, contain nothing from the user and match the served pattern", () => {
    const key = createStorageKey(
      "jpg",
      new Date("2026-03-09T10:00:00Z"),
      "0f8fad5b-d9cb-469f-a165-70867728950e",
    );
    expect(key).toBe("media/2026/03/0f8fad5b-d9cb-469f-a165-70867728950e.jpg");
    expect(storageKeyPattern.test(key)).toBe(true);
  });

  it("the served pattern rejects traversal and other shapes", () => {
    for (const key of [
      "media/../secrets.txt",
      "media/2026/03/x.jpg",
      "other/2026/03/0f8fad5b-d9cb-469f-a165-70867728950e.jpg",
      "media/2026/03/0f8fad5b-d9cb-469f-a165-70867728950e.svg",
    ]) {
      expect(storageKeyPattern.test(key), key).toBe(false);
    }
  });
});
