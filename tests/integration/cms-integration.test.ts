import { readFileSync } from "node:fs";
import { updateTag } from "next/cache";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { listPendingRevisions, summariseOperations } from "@/features/cms";
import { deleteMedia, findMediaUsage, uploadMedia } from "@/features/media";
import {
  getHomePage,
  getPage,
  homeContentSchema,
  listIndexablePages,
  savePage,
  transitionPage,
  type HomeContent,
} from "@/features/pages";
import { getProjectPreview, saveProject, transitionProject } from "@/features/projects";
import { getNavigation, getSiteChrome, getSiteSettings, saveSettings } from "@/features/settings";
import type { Page as PageRow } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import {
  anyImageId,
  createUser,
  expectRedirect,
  form,
  idle,
  signInAs,
  uniqueSlug,
  type TestUser,
} from "./helpers";

// Object storage is replaced by an in-memory double (see media.test.ts).
vi.mock("@/services/storage", () => {
  const objects = new Map<string, Uint8Array>();
  return {
    putObject: vi.fn(async (key: string, body: Uint8Array) => {
      objects.set(key, body);
    }),
    getObject: vi.fn(async () => null),
    deleteObject: vi.fn(async (key: string) => {
      objects.delete(key);
    }),
    StorageError: class StorageError extends Error {},
  };
});

let admin: TestUser;
let reviewer: TestUser;
let editor: TestUser;

beforeAll(async () => {
  admin = await createUser("admin");
  reviewer = await createUser("reviewer");
  editor = await createUser("editor");
});

beforeEach(() => {
  vi.mocked(updateTag).mockClear();
});

/** The page editor's fields, as the form posts them (content.<path> for the homepage). */
function pageFields(page: PageRow, overrides: Record<string, string | boolean> = {}) {
  const fields: Record<string, string | boolean | string[]> = {
    id: page.id,
    version: String(page.version),
    title: page.title,
    eyebrow: page.eyebrow,
    lead: page.lead,
    description: page.description,
    body: page.body,
    heroImageId: page.heroImageId ?? "",
    seoTitle: page.seoTitle ?? "",
    noindex: page.noindex,
  };
  if (page.slug === "home") {
    const content = homeContentSchema.parse(page.content) as HomeContent;
    const flatten = (value: unknown, path: string) => {
      if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        fields[path] = (value as string[]).join("\n\n");
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => flatten(item, `${path}.${index}`));
      } else if (value && typeof value === "object") {
        for (const [key, child] of Object.entries(value)) flatten(child, `${path}.${key}`);
      } else {
        fields[path] = String(value);
      }
    };
    const { layout, ...sections } = content;
    flatten(sections, "content");
    layout.order.slice(1).forEach((key, index) => {
      fields[`content.layout.position.${key}`] = String(index + 1);
    });
    fields["content.layout.hidden"] = layout.hidden;
  }
  return form({ ...fields, ...overrides });
}

async function pageBySlug(slug: string) {
  return getDb().page.findUniqueOrThrow({ where: { slug } });
}

async function revisionOf(collection: string, entityId: string) {
  return getDb().contentRevision.findUnique({
    where: { collection_entityId: { collection, entityId } },
  });
}

/** Posts a revision transition the way the workflow panel does. */
async function revise(slug: string, transition: string) {
  const page = await pageBySlug(slug);
  const revision = await revisionOf("pages", page.id);
  return transitionPage(
    idle,
    form({ id: page.id, version: revision?.version ?? 1, revision: revision?.id, transition }),
  );
}

describe("homepage managed in the CMS", () => {
  it("renders the seeded M03 composition from the database", async () => {
    const home = await getHomePage();
    expect(home?.page.title).toBe("Preserving East Africa's Plant Heritage.");
    expect(home?.content.hero.primaryAction).toEqual({
      label: "Explore the herbarium",
      href: "/herbarium",
    });
    expect(home?.images.heritage?.src).toBe("/images/rwenzori-mount-speke.jpg");
  });

  it("rejects links to pages that do not exist, beside the field", async () => {
    await signInAs(editor);
    const page = await pageBySlug("home");
    expect(
      await savePage(
        idle,
        pageFields(page, { "content.hero.primaryAction.href": "/not-a-real-page" }),
      ),
    ).toMatchObject({
      ok: false,
      fieldErrors: { "content.hero.primaryAction.href": expect.any(String) },
    });
    expect(await revisionOf("pages", page.id)).toBeNull();
  });

  it("an editor's homepage changes stay private until a reviewer approves them", async () => {
    await signInAs(editor);
    const page = await pageBySlug("home");
    await expectRedirect(
      savePage(
        idle,
        pageFields(page, {
          title: "A new headline for the test",
          "content.introduction.text": "Changed introduction from the test suite.",
          "content.layout.hidden": "presence",
        }),
      ),
      `/admin/pages/${page.id}?revision=1`,
    );
    expect((await getHomePage())?.page.title).toBe("Preserving East Africa's Plant Heritage.");
    expect(updateTag).not.toHaveBeenCalled();

    expect(await revise("home", "submitRevision")).toMatchObject({ ok: true });
    expect(await revise("home", "approveRevision")).toMatchObject({ ok: false });

    await signInAs(reviewer);
    expect(await revise("home", "approveRevision")).toMatchObject({ ok: true });
    expect(updateTag).toHaveBeenCalledWith("content:pages");
    const home = await getHomePage();
    expect(home?.page.title).toBe("A new headline for the test");
    expect(home?.content.introduction.text).toBe("Changed introduction from the test suite.");
    expect(home?.content.layout.hidden).toEqual(["presence"]);
  });

  it("restores the seeded homepage the same way", async () => {
    await signInAs(reviewer);
    const page = await pageBySlug("home");
    await expectRedirect(
      savePage(
        idle,
        pageFields(page, {
          title: "Preserving East Africa's Plant Heritage.",
          "content.introduction.text":
            "EACH is an independent conservation, herbarium and botanical knowledge initiative for East Africa, operating first in Uganda.",
          "content.layout.hidden": false,
        }),
      ),
      /revision=1/,
    );
    expect(await revise("home", "submitRevision")).toMatchObject({ ok: true });
    expect(await revise("home", "approveRevision")).toMatchObject({ ok: true });
    expect((await getHomePage())?.page.title).toBe("Preserving East Africa's Plant Heritage.");
    expect((await getHomePage())?.content.layout.hidden).toEqual([]);
  });
});

