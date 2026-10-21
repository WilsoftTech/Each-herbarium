import { pendingContent } from "../src/content/pending";
import proposals from "../docs/content/cms-review-proposals.json";
import type { Prisma } from "../src/generated/prisma/client";
import { mergeReviewChanges } from "../prisma/seed/review-content";
import { assertContentReviewDevelopment, createScriptClient } from "./script-env";

/**
 * M04 editorial seed: stage internal copy proposals as DRAFT revisions only.
 * Never runs as part of db:seed, never publishes, never replaces pending work.
 * Approval still uses the existing CMS validation and revision workflow.
 * Run: npx tsx scripts/prepare-content-review.ts (dev branch only).
 */
async function main() {
  if (pendingContent.missionStatement.kind === "approved") {
    console.log(
      "This review cycle is approved. Use scripts/apply-approved-content.ts; historical drafts will not be restaged.",
    );
    return;
  }
  assertContentReviewDevelopment();
  const db = createScriptClient();
  const groups = new Map<
    string,
    { collection: string; slug: string; changes: Prisma.InputJsonObject }
  >();
  for (const proposal of proposals) {
    if (!Object.keys(proposal.changes).length) continue;
    const key = `${proposal.collection}:${proposal.slug}`;
    const previous = groups.get(key);
    groups.set(key, {
      collection: proposal.collection,
      slug: proposal.slug,
      changes: mergeReviewChanges(
        previous?.changes ?? {},
        proposal.changes as Prisma.InputJsonObject,
      ),
    });
  }
  try {
    for (const { collection, slug, changes } of groups.values()) {
      const result = await db.$transaction(
        async (tx) => {
          const row =
            collection === "pages"
              ? await tx.page.findUnique({ where: { slug } })
              : await tx.programme.findUnique({ where: { slug } });
          if (!row || row.status !== "PUBLISHED") return "skipped (not published or absent)";
          const pending = await tx.contentRevision.findUnique({
            where: { collection_entityId: { collection, entityId: row.id } },
          });
          if (pending) return "skipped (existing pending revision preserved)";
          // Exactly the editor input fields; retain all current media and editorial values.
          const current: Prisma.InputJsonObject =
            "lead" in row
              ? {
                  title: row.title,
                  description: row.description,
                  eyebrow: row.eyebrow,
                  lead: row.lead,
                  body: row.body,
                  heroImageId: row.heroImageId,
                  seoTitle: row.seoTitle,
                  noindex: row.noindex,
                  content: row.content as Prisma.InputJsonObject,
                }
              : {
                  title: row.title,
                  slug: row.slug,
                  summary: row.summary,
                  intro: row.intro,
                  imageId: row.imageId,
                  sortOrder: row.sortOrder,
                  placeholder: row.placeholder,
                  category: row.category,
                  objectives: row.objectives,
                  body: row.body,
                  featured: row.featured,
                  seoTitle: row.seoTitle,
                  seoDescription: row.seoDescription,
                  noindex: row.noindex,
                  content: row.content as Prisma.InputJsonObject,
                };
          const { count } = await tx.contentRevision.createMany({
            data: [
              {
                collection,
                entityId: row.id,
                baseVersion: row.version,
                status: "DRAFT",
                data: mergeReviewChanges(current, changes),
              },
            ],
            skipDuplicates: true,
          });
          if (!count) return "skipped (concurrent pending revision preserved)";
          await tx.auditEvent.create({
            data: {
              action: "system.content-review-prepare",
              entityType: collection,
              entityId: row.id,
              summary: `Prepared client-review copy for ${slug}; live content unchanged`,
            },
          });
          return "DRAFT revision prepared; live content unchanged";
        },
        { maxWait: 10_000, timeout: 20_000 },
      );
      console.log(`${collection}/${slug}: ${result}`);
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const name = error instanceof Error ? error.name : "UnknownError";
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    /^[A-Z0-9_]+$/.test(error.code)
      ? error.code
      : "no code";
  console.error(`Preparation error: ${name} (${code}).`);
  console.error(
    "Content review preparation failed. Check dev branch configuration and database access; no publication was attempted.",
  );
  process.exitCode = 1;
});
