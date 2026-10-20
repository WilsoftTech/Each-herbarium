import "server-only";
import { z } from "zod";
import {
  formData,
  readSections,
  sectionImageIds,
  sectionsKeyField,
  type WorkflowCollection,
} from "@/features/cms";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import {
  homeContentSchema,
  landscapeCount,
  movableSectionKeys,
  type HomeContent,
} from "../home-content";
import { isLandingSlug, landingSections } from "../landing-content";
import { pageInclude, readPageRow, toHomePage, toLandingPage, toPage } from "../queries";
import { pageEntry, pageRegistry } from "../registry";

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * What the page editor may change. Managed pages have fixed slugs (each
 * belongs to a route), so only their words, images and SEO change. Fields
 * that apply to one kind of page only (body, content) are checked against
 * the page registry when saving.
 */
export const pageInputSchema = z.object({
  title: z.string().trim().min(1, "Enter a title.").max(200),
  description: z
    .string()
    .trim()
    .min(30, "Write at least 30 characters: search engines show this description.")
    .max(300),
  eyebrow: z.string().trim().min(1, "Enter a short label, such as Policies.").max(80),
  lead: z.string().trim().max(600),
  body: z.string().max(50_000),
  heroImageId: z.string().min(1).nullable(),
  seoTitle: z.string().trim().min(1).max(120).nullable(),
  noindex: z.boolean(),
  /**
   * Designed sections: the homepage's (home-content.ts) or a landing page's
   * (landing-content.ts). Checked against the page's own declaration when saving.
   */
  content: z.unknown().nullable(),
});

export type PageInput = z.infer<typeof pageInputSchema>;

/** Reads the homepage sections editor (fields named content.<path>), or null if absent. */
function readHomeContent(form: FormData): unknown {
  const { text, values, paragraphs } = formData;
  if (!form.has("content.introduction.text")) return null;
  const t = (path: string) => text(form, `content.${path}`);
  const link = (path: string) => ({ label: t(`${path}.label`), href: t(`${path}.href`) });
  const feature = (section: string) => ({
    eyebrow: t(`${section}.eyebrow`),
    title: t(`${section}.title`),
    body: paragraphs(t(`${section}.body`)),
    imageId: t(`${section}.imageId`),
    action: link(`${section}.action`),
  });
  const panel = (index: number) => ({
    eyebrow: t(`involved.panels.${index}.eyebrow`),
    title: t(`involved.panels.${index}.title`),
    description: t(`involved.panels.${index}.description`),
    imageId: t(`involved.panels.${index}.imageId`),
    action: link(`involved.panels.${index}.action`),
  });
  const position = (key: string) => {
    const value = Number(t(`layout.position.${key}`));
    return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
  };

  return {
    hero: {
      primaryAction: link("hero.primaryAction"),
      secondaryAction: link("hero.secondaryAction"),
    },
    introduction: {
      eyebrow: t("introduction.eyebrow"),
      text: t("introduction.text"),
      detail: t("introduction.detail"),
      action: link("introduction.action"),
    },
    programmes: {
      eyebrow: t("programmes.eyebrow"),
      title: t("programmes.title"),
      description: t("programmes.description"),
      linkLabel: t("programmes.linkLabel"),
    },
    heritage: {
      eyebrow: t("heritage.eyebrow"),
      title: t("heritage.title"),
      description: t("heritage.description"),
      statementEyebrow: t("heritage.statementEyebrow"),
      statement: t("heritage.statement"),
      imageId: t("heritage.imageId"),
      landscapes: Array.from({ length: landscapeCount }, (_, index) => ({
        name: t(`heritage.landscapes.${index}.name`),
        title: t(`heritage.landscapes.${index}.title`),
        body: paragraphs(t(`heritage.landscapes.${index}.body`)),
        imageId: t(`heritage.landscapes.${index}.imageId`),
      })),
    },
    projects: {
      eyebrow: t("projects.eyebrow"),
      title: t("projects.title"),
      description: t("projects.description"),
      linkLabel: t("projects.linkLabel"),
    },
    presence: {
      eyebrow: t("presence.eyebrow"),
      title: t("presence.title"),
      text: t("presence.text"),
      start: t("presence.start"),
      region: t("presence.region"),
      sites: t("presence.sites"),
      wider: t("presence.wider"),
    },
    research: feature("research"),
    community: feature("community"),
    involved: {
      eyebrow: t("involved.eyebrow"),
      title: t("involved.title"),
      panels: [panel(0), panel(1)],
    },
    stories: {
      eyebrow: t("stories.eyebrow"),
      title: t("stories.title"),
      linkLabel: t("stories.linkLabel"),
    },
    layout: {
      // The introduction stays first; stable sort keeps the default order for ties.
      order: ["introduction", ...[...movableSectionKeys].sort((a, b) => position(a) - position(b))],
      hidden: values(form, "content.layout.hidden"),
    },
  };
}

