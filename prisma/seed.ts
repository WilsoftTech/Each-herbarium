import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { media, type MediaAsset } from "@/config/media";
import type { Prisma } from "@/generated/prisma/client";
import { createScriptClient, databaseHost } from "../scripts/script-env";
import { seedArticles } from "./seed/articles";
import { approvedFooterNote } from "./seed/approved-content";
import { fillMissing } from "./seed/fill-content";
import { seedLandingContent } from "./seed/landing-content";
import { seedHomeContent, seedLandingPages } from "./seed/landing-pages";
import { seedPages } from "./seed/pages";
import { seedPartners } from "./seed/partners";
import { seedProgrammeContent } from "./seed/programme-content";
import { seedProgrammes } from "./seed/programmes";
import { seedProjects } from "./seed/projects";

/**
 * Migrates the M03 static content into the CMS (ADR 0007).
 *
 * Idempotent and non-destructive: rows are created only when missing, matched
 * by slug or storage key. Existing rows are never deleted and their values
 * never overwritten. The one update fills designed section content that a
 * release added and a row (or its pending revision) does not have yet
 * (fillDesignedContent, ADR 0013): only absent keys are added, so running it
 * again cannot overwrite editorial changes.
 *
 * Run: npm run db:seed (also run by `prisma migrate reset` in development).
 */
const db = createScriptClient();
const now = new Date();

async function seedMedia(): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  // Independent rows: upserted concurrently, as each is a round trip to a remote database.
  await Promise.all(
    (Object.values(media) as MediaAsset[]).map(async (asset) => {
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
    }),
  );
  return ids;
}

function mediaId(ids: Map<string, string>, asset: MediaAsset): string {
  const id = ids.get(asset.src);
  if (!id) throw new Error(`Seed image is not in the media registry: ${asset.src}`);
  return id;
}

type DesignedContent = Record<string, Prisma.InputJsonObject>;

/**
 * Adds designed sections that existing rows and their pending revisions do
 * not have yet. Values that exist are never replaced (fillMissing).
 */
async function fillDesignedContent(pages: DesignedContent, programmes: DesignedContent) {
  const filled: string[] = [];
  // Three reads in total, then writes only where something is missing.
  const [pageRows, programmeRows] = await Promise.all([
    db.page.findMany({
      where: { slug: { in: Object.keys(pages) } },
      select: { id: true, slug: true, content: true },
    }),
    db.programme.findMany({
      where: { slug: { in: Object.keys(programmes) } },
      select: { id: true, slug: true, content: true },
    }),
  ]);
  const rows = [
    ...pageRows.map((row) => ({ ...row, collection: "pages" as const, defaults: pages[row.slug] })),
    ...programmeRows.map((row) => ({
      ...row,
      collection: "programmes" as const,
      defaults: programmes[row.slug],
    })),
  ];
  const revisions = await db.contentRevision.findMany({
    where: {
      OR: [
        { collection: "pages", entityId: { in: pageRows.map((row) => row.id) } },
        { collection: "programmes", entityId: { in: programmeRows.map((row) => row.id) } },
      ],
    },
    select: { id: true, collection: true, entityId: true, data: true },
  });

  for (const row of rows) {
    const label = row.collection === "pages" ? "page" : "programme";
    const content = fillMissing(row.content, row.defaults) as Prisma.InputJsonObject;
    if (!isDeepStrictEqual(content, row.content)) {
      if (row.collection === "pages") {
        await db.page.update({ where: { id: row.id }, data: { content } });
      } else {
        await db.programme.update({ where: { id: row.id }, data: { content } });
      }
      filled.push(`${label} ${row.slug}`);
    }

    const revision = revisions.find(
      (candidate) => candidate.collection === row.collection && candidate.entityId === row.id,
    );
    const data = revision?.data;
    if (!revision || typeof data !== "object" || data === null || Array.isArray(data)) continue;
    const revised = fillMissing(data.content, content) as Prisma.InputJsonValue;
    if (isDeepStrictEqual(revised, data.content)) continue;
    await db.contentRevision.update({
      where: { id: revision.id },
      data: { data: { ...data, content: revised } as Prisma.InputJsonObject },
    });
    filled.push(`${label} ${row.slug} (pending changes)`);
  }
  return filled;
}

async function main() {
  console.log(`Seeding ${databaseHost()} (create-only; existing values are never overwritten)`);
  const mediaIds = await seedMedia();
  const published = { status: "PUBLISHED" as const, publishedAt: now };
  const imageId = (asset: MediaAsset) => mediaId(mediaIds, asset);
  const pageContent: DesignedContent = {
    home: seedHomeContent(imageId),
    ...seedLandingContent(imageId),
  };
  const programmeContent: DesignedContent = seedProgrammeContent(imageId);

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
        seoDescription: programme.seoDescription ?? null,
        imageId: mediaId(mediaIds, programme.image),
        content: programmeContent[programme.slug] ?? {},
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
        operationalStatus: project.operationalStatus ?? null,
        objectives: [...(project.objectives ?? [])],
        activities: [...(project.activities ?? [])],
        outcomes: [...(project.outcomes ?? [])],
        references: [...(project.references ?? [])],
        featured: project.featured ?? false,
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
        references: [...(article.references ?? [])],
        imageId: article.image ? mediaId(mediaIds, article.image) : null,
      },
    });
  }

  await Promise.all(
    [...seedPages, ...seedLandingPages].map(({ heroImage, ...page }) =>
      db.page.upsert({
        where: { slug: page.slug },
        update: {},
        create: {
          ...published,
          ...page,
          heroImageId: heroImage ? mediaId(mediaIds, heroImage) : null,
          content: pageContent[page.slug] ?? {},
        },
      }),
    ),
  );

  await db.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, footerNote: approvedFooterNote },
  });

  const filled = await fillDesignedContent(pageContent, programmeContent);
  if (filled.length) {
    console.log(`Filled missing designed sections: ${filled.join(", ")}`);
    await db.auditEvent.create({
      data: {
        action: "system.seed",
        entityType: "system",
        summary: `Filled missing designed sections (${filled.length})`,
        metadata: { filled },
      },
    });
  }

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
