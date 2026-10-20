import "server-only";
import { ActionError, fieldErrorsOf, parseInput, type SaveOperations } from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { projectInputSchema, readProjectForm, type ProjectInput } from "./input";

function parse(form: FormData): ProjectInput {
  const { input, story } = readProjectForm(form);
  const result = projectInputSchema.safeParse(input);
  const errors = result.success ? {} : fieldErrorsOf(result.error);
  if (story.stray) errors.story ??= 'Start each part of the story with a "## " heading line.';
  if (!result.success || Object.keys(errors).length) {
    throw new ActionError("Check the highlighted fields.", errors);
  }
  return result.data;
}

async function checkReferences(db: Prisma.TransactionClient, input: ProjectInput) {
  const errors: Record<string, string> = {};
  const image = await assertMedia(db, [input.imageId], "IMAGE");
  if (image) errors.imageId = image;
  const gallery = await assertMedia(db, input.galleryIds, "IMAGE");
  if (gallery) errors.galleryIds = gallery;
  if (Object.keys(errors).length) throw new ActionError("Check the highlighted fields.", errors);
}

const toDate = (value: string | null) => (value ? new Date(`${value}T00:00:00Z`) : null);

function scalars(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    ecosystem: input.ecosystem,
    location: input.location,
    period: input.period,
    placeholder: input.placeholder,
    sortOrder: input.sortOrder,
    imageId: input.imageId,
    landscape: { heading: input.landscapeHeading, body: input.landscapeBody },
    story: input.story,
    country: input.country,
    startDate: toDate(input.startDate),
    endDate: toDate(input.endDate),
    operationalStatus: input.operationalStatus,
    objectives: input.objectives,
    activities: input.activities,
    outcomes: input.outcomes,
    references: input.references,
    featured: input.featured,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    noindex: input.noindex,
  };
}

/** Replaces a project's programme, partner and gallery links. */
async function writeRelations(
  db: Prisma.TransactionClient,
  projectId: string,
  input: ProjectInput,
) {
  await db.projectProgramme.deleteMany({ where: { projectId } });
  await db.projectPartner.deleteMany({ where: { projectId } });
  await db.projectGallery.deleteMany({ where: { projectId } });
  const unique = <T>(items: T[]) => [...new Set(items)];
  if (input.programmeIds.length) {
    await db.projectProgramme.createMany({
      data: unique(input.programmeIds).map((programmeId) => ({ projectId, programmeId })),
    });
  }
  if (input.partnerIds.length) {
    await db.projectPartner.createMany({
      data: unique(input.partnerIds).map((partnerId) => ({ projectId, partnerId })),
    });
  }
  if (input.galleryIds.length) {
    await db.projectGallery.createMany({
      data: unique(input.galleryIds).map((mediaId, position) => ({ projectId, mediaId, position })),
    });
  }
}

/** How the project editor creates and updates rows (also applies approved revisions). */
export const projectSave: SaveOperations<ProjectInput> = {
  parse,
  revive: (data) => parseInput(projectInputSchema, data),
  async create(db, input, userId) {
    await checkReferences(db, input);
    const row = await db.project.create({
      data: { ...scalars(input), createdById: userId, updatedById: userId },
    });
    await writeRelations(db, row.id, input);
    return { id: row.id, label: row.title };
  },
  async update(db, id, version, input, userId) {
    await checkReferences(db, input);
    const { count } = await db.project.updateMany({
      where: { id, version },
      data: { ...scalars(input), updatedById: userId, version: { increment: 1 } },
    });
    if (count === 1) await writeRelations(db, id, input);
    return count;
  },
  editPath: (id) => `/admin/projects/${id}`,
};
