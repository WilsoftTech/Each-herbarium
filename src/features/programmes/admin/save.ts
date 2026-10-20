import "server-only";
import {
  ActionError,
  parseInput,
  parseSections,
  sectionImageFields,
  type SaveOperations,
} from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { designedProgrammeSections, isDesignedProgrammeSlug } from "../designed-content";
import { bespokeProgrammeSlugs } from "../schema";
import { programmeInputSchema, readProgrammeForm, type ProgrammeInput } from "./admin";

/**
 * Checks the image and, for a founding programme, its designed page sections
 * (designed-content.ts). Returns the section content to store: validated
 * sections for a founding programme, or an empty object for any other.
 */
async function prepare(
  db: Prisma.TransactionClient,
  slug: string,
  input: ProgrammeInput,
  { requireSections }: { requireSections: boolean },
): Promise<Prisma.InputJsonValue> {
  const errors: Record<string, string> = {};
  const problem = await assertMedia(db, [input.imageId], "IMAGE");
  if (problem) errors.imageId = problem;

  let content: Prisma.InputJsonValue = {};
  // A new record cannot show the sections editor yet: its sections are
  // completed after creation, and publishing refuses them until they are.
  if (isDesignedProgrammeSlug(slug) && (requireSections || input.content !== null)) {
    const spec = designedProgrammeSections[slug];
    const parsed = parseSections(spec, input.content);
    if (parsed.errors) {
      Object.assign(errors, parsed.errors);
    } else {
      for (const image of sectionImageFields(spec, parsed.content)) {
        const missing = await assertMedia(db, [image.id], "IMAGE");
        if (missing) errors[image.name] = missing;
      }
      content = parsed.content;
    }
  }
  if (Object.keys(errors).length) throw new ActionError("Check the highlighted fields.", errors);
  return content;
}

/** How the programme editor creates and updates rows (also applies approved revisions). */
export const programmeSave: SaveOperations<ProgrammeInput> = {
  parse: (data) => parseInput(programmeInputSchema, readProgrammeForm(data)),
  revive: (data) => parseInput(programmeInputSchema, data),
  async create(db, input, userId) {
    const content = await prepare(db, input.slug, input, { requireSections: false });
    const row = await db.programme.create({
      data: { ...input, content, createdById: userId, updatedById: userId },
    });
    return { id: row.id, label: row.title };
  },
  async update(db, id, version, input, userId) {
    // The founding programmes have designed pages at fixed addresses.
    const current = await db.programme.findUnique({ where: { id }, select: { slug: true } });
    if (!current) return 0;
    const fixed = (bespokeProgrammeSlugs as readonly string[]).includes(current.slug);
    if (fixed && current.slug !== input.slug) {
      throw new ActionError("Check the highlighted fields.", {
        slug: "This programme has its own designed page, so its slug cannot change.",
      });
    }
    const content = await prepare(db, current.slug, input, { requireSections: true });
    const { count } = await db.programme.updateMany({
      where: { id, version },
      data: { ...input, content, updatedById: userId, version: { increment: 1 } },
    });
    return count;
  },
  editPath: (id) => `/admin/programmes/${id}`,
};
