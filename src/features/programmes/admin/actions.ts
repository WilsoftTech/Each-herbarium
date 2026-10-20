"use server";

import { redirect } from "next/navigation";
import {
  ActionError,
  applyDelete,
  applySave,
  applyTransition,
  parseInput,
  type ActionState,
} from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { bespokeProgrammeSlugs } from "../schema";
import {
  programmeInputSchema,
  programmeWorkflow,
  readProgrammeForm,
  type ProgrammeInput,
} from "./admin";

async function checkImage(db: Prisma.TransactionClient, input: ProgrammeInput) {
  const problem = await assertMedia(db, [input.imageId], "IMAGE");
  if (problem) throw new ActionError("Check the highlighted fields.", { imageId: problem });
}

export async function saveProgramme(_state: ActionState, form: FormData): Promise<ActionState> {
  return applySave(programmeWorkflow, form, {
    parse: (data) => parseInput(programmeInputSchema, readProgrammeForm(data)),
    async create(db, input, userId) {
      await checkImage(db, input);
      const row = await db.programme.create({
        data: { ...input, createdById: userId, updatedById: userId },
      });
      return { id: row.id, label: row.title };
    },
    async update(db, id, version, input, userId) {
      await checkImage(db, input);
      // The founding programmes have designed pages at fixed addresses.
      const current = await db.programme.findUnique({ where: { id }, select: { slug: true } });
      const fixed = (bespokeProgrammeSlugs as readonly string[]).includes(current?.slug ?? "");
      if (fixed && current?.slug !== input.slug) {
        throw new ActionError("Check the highlighted fields.", {
          slug: "This programme has its own designed page, so its slug cannot change.",
        });
      }
      const { count } = await db.programme.updateMany({
        where: { id, version },
        data: { ...input, updatedById: userId, version: { increment: 1 } },
      });
      return count;
    },
    editPath: (id) => `/admin/programmes/${id}`,
  });
}

export async function transitionProgramme(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  return applyTransition(programmeWorkflow, form);
}

export async function deleteProgramme(_state: ActionState, form: FormData): Promise<ActionState> {
  return applyDelete(programmeWorkflow, form, () => redirect("/admin/programmes?deleted=1"));
}
