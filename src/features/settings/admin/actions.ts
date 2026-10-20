"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import {
  navigationLinks,
  navigationOverridesSchema,
  primaryNavigation,
  type NavigationOverrides,
  type NavItem,
} from "@/config/navigation";
import { ActionError, formData, parseInput, runAction, type ActionState } from "@/features/cms";
import { assertMedia } from "@/features/media";
import type { Prisma } from "@/generated/prisma/client";
import { contentTags } from "@/lib/cache-tags";
import { authorize, requireAdmin } from "@/services/admin-auth";
import { recordAudit } from "@/services/audit";
import { getDb, transactionOptions } from "@/services/db";
import { socialLinkSchema } from "../schema";

const { text, optionalText, checkbox, lines } = formData;

/** "Label | https://…" per line. */
function readSocialLinks(source: string) {
  return lines(source).map((line) => {
    const [label = "", url = ""] = line.split("|").map((part) => part.trim());
    return { label, url };
  });
}

const contactSchema = z.object({
  contactEmail: z.email("Enter a valid email address.").max(254).nullable(),
  phone: z.string().max(60).nullable(),
  postalAddress: z.string().max(500).nullable(),
  locationText: z.string().max(200).nullable(),
  officeHours: z.string().max(200).nullable(),
  socialLinks: z.array(socialLinkSchema).max(10, "List at most 10 accounts."),
});

const brandingSchema = z.object({
  tagline: z
    .string()
    .min(20, "Write at least 20 characters: this sentence describes EACH everywhere.")
    .max(300),
});

const footerSchema = z.object({
  footerStatement: z.string().min(1, "Enter the closing statement.").max(160),
  footerNote: z.string().max(400),
  copyrightText: z.string().max(160),
});

const seoSchema = z.object({ socialImageId: z.string().min(1).nullable() });

/** Reads the navigation editor: fields named nav.item.<id>.<field> and nav.link.<href>.<field>. */
function readNavigation(form: FormData): NavigationOverrides {
  const overrides: NavigationOverrides = { items: {}, links: {} };
  const changed = (value: string, original: string | undefined) =>
    value && value !== original ? value : undefined;
  const position = (name: string, natural: number) => {
    const raw = text(form, name);
    if (!raw) return undefined;
    const value = Number(raw);
    // Not a whole number: kept so validation reports it beside the field.
    if (!Number.isInteger(value)) return value;
    return value !== natural ? value : undefined;
  };

  (primaryNavigation as readonly NavItem[]).forEach((item, index) => {
    const entry = {
      label: changed(text(form, `nav.item.${item.id}.label`), item.label),
      summary: changed(text(form, `nav.item.${item.id}.summary`), item.summary),
      order: position(`nav.item.${item.id}.order`, index + 1),
    };
    if (Object.values(entry).some((value) => value !== undefined)) {
      overrides.items[item.id] = entry;
    }
  });
  for (const { group, link } of navigationLinks()) {
    const natural = group.links.indexOf(link) + 1;
    const entry = {
      label: changed(text(form, `nav.link.${link.href}.label`), link.label),
      description: changed(text(form, `nav.link.${link.href}.description`), link.description),
      order: position(`nav.link.${link.href}.order`, natural),
      hidden: checkbox(form, `nav.link.${link.href}.hidden`) || undefined,
    };
    if (Object.values(entry).some((value) => value !== undefined)) {
      overrides.links[link.href] = entry;
    }
  }
  return overrides;
}

/** Field errors keyed by the navigation editor's field names. */
function parseNavigation(input: NavigationOverrides): NavigationOverrides {
  const result = navigationOverridesSchema.safeParse(input);
  if (result.success) return result.data;
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const [kind, key, field] = issue.path.map(String);
    errors[`nav.${kind === "items" ? "item" : "link"}.${key}.${field}`] ??=
      field === "order" ? "Use a whole number from 1 to 50." : issue.message;
  }
  throw new ActionError("Check the highlighted fields.", errors);
}

type Section = "contact" | "branding" | "footer" | "seo" | "navigation";

const sectionLabel: Record<Section, string> = {
  contact: "contact details",
  branding: "branding text",
  footer: "footer",
  seo: "search defaults",
  navigation: "navigation",
};

async function readSection(
  section: Section,
  form: FormData,
  db: Prisma.TransactionClient,
): Promise<Prisma.SiteSettingsUncheckedUpdateInput> {
  switch (section) {
    case "contact":
      return parseInput(contactSchema, {
        contactEmail: optionalText(form, "contactEmail"),
        phone: optionalText(form, "phone"),
        postalAddress: optionalText(form, "postalAddress"),
        locationText: optionalText(form, "locationText"),
        officeHours: optionalText(form, "officeHours"),
        socialLinks: readSocialLinks(text(form, "socialLinks")),
      });
    case "branding":
      return parseInput(brandingSchema, { tagline: text(form, "tagline") });
    case "footer":
      return parseInput(footerSchema, {
        footerStatement: text(form, "footerStatement"),
        footerNote: text(form, "footerNote"),
        copyrightText: text(form, "copyrightText"),
      });
    case "seo": {
      const input = parseInput(seoSchema, { socialImageId: optionalText(form, "socialImageId") });
      const problem = input.socialImageId
        ? await assertMedia(db, [input.socialImageId], "IMAGE")
        : null;
      if (problem)
        throw new ActionError("Check the highlighted fields.", { socialImageId: problem });
      return input;
    }
    case "navigation":
      return { navigation: parseNavigation(readNavigation(form)) };
  }
}

function isSection(value: string): value is Section {
  return Object.hasOwn(sectionLabel, value);
}

/**
 * Saves one section of the site settings. Administrators only; changes are
 * organisation-wide and appear on the website at once (not editorial
 * content), so every save is audited.
 */
export async function saveSettings(_state: ActionState, form: FormData): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireAdmin();
    authorize(session, "settings:edit");
    const section = text(form, "section") || "contact";
    if (!isSection(section)) throw new ActionError("Unknown settings section.");

    await getDb().$transaction(async (tx) => {
      const data = await readSection(section, form, tx);
      await tx.siteSettings.upsert({
        where: { id: 1 },
        update: { ...data, updatedById: session.userId },
        create: {
          id: 1,
          ...(data as Prisma.SiteSettingsUncheckedCreateInput),
          updatedById: session.userId,
        },
      });
      await recordAudit(tx, {
        actorId: session.userId,
        actorEmail: session.email,
        action: `settings.${section}`,
        entityType: "settings",
        entityId: "1",
        summary: `Updated site ${sectionLabel[section]}`,
      });
    }, transactionOptions);

    updateTag(contentTags.settings);
    return { ok: true, message: "Settings saved. The website shows them now." };
  });
}