/** Reads a landing page's sections editor, or null if absent. */
function readLandingContent(form: FormData): unknown {
  const slug = formData.text(form, sectionsKeyField);
  return isLandingSlug(slug) ? readSections(form, landingSections[slug]) : null;
}

export function readPageForm(form: FormData) {
  const { text, optionalText, checkbox } = formData;
  return {
    title: text(form, "title"),
    description: text(form, "description"),
    eyebrow: text(form, "eyebrow"),
    lead: text(form, "lead"),
    // Keep line structure: the rich-text format depends on it.
    body: (typeof form.get("body") === "string" ? String(form.get("body")) : "").trim(),
    heroImageId: optionalText(form, "heroImageId"),
    seoTitle: optionalText(form, "seoTitle"),
    noindex: checkbox(form, "noindex"),
    content: readHomeContent(form) ?? readLandingContent(form),
  };
}

/**
 * Validates the homepage content. Field errors are keyed by the editor's
 * field names (content.<path>), so each message appears beside its control.
 */
export function parseHomeContent(
  content: unknown,
): { content: HomeContent; errors: null } | { content: null; errors: Record<string, string> } {
  const result = homeContentSchema.safeParse(content);
  if (result.success) return { content: result.data, errors: null };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.map(String);
    const key =
      path[0] === "layout"
        ? "content.layout.hidden"
        : // Landscape text is edited in one textarea per landscape.
          path[1] === "landscapes" && path[3] === "body"
          ? ["content", ...path.slice(0, 4)].join(".")
          : ["content", ...path].join(".");
    errors[key] ??= issue.message;
  }
  return { content: null, errors };
}

export const pageWorkflow: WorkflowCollection = {
  collection: "pages",
  label: "Page",
  async find(db, id) {
    const row = await db.page.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, title: true },
    });
    return row && { ...row, label: row.title };
  },
  updateStatus(db, id, version, change) {
    return db.page.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove() {
    // Never called: managed pages are not deletable (no delete action is exposed).
    return Promise.reject(new Error("Managed pages cannot be deleted."));
  },
  async checkPublishable(db, id) {
    const row = await db.page.findUnique({ where: { id }, include: pageInclude });
    if (!row) return "This page no longer exists.";
    const entry = pageEntry(row.slug);
    if (!entry) return "This page has no route on the website.";
    let page;
    try {
      page = toPage(row);
    } catch {
      return "The page needs a title, a label and a description of at least 30 characters.";
    }
    if ("imageRequired" in entry && !row.heroImageId) {
      return "This page opens with a full-width photograph. Choose one.";
    }
    if (row.heroImageId && !page.image) {
      return "The image has not finished uploading, or needs alt text of at least 20 characters and a caption.";
    }
    if (entry.kind === "prose" && !row.body.trim()) return "Enter the page text.";
    if (entry.kind === "home") {
      const home = await readPageRow(db, { id });
      try {
        const { images } = toHomePage(home!);
        if (
          ![
            images.heritage,
            images.research,
            images.community,
            ...images.landscapes,
            ...images.panels,
          ].every(Boolean)
        ) {
          return "Every homepage image must be uploaded, with alt text of at least 20 characters and a caption.";
        }
      } catch {
        return "The homepage needs its hero image and every section filled in.";
      }
    }
    if (isLandingSlug(row.slug)) {
      const full = await readPageRow(db, { id });
      let landing;
      try {
        landing = toLandingPage(row.slug, full!);
      } catch {
        return "Fill in every section of the page before publishing.";
      }
      const ids = sectionImageIds(landingSections[row.slug], landing.content);
      if (!ids.every((imageId) => landing.images[imageId])) {
        return "Every image on the page must be uploaded, with alt text of at least 20 characters and a caption.";
      }
    }
    return null;
  },
};

/** Every managed page, in registry order, for the admin list. */
export async function listPagesForAdmin() {
  const rows = await getDb().page.findMany({
    select: { id: true, title: true, slug: true, status: true, placeholder: true, updatedAt: true },
    take: 100,
  });
  const order = Object.keys(pageRegistry);
  return rows
    .filter((row) => pageEntry(row.slug))
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
    .map((row) => ({ ...row, title: `${pageEntry(row.slug)!.label}: ${row.title}` }));
}

export function getPageForAdmin(id: string, db: Db = getDb()) {
  return db.page.findUnique({ where: { id } });
}

export type PageForAdmin = NonNullable<Awaited<ReturnType<typeof getPageForAdmin>>>;

/** The id of a managed page, for direct links such as "Edit homepage". */
export async function findPageId(slug: string): Promise<string | null> {
  const row = await getDb().page.findUnique({ where: { slug }, select: { id: true } });
  return row?.id ?? null;
}
