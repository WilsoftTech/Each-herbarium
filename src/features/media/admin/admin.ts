import "server-only";
import { z } from "zod";
import { formData, pageCount, pageWindow } from "@/features/cms";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/services/db";

const optionalUrl = z
  .url({ protocol: /^https?$/, error: "Use a full https:// address." })
  .nullable();

/**
 * Descriptive metadata. Images must carry alt text and a caption, because
 * every public image renders them; documents need neither.
 */
export const mediaMetadataSchema = z
  .object({
    kind: z.enum(["IMAGE", "DOCUMENT"]),
    alt: z.string().max(500),
    caption: z.string().max(300),
    creditAuthor: z.string().min(1, "Enter who made it (or EACH).").max(200),
    license: z.string().min(1, "Enter the licence, or All rights reserved.").max(100),
    licenseUrl: optionalUrl,
    sourceUrl: optionalUrl,
  })
  .superRefine((value, context) => {
    if (value.kind !== "IMAGE") return;
    if (value.alt.length < 20) {
      context.addIssue({
        code: "custom",
        path: ["alt"],
        message: "Describe the image in at least 20 characters for people who cannot see it.",
      });
    }
    if (!value.caption) {
      context.addIssue({ code: "custom", path: ["caption"], message: "Enter a short caption." });
    }
  });

export type MediaMetadata = z.infer<typeof mediaMetadataSchema>;

export function readMetadataForm(form: FormData, kind: "IMAGE" | "DOCUMENT") {
  const { text, optionalText } = formData;
  return {
    kind,
    alt: text(form, "alt"),
    caption: text(form, "caption"),
    creditAuthor: text(form, "creditAuthor"),
    license: text(form, "license"),
    licenseUrl: optionalText(form, "licenseUrl"),
    sourceUrl: optionalText(form, "sourceUrl"),
  };
}

const kindSchema = z.enum(["IMAGE", "DOCUMENT"]).optional().catch(undefined);

export type MediaListParams = { kind?: "IMAGE" | "DOCUMENT"; page: number };

export function parseMediaListParams(
  params: Record<string, string | string[] | undefined>,
): MediaListParams {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(10_000)
    .catch(1)
    .parse(first(params.page) ?? 1);
  return { kind: kindSchema.parse(first(params.kind)), page };
}

export async function listMediaForAdmin(params: MediaListParams) {
  const where: Prisma.MediaAssetWhereInput = { kind: params.kind };
  const db = getDb();
  const [rows, total] = await Promise.all([
    db.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...pageWindow(params.page),
      select: {
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
        createdAt: true,
      },
    }),
    db.mediaAsset.count({ where }),
  ]);
  return { rows, pageCount: pageCount(total) };
}

export function getMediaForAdmin(id: string) {
  return getDb().mediaAsset.findUnique({
    where: { id },
    include: { uploadedBy: { select: { name: true, email: true } } },
  });
}

export type MediaForAdmin = NonNullable<Awaited<ReturnType<typeof getMediaForAdmin>>>;

type Db = Prisma.TransactionClient | ReturnType<typeof getDb>;

/** Where an asset is used, so editors know what a change affects and deletion can be refused. */
export async function findMediaUsage(
  db: Db,
  id: string,
): Promise<{ label: string; href: string }[]> {
  const [
    programmes,
    projects,
    gallery,
    articleImages,
    articleFiles,
    resources,
    team,
    pageImages,
    partnerLogos,
    settings,
    pending,
    pageSections,
    programmeSections,
  ] = await Promise.all([
    db.programme.findMany({
      where: { imageId: id },
      select: { id: true, title: true },
      take: 50,
    }),
    db.project.findMany({ where: { imageId: id }, select: { id: true, title: true }, take: 50 }),
    db.projectGallery.findMany({
      where: { mediaId: id },
      select: { project: { select: { id: true, title: true } } },
      take: 50,
    }),
    db.article.findMany({ where: { imageId: id }, select: { id: true, title: true }, take: 50 }),
    db.article.findMany({
      where: { documentId: id },
      select: { id: true, title: true },
      take: 50,
    }),
    db.resource.findMany({
      where: { documentId: id },
      select: { id: true, title: true },
      take: 50,
    }),
    db.teamMember.findMany({
      where: { photoId: id },
      select: { id: true, name: true },
      take: 50,
    }),
    db.page.findMany({ where: { heroImageId: id }, select: { id: true, title: true }, take: 50 }),
    db.partner.findMany({ where: { logoId: id }, select: { id: true, name: true }, take: 50 }),
    db.siteSettings.count({ where: { socialImageId: id } }),
    // Pending revisions and designed page sections hold references as JSON,
    // outside foreign keys. Ids are generated (no LIKE wildcards in them).
    db.$queryRaw<{ collection: string; entity_id: string }[]>`
        SELECT "collection", "entity_id" FROM "content_revisions"
        WHERE "data"::text LIKE ${`%"${id}"%`}
        LIMIT 50`,
    db.$queryRaw<{ id: string; title: string }[]>`
        SELECT "id", "title" FROM "pages"
        WHERE "content"::text LIKE ${`%"${id}"%`}
        LIMIT 50`,
    db.$queryRaw<{ id: string; title: string }[]>`
        SELECT "id", "title" FROM "programmes"
        WHERE "content"::text LIKE ${`%"${id}"%`}
        LIMIT 50`,
  ]);
  return [
    ...programmes.map((row) => ({
      label: `Programme: ${row.title}`,
      href: `/admin/programmes/${row.id}`,
    })),
    ...projects.map((row) => ({
      label: `Project: ${row.title}`,
      href: `/admin/projects/${row.id}`,
    })),
    ...gallery.map(({ project }) => ({
      label: `Project gallery: ${project.title}`,
      href: `/admin/projects/${project.id}`,
    })),
    ...articleImages.map((row) => ({
      label: `Article: ${row.title}`,
      href: `/admin/articles/${row.id}`,
    })),
    ...articleFiles.map((row) => ({
      label: `Article download: ${row.title}`,
      href: `/admin/articles/${row.id}`,
    })),
    ...resources.map((row) => ({
      label: `Resource: ${row.title}`,
      href: `/admin/resources/${row.id}`,
    })),
    ...team.map((row) => ({ label: `Team: ${row.name}`, href: `/admin/team/${row.id}` })),
    ...pageImages.map((row) => ({ label: `Page: ${row.title}`, href: `/admin/pages/${row.id}` })),
    ...pageSections.map((row) => ({
      label: `Page sections: ${row.title}`,
      href: `/admin/pages/${row.id}`,
    })),
    ...programmeSections.map((row) => ({
      label: `Programme page sections: ${row.title}`,
      href: `/admin/programmes/${row.id}`,
    })),
    ...partnerLogos.map((row) => ({
      label: `Partner logo: ${row.name}`,
      href: `/admin/partners/${row.id}`,
    })),
    ...(settings ? [{ label: "Default sharing image", href: "/admin/settings/seo" }] : []),
    ...pending.map((row) => ({
      label: `Pending changes (${row.collection})`,
      href: `/admin/${row.collection}/${row.entity_id}`,
    })),
  ];
}
