# 0009. Media uploads to a private R2 bucket through the server

> Storage provider superseded by [ADR 0010](0010-neon-managed-backend.md). Current uploads use Neon's private `assets` bucket and `AWS_*` variables; upload validation and serving rules below still apply.

- **Status:** Accepted
- **Date:** 2026-10-20
- **Milestone:** M04

## Context

Editors need to upload photographs and PDFs. ADR 0004 chose Cloudflare R2. Uploads must be authorised on the server, validated (size, type, file signature), stored under unguessable keys, carry alt text and licensing, and never expose R2 credentials. The site runs on Vercel, whose functions accept request bodies up to 4.5 MB.

## Decision

- **Through the server, not presigned.** Files are posted to a Server Action (`uploadMedia`), which checks the role and a per-user rate limit (30 per 10 minutes), then validates the bytes: at most 4 MB; MIME type on an allowlist (JPEG, PNG, WebP, AVIF, PDF); the leading bytes must match the declared type; images must decode, at most 12,000 px a side. SVG and HTML are never accepted. Because the server sees every byte, nothing unvalidated reaches the bucket and no bucket CORS is needed.
- **Keys** are `media/YYYY/MM/<uuid>.<ext>`. Nothing from the user (such as the file name) is used; the original name is kept only as metadata.
- **Order of writes.** A `PENDING` row is created, then the object is stored, then the row becomes `READY` (with an audit event). If storing fails the row is deleted. Every object therefore has a row.
- **Serving.** The bucket stays private. `/media/<key>` streams the object only when the key has the exact generated shape and the row is `READY`; the content type comes from the database; responses carry `nosniff` and `Content-Security-Policy: default-src 'none'; sandbox`; PDFs download. `next/image` optimises only `/images`, `/brand`, `/media` and static imports, never with query strings.
- **Metadata.** Images require alt text (20+ characters) and a caption; every file records credit and licence. Editing them is limited to reviewers and administrators, because the change shows on live pages at once.
- **Deletion.** Only unused uploads can be deleted (application check plus `ON DELETE RESTRICT`); the M03 licensed photographs (`STATIC`) cannot. The row is deleted first, then the object.
- **Orphan cleanup.** `npm run media:cleanup` reports `PENDING` rows older than a day and bucket objects with no row; `--apply` deletes them. Run it periodically (manually now; scheduled in M07).
- **Client.** `aws4fetch` signs S3-compatible requests (`src/services/storage.ts`); the AWS SDK is not needed.

## Consequences

- 4 MB per file. Larger PDFs would need presigned uploads with post-upload verification (a later ADR).
- Every media request runs a function and a database lookup; CDN caching (`s-maxage=86400`) absorbs most of it. Keys are random and never reused, so caching is safe; a deleted file can stay cached at the edge for up to a day.
- No image re-encoding, so EXIF metadata (including GPS) is kept. Editors must strip location data before upload until server-side re-encoding is added (M06).
