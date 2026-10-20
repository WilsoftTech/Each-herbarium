import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { media, type MediaAsset } from "@/config/media";
import { createScriptClient, databaseHost } from "../scripts/script-env";
import { seedArticles } from "./seed/articles";
import { seedPages } from "./seed/pages";
import { seedPartners } from "./seed/partners";
import { seedProgrammes } from "./seed/programmes";
import { seedProjects } from "./seed/projects";

/**
 * Migrates the M03 static content into the CMS (ADR 0007).
 *
 * Idempotent and non-destructive: rows are created only when missing, matched
 * by slug or storage key. Existing rows are never updated or deleted, so
 * running it again cannot overwrite editorial changes.
 *
 * Run: npm run db:seed (also run by `prisma migrate reset` in development).
 */
const db = createScriptClient();
const now = new Date();

async function seedMedia(): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  for (const asset of Object.values(media) as MediaAsset[]) {
    const file = readFileSync(path.join("public", asset.src));
    const row = await db.mediaAsset.upsert({
      where: { key: asset.src },
      update: {},
      create: {
        storage: "STATIC",
        key: asset.src,
        kind: "IMAGE",
        status: "READY",
        mimeType: "image/jpeg",
        byteSize: file.byteLength,
        fileName: path.basename(asset.src),
        checksum: createHash("sha256").update(file).digest("hex"),
        width: asset.width,
        height: asset.height,
        alt: asset.alt,
        caption: asset.caption,
        creditAuthor: asset.credit.author,
        license: asset.credit.license,
        licenseUrl: asset.credit.licenseUrl,
        sourceUrl: asset.credit.sourceUrl,
      },
    });
    ids.set(asset.src, row.id);
  }
  return ids;
}

function mediaId(ids: Map<string, string>, asset: MediaAsset): string {
  const id = ids.get(asset.src);
  if (!id) throw new Error(`Seed image is not in the media registry: ${asset.src}`);
  return id;
}

async function main() {
  console.log(`Seeding ${databaseHost()} (create-only; existing rows are left untouched)`);
  const mediaIds = await seedMedia();
  const published = { status: "PUBLISHED" as const, publishedAt: now };

  for (const [index, programme] of seedProgrammes.entries()) {
    await db.programme.upsert({
      where: { slug: programme.slug },
      update: {},
      create: {
        ...published,
        slug: programme.slug,
        sortOrder: index,
        title: programme.title,
        summary: programme.summary,
        intro: programme.intro,
        imageId: mediaId(mediaIds, programme.image),
      },
    });
  }

  for (const [index, partner] of seedPartners.entries()) {
    await db.partner.upsert({
      where: { slug: partner.slug },
      update: {},
      create: { ...published, ...partner, sortOrder: index },
    });
  }

  for (const [index, project] of seedProjects.entries()) {
    const exists = await db.project.findUnique({
      where: { slug: project.slug },
      select: { id: true },
    });
    if (exists) continue;
    await db.project.create({
      data: {
        ...published,
        slug: project.slug,
        placeholder: project.placeholder,
        sortOrder: index,
        title: project.title,
        summary: project.summary,
        ecosystem: project.ecosystem,
        location: project.location,
        period: project.period,
        imageId: mediaId(mediaIds, project.image),
        landscape: project.landscape,
        story: [...project.story],
        programmes: {
          create: project.programmes.map((slug) => ({ programme: { connect: { slug } } })),
        },
        partners: {
          create: project.partners.map((slug) => ({ partner: { connect: { slug } } })),
        },
        gallery: {
          create: project.gallery.map((image, position) => ({
            position,
            media: { connect: { id: mediaId(mediaIds, image) } },
          })),
        },
      },
    });
  }

  for (const article of seedArticles) {
    await db.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...published,
        slug: article.slug,
        placeholder: article.placeholder,
        type: article.type,
        title: article.title,
        summary: article.summary,
        publishedOn: article.publishedOn ? new Date(article.publishedOn) : null,
        authors: [...article.authors],
        body: [...article.body],
        imageId: article.image ? mediaId(mediaIds, article.image) : null,
      },
    });
  }

  for (const page of seedPages) {
    await db.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: { ...published, ...page },
    });
  }

  await db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  await db.auditEvent.create({
    data: {
      action: "system.seed",
      entityType: "system",
      summary: "Initial content seeded (create-only)",
    },
  });

  const counts = {
    media: await db.mediaAsset.count(),
    programmes: await db.programme.count(),
    projects: await db.project.count(),
    articles: await db.article.count(),
    partners: await db.partner.count(),
    pages: await db.page.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
