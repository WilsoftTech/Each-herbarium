import "server-only";
import { AwsClient } from "aws4fetch";
import { getStorageEnv } from "@/config/env";

/**
 * Neon Object Storage through its S3-compatible API, signed with SigV4 (aws4fetch).
 * Credentials stay on the server: the browser never talks to storage. Uploads pass
 * through a Server Action that validates the bytes first, and files are served
 * through the /media route.
 */

export type StoredObject = { key: string; size: number; lastModified: Date };

export class StorageError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

let client: AwsClient | undefined;

function storage(): { client: AwsClient; bucketUrl: string } {
  const env = getStorageEnv();
  client ??= new AwsClient({
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
    service: "s3",
    region: env.region,
  });
  return { client, bucketUrl: env.bucketUrl };
}

function objectUrl(bucketUrl: string, key: string): string {
  return `${bucketUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function putObject(key: string, body: Uint8Array, contentType: string): Promise<void> {
  const { client, bucketUrl } = storage();
  const response = await client.fetch(objectUrl(bucketUrl, key), {
    method: "PUT",
    body: body as BodyInit,
    headers: { "content-type": contentType, "content-length": String(body.byteLength) },
  });
  if (!response.ok) throw new StorageError("Upload to storage failed", response.status);
}

/** The object as a streaming response, or null when it does not exist. */
export async function getObject(key: string): Promise<Response | null> {
  const { client, bucketUrl } = storage();
  const response = await client.fetch(objectUrl(bucketUrl, key));
  if (response.status === 404) return null;
  if (!response.ok) throw new StorageError("Reading from storage failed", response.status);
  return response;
}

/** Deletes the object. Deleting a missing key succeeds (S3 semantics). */
export async function deleteObject(key: string): Promise<void> {
  const { client, bucketUrl } = storage();
  const response = await client.fetch(objectUrl(bucketUrl, key), { method: "DELETE" });
  if (!response.ok && response.status !== 404) {
    throw new StorageError("Deleting from storage failed", response.status);
  }
}

const tag = (xml: string, name: string) =>
  [...xml.matchAll(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "g"))].map(
    (match) => match[1] ?? "",
  );

const decodeXml = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

/** One page (up to 1000 keys) of objects under `prefix`. */
export async function listObjects(
  prefix: string,
  continuationToken?: string,
): Promise<{ objects: StoredObject[]; nextToken: string | undefined }> {
  const { client, bucketUrl } = storage();
  const url = new URL(bucketUrl);
  url.searchParams.set("list-type", "2");
  url.searchParams.set("prefix", prefix);
  if (continuationToken) url.searchParams.set("continuation-token", continuationToken);

  const response = await client.fetch(url.toString());
  if (!response.ok) throw new StorageError("Listing storage failed", response.status);
  const xml = await response.text();

  const objects = tag(xml, "Contents").map((entry) => ({
    key: decodeXml(tag(entry, "Key")[0] ?? ""),
    size: Number(tag(entry, "Size")[0] ?? 0),
    lastModified: new Date(tag(entry, "LastModified")[0] ?? 0),
  }));
  const truncated = tag(xml, "IsTruncated")[0] === "true";
  const next = tag(xml, "NextContinuationToken")[0];
  return { objects, nextToken: truncated && next ? decodeXml(next) : undefined };
}
