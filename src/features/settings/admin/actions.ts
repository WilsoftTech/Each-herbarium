"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { formData, parseInput, runAction, type ActionState } from "@/features/cms";
import { contentTags } from "@/lib/cache-tags";
import { authorize, requireAdmin } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { getDb, transactionOptions } from "@/services/db";
import { socialLinkSchema } from "../schema";

const settingsInputSchema = z.object({
  contactEmail: z.email("Enter a valid email address.").max(254).nullable(),
  phone: z.string().max(60).nullable(),
  postalAddress: z.string().max(500).nullable(),
  officeHours: z.string().max(200).nullable(),
  socialLinks: z.array(socialLinkSchema).max(10, "List at most 10 accounts."),
});

/** "Label | https://…" per line. */
function readSocialLinks(source: string) {
  return formData.lines(source).map((line) => {
    const [label = "", url = ""] = line.split("|").map((part) => part.trim());
    return { label, url };
  });
}

/** Saves the organisation's contact details. Administrators only; live at once. */
export async function saveSettings(_state: ActionState, form: FormData): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "settings:edit");
    const { optionalText, text } = formData;
    const input = parseInput(settingsInputSchema, {
      contactEmail: optionalText(form, "contactEmail"),
      phone: optionalText(form, "phone"),
      postalAddress: optionalText(form, "postalAddress"),
      officeHours: optionalText(form, "officeHours"),
      socialLinks: readSocialLinks(text(form, "socialLinks")),
    });

    const db = getDb();
    await db.$transaction(async (tx) => {
      await tx.siteSettings.upsert({
        where: { id: 1 },
        update: { ...input, updatedById: session.userId },
        create: { id: 1, ...input, updatedById: session.userId },
      });
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: "settings.update",
        entityType: "settings",
        entityId: "1",
        summary: "Updated site settings",
      });
    }, transactionOptions);

    updateTag(contentTags.settings);
    return { ok: true, message: "Settings saved. The website shows them now." };
  });
}
