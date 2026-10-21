import { registerHooks } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";
import changes from "../docs/content/approved-content.json";
import originalProposals from "../docs/content/cms-review-proposals.json";
import { starterProjects } from "../prisma/seed/starter-projects";
import { learningGuides } from "../prisma/seed/learning-guides";
import { mergeReviewChanges } from "../prisma/seed/review-content";
import { approvedFooterNote } from "../prisma/seed/approved-content";
import type { Prisma } from "../src/generated/prisma/client";
import type { SaveOperations, WorkflowCollection } from "../src/features/cms/content-workflow";
import { assertContentReviewDevelopment, createScriptClient } from "./script-env";

/** Explicit owner-authorised dev publication. Production is refused. Rebuild/restart afterwards. */
async function main() {
  assertContentReviewDevelopment();
  // Reuse server adapters in this Node CLI without importing React's RSC-only build.
  // This hook is local to this process; the app's server-only boundary is unchanged.
  registerHooks({
    resolve(specifier, context, next) {
      return specifier === "server-only"
        ? {
            url: pathToFileURL(path.resolve("node_modules/server-only/empty.js")).href,
            shortCircuit: true,
          }
        : next(specifier, context);
    },
  });
  const [
    { pageSave },
    { pageWorkflow },
    { programmeSave },
    { programmeWorkflow },
    { projectSave },
    { projectWorkflow },
    { articleSave },
    { articleWorkflow },
  ] = await Promise.all([
    import("../src/features/pages/admin/save"),
    import("../src/features/pages/admin/admin"),
    import("../src/features/programmes/admin/save"),
    import("../src/features/programmes/admin/admin"),
    import("../src/features/projects/admin/save"),
    import("../src/features/projects/admin/workflow"),
    import("../src/features/resources/admin/save"),
    import("../src/features/resources/admin/admin"),
  ]);
  const db = createScriptClient();
  const options = { maxWait: 10_000, timeout: 30_000 };
  const authority =
    "Client approval reported by project owner; automated dev implementation, excluding contacts and locations";
  try {
    // Like the normal seed, an owner-authorised CLI operation has a system
    // actor. Do not impersonate staff or create an administrator identity.
    const operatorId = null;
    const audit = (tx: Prisma.TransactionClient, collection: string, id: string, action: string) =>
      tx.auditEvent.create({
        data: {
          actorId: operatorId,
          action: `${collection}.${action}`,
          entityType: collection,
          entityId: id,
          summary: authority,
          metadata: { automation: "apply-approved-content", authority, production: false },
        },
      });
    const inputFields = {
      pages: [
        "title",
        "description",
        "eyebrow",
        "lead",
        "body",
        "heroImageId",
        "seoTitle",
        "noindex",
        "content",
      ],
      programmes: [
        "title",
        "slug",
        "summary",
        "intro",
        "imageId",
        "sortOrder",
        "placeholder",
        "category",
        "objectives",
        "body",
        "featured",
        "seoTitle",
        "seoDescription",
        "noindex",
        "content",
      ],
    };
    async function applyRevision<T>(
      entry: (typeof changes)[number],
      workflow: WorkflowCollection,
      ops: SaveOperations<T>,
    ) {
      return db.$transaction(async (tx) => {
        const row =
          entry.collection === "pages"
            ? await tx.page.findUnique({ where: { slug: entry.slug } })
            : await tx.programme.findUnique({ where: { slug: entry.slug } });
        if (!row || row.status !== "PUBLISHED")
          throw new Error(`Expected published ${entry.collection}/${entry.slug}.`);
        const fields = entry.collection === "pages" ? inputFields.pages : inputFields.programmes;
        const current = Object.fromEntries(
          fields.map((key) => [key, Reflect.get(row, key)]),
        ) as Prisma.InputJsonObject;
        const data = mergeReviewChanges(current, entry.changes as Prisma.InputJsonObject);
        const stored = await tx.contentRevision.findUnique({
          where: { collection_entityId: { collection: entry.collection, entityId: row.id } },
        });
        if (stored) {
          let original: Prisma.InputJsonObject = {};
          for (const proposal of originalProposals.filter(
            (item) => item.collection === entry.collection && item.slug === entry.slug,
          )) {
            original = mergeReviewChanges(original, proposal.changes as Prisma.InputJsonObject);
          }
          if (
            stored.baseVersion !== row.version ||
            stored.updatedById ||
            stored.status !== "DRAFT" ||
            !isDeepStrictEqual(stored.data, mergeReviewChanges(current, original))
          ) {
            throw new Error(
              `Preserved unrelated pending changes for ${entry.collection}/${entry.slug}; reconcile in the CMS.`,
            );
          }
        }
        if (!stored && isDeepStrictEqual(current, data)) return "already current";
        const input = ops.revive(data);
        const revision =
          stored ??
          (await tx.contentRevision.create({
            data: {
              collection: entry.collection,
              entityId: row.id,
              baseVersion: row.version,
              status: "DRAFT",
              data,
            },
          }));
        await tx.contentRevision.update({
          where: { id: revision.id },
          data: {
            data,
            status: "IN_REVIEW",
            submittedAt: new Date(),
            updatedById: operatorId,
            version: { increment: 1 },
          },
        });
        await audit(tx, entry.collection, row.id, "revision-submit");
        if ((await ops.update(tx, row.id, row.version, input, operatorId)) !== 1)
          throw new Error("Concurrent editorial change; nothing applied.");
        const problem = await workflow.checkPublishable(tx, row.id);
        if (problem) throw new Error(problem);
        await tx.contentRevision.delete({ where: { id: revision.id } });
        await audit(tx, entry.collection, row.id, "revision-approve");
        return "approved revision applied";
      }, options);
    }
    for (const entry of changes) {
      const result =
        entry.collection === "pages"
          ? await applyRevision(entry, pageWorkflow, pageSave)
          : await applyRevision(entry, programmeWorkflow, programmeSave);
      console.log(`${entry.collection}/${entry.slug}: ${result}`);
    }
    const media = new Map(
      (
        await db.mediaAsset.findMany({
          where: { storage: "STATIC", status: "READY" },
          select: { key: true, id: true },
        })
      ).map((row) => [row.key, row.id]),
    );
    const programmes = new Map(
      (
        await db.programme.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, id: true },
        })
      ).map((row) => [row.slug, row.id]),
    );
    const mediaId = (src: string) => {
      const id = media.get(src);
      if (!id) throw new Error(`Missing licensed media: ${src}`);
      return id;
    };
    async function publishNew<T>(
      workflow: WorkflowCollection,
      ops: SaveOperations<T>,
      raw: unknown,
    ) {
      return db.$transaction(async (tx) => {
        const created = await ops.create(tx, ops.revive(raw), operatorId);
        await audit(tx, workflow.collection, created.id, "create");
        const submitted = await workflow.updateStatus(tx, created.id, 1, {
          status: "IN_REVIEW",
          updatedById: operatorId,
        });
        if (submitted.count !== 1) throw new Error("Concurrent submission change.");
        await audit(tx, workflow.collection, created.id, "submit");
        const problem = await workflow.checkPublishable(tx, created.id);
        if (problem) throw new Error(problem);
        const result = await workflow.updateStatus(tx, created.id, 2, {
          status: "PUBLISHED",
          publishedAt: new Date(),
          updatedById: operatorId,
        });
        if (result.count !== 1) throw new Error("Concurrent publication change.");
        await audit(tx, workflow.collection, created.id, "approve");
      }, options);
    }
    for (const [index, plan] of starterProjects.entries()) {
      if (await db.project.findUnique({ where: { slug: plan.slug }, select: { id: true } })) {
        console.log(`projects/${plan.slug}: existing record preserved`);
        continue;
      }
      await publishNew(projectWorkflow, projectSave, {
        ...plan,
        sortOrder: index,
        imageId: mediaId(plan.image.src),
        galleryIds: [],
        partnerIds: [],
        programmeIds: plan.programmes.map((slug) => {
          const id = programmes.get(slug);
          if (!id) throw new Error(`Missing programme: ${slug}`);
          return id;
        }),
        landscapeHeading: plan.landscape.heading,
        landscapeBody: plan.landscape.body,
        country: null,
        startDate: null,
        endDate: null,
        seoTitle: null,
        seoDescription: null,
        noindex: false,
      });
      console.log(`projects/${plan.slug}: published as PLANNED; no outcomes or location`);
    }
    for (const guide of learningGuides) {
      if (await db.article.findUnique({ where: { slug: guide.slug }, select: { id: true } })) {
        console.log(`articles/${guide.slug}: existing record preserved`);
        continue;
      }
      await publishNew(articleWorkflow, articleSave, {
        ...guide,
        imageId: guide.image ? mediaId(guide.image.src) : null,
        documentId: null,
        featured: true,
        seoTitle: null,
        seoDescription: null,
        noindex: false,
      });
      console.log(`articles/${guide.slug}: published educational website guide`);
    }
    await db.$transaction(async (tx) => {
      const result = await tx.siteSettings.updateMany({
        where: {
          id: 1,
          footerNote:
            "Photography is credited alongside each image. Some content is awaiting approval and is marked on the page.",
        },
        data: { footerNote: approvedFooterNote },
      });
      if (result.count) await audit(tx, "settings", "1", "footer-approved");
    }, options);
    console.log(
      "Approved content applied on dev. Rebuild/restart to refresh public caches. Contact and location settings were not changed.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Approved content application failed.");
  process.exitCode = 1;
});
