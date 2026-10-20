import { readFileSync } from "node:fs";
import { updateTag } from "next/cache";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/media/[...key]/route";
import { deleteMedia, storageKeyPattern, uploadMedia } from "@/features/media";
import { getDb } from "@/services/db";
import { checkRateLimit } from "@/services/rate-limit";
import { deleteObject, getObject, putObject } from "@/services/storage";
import { createUser, expectRedirect, form, idle, signInAs, type TestUser } from "./helpers";

// R2 is replaced by an in-memory double here; tests/e2e and the verification
// record cover the real bucket.
vi.mock("@/services/storage", () => {
  const objects = new Map<string, Uint8Array>();
  return {
    putObject: vi.fn(async (key: string, body: Uint8Array) => {
      objects.set(key, body);
    }),
    getObject: vi.fn(async (key: string) =>
      objects.has(key)
        ? new Response(objects.get(key) as BodyInit, { headers: { etag: '"abc"' } })
        : null,
    ),
    deleteObject: vi.fn(async (key: string) => {
      objects.delete(key);
    }),
    StorageError: class StorageError extends Error {},
  };
});

const jpegBytes = readFileSync("public/images/budongo-forest-tree.jpg");
const imageFile = () => new File([jpegBytes], "forest tree.jpg", { type: "image/jpeg" });
const metadata = {
  alt: "Looking up a buttressed tree trunk into the forest canopy",
  caption: "Budongo Forest",
  creditAuthor: "EACH",
  license: "All rights reserved",
};

let editor: TestUser;
let reviewer: TestUser;

beforeAll(async () => {
  editor = await createUser("editor");
  reviewer = await createUser("reviewer");
});

beforeEach(() => {
  vi.mocked(putObject).mockClear();
  vi.mocked(updateTag).mockClear();
});

describe("media upload", () => {
  it("stores a valid image under a random key and marks it ready", async () => {
    await signInAs(editor);
    await expectRedirect(
      uploadMedia(idle, form({ file: imageFile(), ...metadata })),
      /^\/admin\/media\/\w+\?uploaded=1$/,
    );

    const [key, , mimeType] = vi.mocked(putObject).mock.calls[0] ?? [];
    expect(storageKeyPattern.test(String(key))).toBe(true);
    expect(String(key)).not.toContain("forest");
    expect(mimeType).toBe("image/jpeg");

    const asset = await getDb().mediaAsset.findUniqueOrThrow({ where: { key: String(key) } });
    expect(asset).toMatchObject({
      storage: "NEON",
      status: "READY",
      kind: "IMAGE",
      width: 1200,
      height: 1600,
      fileName: "forest tree.jpg",
      uploadedById: editor.id,
    });
    expect(asset.checksum).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rejects missing, disguised, scriptable and oversized files without storing anything", async () => {
    await signInAs(editor);
    const svg = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'],
      "x.svg",
      {
        type: "image/svg+xml",
      },
    );
    const disguised = new File(["<script>alert(1)</script>"], "x.png", { type: "image/png" });
    const huge = new File([new Uint8Array(4 * 1024 * 1024 + 1)], "big.jpg", { type: "image/jpeg" });

    for (const file of [undefined, svg, disguised, huge]) {
      const result = await uploadMedia(idle, form({ file, ...metadata }));
      expect(result).toMatchObject({ ok: false, fieldErrors: { file: expect.any(String) } });
    }
    expect(putObject).not.toHaveBeenCalled();
  });

  it("requires alt text and a caption for images", async () => {
    await signInAs(editor);
    const result = await uploadMedia(
      idle,
      form({ file: imageFile(), ...metadata, alt: "tree", caption: "" }),
    );
    expect(result).toMatchObject({
      ok: false,
      fieldErrors: { alt: expect.any(String), caption: expect.any(String) },
    });
    expect(putObject).not.toHaveBeenCalled();
  });

  it("leaves no database row when storage fails", async () => {
    await signInAs(editor);
    const before = await getDb().mediaAsset.count();
    vi.mocked(putObject).mockRejectedValueOnce(new Error("R2 unavailable"));
    const result = await uploadMedia(idle, form({ file: imageFile(), ...metadata }));
    expect(result).toMatchObject({
      ok: false,
      message: expect.stringMatching(/could not be stored/),
    });
    expect(await getDb().mediaAsset.count()).toBe(before);
  });
});

describe("media deletion", () => {
  it("refuses static site photographs and files still in use", async () => {
    await signInAs(reviewer);
    const staticAsset = await getDb().mediaAsset.findFirstOrThrow({ where: { storage: "STATIC" } });
    expect(await deleteMedia(idle, form({ id: staticAsset.id, confirm: true }))).toMatchObject({
      ok: false,
    });
  });

  it("deletes an unused upload and its object, and expires the media cache", async () => {
    await signInAs(reviewer);
    const asset = await getDb().mediaAsset.findFirstOrThrow({
      where: { storage: "NEON", status: "READY" },
    });
    await expectRedirect(
      deleteMedia(idle, form({ id: asset.id, confirm: true })),
      "/admin/media?deleted=1",
    );
    expect(await getDb().mediaAsset.findUnique({ where: { id: asset.id } })).toBeNull();
    expect(deleteObject).toHaveBeenCalledWith(asset.key);
    expect(updateTag).toHaveBeenCalledWith("content:media");
  });
});

describe("/media route", () => {
  const request = (key: string) =>
    GET(new Request(`http://localhost/${key}`), {
      params: Promise.resolve({ key: key.split("/").slice(1) }),
    });

  it("serves a ready upload with safe headers", async () => {
    await signInAs(editor);
    await expectRedirect(uploadMedia(idle, form({ file: imageFile(), ...metadata })), /uploaded=1/);
    const key = String(vi.mocked(putObject).mock.calls.at(-1)?.[0]);

    const response = await request(key);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/jpeg");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("content-security-policy")).toContain("sandbox");
  });

  it("returns 404 for unknown, malformed and unfinished uploads", async () => {
    expect((await request("media/2026/01/00000000-0000-0000-0000-000000000000.jpg")).status).toBe(
      404,
    );
    expect((await request("media/../../etc/passwd")).status).toBe(404);

    const pending = await getDb().mediaAsset.create({
      data: {
        storage: "NEON",
        key: "media/2026/01/11111111-1111-1111-1111-111111111111.jpg",
        kind: "IMAGE",
        status: "PENDING",
        mimeType: "image/jpeg",
        byteSize: 1,
        fileName: "pending.jpg",
        creditAuthor: "EACH",
        license: "All rights reserved",
      },
    });
    expect((await request(pending.key)).status).toBe(404);
    expect(getObject).not.toHaveBeenCalledWith(pending.key);
  });
});

describe("rate limiting", () => {
  it("allows up to the limit within a window, then blocks until it resets", async () => {
    const rule = { name: `test-${Date.now()}`, limit: 2, windowSeconds: 60 };
    const start = Date.now();
    expect((await checkRateLimit(rule, "subject", start)).allowed).toBe(true);
    expect((await checkRateLimit(rule, "subject", start + 1)).allowed).toBe(true);
    const blocked = await checkRateLimit(rule, "subject", start + 2);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect((await checkRateLimit(rule, "other-subject", start + 2)).allowed).toBe(true);
    expect((await checkRateLimit(rule, "subject", start + 61_000)).allowed).toBe(true);
  });
});