describe("landing pages and search", () => {
  it("publishes header and indexing changes, and the sitemap follows", async () => {
    await signInAs(reviewer);
    const page = await pageBySlug("impact");
    expect((await sitemap()).some((entry) => entry.url.endsWith("/impact"))).toBe(true);

    await expectRedirect(
      savePage(idle, pageFields(page, { title: "Measuring results", noindex: true })),
      /revision=1/,
    );
    expect((await getPage("impact"))?.title).toBe("Measuring what matters");
    expect(await revise("impact", "submitRevision")).toMatchObject({ ok: true });
    expect(await revise("impact", "approveRevision")).toMatchObject({ ok: true });

    expect(await getPage("impact")).toMatchObject({ title: "Measuring results", noindex: true });
    expect((await listIndexablePages()).some((entry) => entry.slug === "impact")).toBe(false);
    expect((await sitemap()).some((entry) => entry.url.endsWith("/impact"))).toBe(false);

    const live = await pageBySlug("impact");
    await expectRedirect(
      savePage(idle, pageFields(live, { title: "Measuring what matters", noindex: false })),
      /revision=1/,
    );
    await revise("impact", "submitRevision");
    await revise("impact", "approveRevision");
    expect((await sitemap()).some((entry) => entry.url.endsWith("/impact"))).toBe(true);
  });

  it("requires a photograph on pages that open with one", async () => {
    await signInAs(reviewer);
    const page = await pageBySlug("our-work");
    expect(await savePage(idle, pageFields(page, { heroImageId: "" }))).toMatchObject({
      ok: false,
      fieldErrors: { heroImageId: expect.any(String) },
    });
  });

  it("never lists drafts or placeholders in the sitemap", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls.some((url) => url.includes("placeholder-"))).toBe(false);
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
  });
});

describe("site settings", () => {
  it("administrators change navigation labels, order and visibility; destinations stay", async () => {
    await signInAs(admin);
    expect(
      await saveSettings(
        idle,
        form({
          section: "navigation",
          "nav.item.about.label": "Who we are",
          "nav.item.about.order": "1",
          "nav.link./about/leadership.hidden": true,
        }),
      ),
    ).toMatchObject({ ok: true });
    expect(updateTag).toHaveBeenCalledWith("content:settings");

    const navigation = await getNavigation();
    const about = navigation.find((item) => item.id === "about")!;
    expect(about).toMatchObject({ label: "Who we are", href: "/about" });
    expect(navigation[0]?.id).toBe("about");
    expect(about.groups!.flatMap((group) => group.links).map((link) => link.href)).not.toContain(
      "/about/leadership",
    );

    const audit = await getDb().auditEvent.findFirst({
      where: { action: "settings.navigation", actorId: admin.id },
    });
    expect(audit).not.toBeNull();

    // Every field posted with its default value stores no override.
    expect(await saveSettings(idle, form({ section: "navigation" }))).toMatchObject({ ok: true });
    expect((await getSiteSettings()).navigation).toEqual({ items: {}, links: {} });
  });

  it("administrators change the footer wording, validated", async () => {
    await signInAs(admin);
    expect(
      await saveSettings(idle, form({ section: "footer", footerStatement: "" })),
    ).toMatchObject({ ok: false, fieldErrors: { footerStatement: expect.any(String) } });
    expect(
      await saveSettings(
        idle,
        form({
          section: "footer",
          footerStatement: "Protecting plants together.",
          footerNote: "Test note.",
          copyrightText: "Test copyright",
        }),
      ),
    ).toMatchObject({ ok: true });
    expect((await getSiteChrome()).footer).toMatchObject({
      statement: "Protecting plants together.",
      copyright: "Test copyright",
    });
    await saveSettings(
      idle,
      form({
        section: "footer",
        footerStatement: "Preserving East Africa's Plant Heritage.",
        footerNote:
          "Photography is credited alongside each image. Some content is awaiting approval and is marked on the page.",
      }),
    );
  });

  it("refuses settings changes from editors and reviewers, and unknown sections", async () => {
    for (const user of [editor, reviewer]) {
      await signInAs(user);
      expect(
        await saveSettings(idle, form({ section: "branding", tagline: "x".repeat(40) })),
      ).toMatchObject({ ok: false, message: "You do not have permission to do that." });
    }
    await signInAs(admin);
    expect(await saveSettings(idle, form({ section: "secrets" }))).toMatchObject({ ok: false });
  });
});

