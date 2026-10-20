import { storageKeyPattern } from "@/features/media";
import { getDb } from "@/services/db";
import { getObject } from "@/services/storage";

/**
 * Serves uploaded files from the private Neon bucket. Only keys with the exact
 * shape the upload pipeline creates are looked up, and only finished uploads
 * that still exist in the database are served, so deleting a file stops it
 * being served. The content type comes from the database, never from the
 * object, and responses cannot run scripts.
 */
export async function GET(_request: Request, { params }: RouteContext<"/media/[...key]">) {
  const key = `media/${(await params).key.join("/")}`;
  if (!storageKeyPattern.test(key)) return notFound();

  const asset = await getDb().mediaAsset.findUnique({
    where: { key },
    select: {
      storage: true,
      status: true,
      mimeType: true,
      byteSize: true,
      kind: true,
      fileName: true,
    },
  });
  if (!asset || asset.storage !== "NEON" || asset.status !== "READY") return notFound();

  let object: Response | null;
  try {
    object = await getObject(key);
  } catch (error) {
    console.error("[media route]", error);
    return new Response("Temporarily unavailable", {
      status: 503,
      headers: { "Retry-After": "30" },
    });
  }
  if (!object?.body) return notFound();

  const fileName = asset.fileName.replace(/[^\w.\- ]/g, "_");
  return new Response(object.body, {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(asset.byteSize),
      // Keys are random and never reused; an hour in browsers, a day at the CDN.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; sandbox",
      "X-Content-Type-Options": "nosniff",
      // PDFs download rather than render: browsers refuse PDFs in sandboxed documents.
      "Content-Disposition":
        asset.kind === "DOCUMENT" ? `attachment; filename="${fileName}"` : "inline",
      ...(object.headers.get("etag") ? { ETag: object.headers.get("etag") as string } : {}),
    },
  });
}

function notFound(): Response {
  return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
}