describe("media references outside foreign keys", () => {
  it("finds images used by homepage sections and by pending changes, and refuses deletion", async () => {
    await signInAs(reviewer);
    const home = await pageBySlug("home");
    const content = homeContentSchema.parse(home.content);
    expect(await findMediaUsage(getDb(), content.heritage.imageId)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: expect.stringMatching(/sections/) }),
      ]),
    );

    // An uploaded image chosen only in a pending revision of the published terms page.
    const file = new File([readFileSync("public/images/budongo-forest-tree.jpg")], "a.jpg", {
      type: "image/jpeg",
    });
    await expectRedirect(
      uploadMedia(
        idle,
        form({
          file,
          alt: "Looking up a buttressed tree trunk into the forest canopy",
          caption: "Budongo Forest",
          creditAuthor: "EACH",
          license: "All rights reserved",
        }),
      ),
      /\/admin\/media\//,
    );
    const upload = await getDb().mediaAsset.findFirstOrThrow({
      where: { storage: "NEON", fileName: "a.jpg" },
      orderBy: { createdAt: "desc" },
    });
    const terms = await pageBySlug("terms");
    await expectRedirect(
      savePage(idle, pageFields(terms, { heroImageId: upload.id })),
      /revision=1/,
    );
    expect(await findMediaUsage(getDb(), upload.id)).toEqual([
      expect.objectContaining({ href: `/admin/pages/${terms.id}` }),
    ]);
    expect(await deleteMedia(idle, form({ id: upload.id, confirm: true }))).toMatchObject({
      ok: false,
    });

    // Once the changes are discarded the upload is unused and can go.
    expect(await revise("terms", "discardRevision")).toMatchObject({ ok: true });
    await expectRedirect(
      deleteMedia(idle, form({ id: upload.id, confirm: true })),
      /\/admin\/media/,
    );
  });
});

describe("project details", () => {
  const slug = uniqueSlug("detailed-project");

  it("stores operational status, dates, lists and SEO separately from publication status", async () => {
    await signInAs(editor);
    const imageId = await anyImageId();
    const base = {
      title: "Detailed project",
      slug,
      summary: "A project with every field.",
      ecosystem: "Wetland",
      sortOrder: 50,
      imageId,
      landscapeHeading: "The landscape",
      landscapeBody: "A paragraph.",
      country: "Uganda",
      operationalStatus: "ACTIVE",
      objectives: "Survey the wetland\nTrain field assistants",
      outcomes: "Verified outcome one",
      references: "[A report](https://example.org/report)",
      seoTitle: "Detailed project search title",
    };
    expect(
      await saveProject(idle, form({ ...base, startDate: "2027-05-01", endDate: "2026-01-01" })),
    ).toMatchObject({ ok: false, fieldErrors: { endDate: expect.any(String) } });
    await expectRedirect(
      saveProject(idle, form({ ...base, startDate: "2026-01-01", endDate: "2027-05-01" })),
      /saved=1/,
    );

    const row = await getDb().project.findUniqueOrThrow({ where: { slug } });
    expect(row).toMatchObject({ status: "DRAFT", operationalStatus: "ACTIVE", country: "Uganda" });
    const preview = await getProjectPreview(row.id);
    expect(preview?.value).toMatchObject({
      operationalStatus: "active",
      startDate: "2026-01-01",
      endDate: "2027-05-01",
      objectives: ["Survey the wetland", "Train field assistants"],
      outcomes: ["Verified outcome one"],
      references: ["[A report](https://example.org/report)"],
      seoTitle: "Detailed project search title",
      noindex: false,
    });
    expect(
      await transitionProject(
        idle,
        form({ id: row.id, version: row.version, transition: "submit" }),
      ),
    ).toMatchObject({ ok: true });
  });

  it("lists the item in review on the dashboard and the review queue", async () => {
    const operations = await summariseOperations();
    expect(operations.awaitingReview).toBeGreaterThanOrEqual(1);
    expect(operations.published.pages).toBeGreaterThanOrEqual(19);
    expect(operations.media).toBeGreaterThanOrEqual(16);
    expect(Array.isArray(await listPendingRevisions())).toBe(true);
  });
});
