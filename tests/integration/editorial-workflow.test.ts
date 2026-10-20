import { updateTag } from "next/cache";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getPage, savePage, transitionPage } from "@/features/pages";
import { listPartners, savePartner, transitionPartner } from "@/features/partners";
import { getSiteSettings, saveSettings } from "@/features/settings";
import {
  deleteProject,
  getProject,
  listProjects,
  listProjectsForProgramme,
  saveProject,
  transitionProject,
} from "@/features/projects";
import { listTeamMembers, saveTeamMember, transitionTeamMember } from "@/features/team";
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

let admin: TestUser;
let reviewer: TestUser;
let editor: TestUser;
let imageId: string;
let programmeId: string;

beforeAll(async () => {
  admin = await createUser("admin");
  reviewer = await createUser("reviewer");
  editor = await createUser("editor");
  imageId = await anyImageId();
  programmeId = (
    await getDb().programme.findUniqueOrThrow({ where: { slug: "plant-conservation" } })
  ).id;
});

beforeEach(() => {
  vi.mocked(updateTag).mockClear();
});

function projectForm(
  slug: string,
  overrides: Record<string, string | string[] | number | boolean> = {},
) {
  return form({
    title: "Integration test project",
    slug,
    summary: "A project created by the test suite.",
    ecosystem: "Montane forest",
    sortOrder: 99,
    imageId,
    programmeIds: [programmeId],
    landscapeHeading: "The landscape",
    landscapeBody: "First paragraph.\n\nSecond paragraph.",
    story: "## What happened\n\nIt was tested.",
    ...overrides,
  });
}

async function project(slug: string) {
  return getDb().project.findUniqueOrThrow({ where: { slug } });
}

async function transition(slug: string, name: string) {
  const row = await project(slug);
  return transitionProject(idle, form({ id: row.id, version: row.version, transition: name }));
}

function revisionOf(entityId: string) {
  return getDb().contentRevision.findUnique({
    where: { collection_entityId: { collection: "projects", entityId } },
  });
}

/** Posts a revision transition the way the workflow panel does. */
async function reviseProject(slug: string, name: string) {
  const row = await project(slug);
  const revision = await revisionOf(row.id);
  return transitionProject(
    idle,
    form({ id: row.id, version: revision?.version ?? 1, revision: revision?.id, transition: name }),
  );
}

describe("project lifecycle", () => {
  const slug = uniqueSlug("test-project");

  it("an editor creates a draft that the public site cannot see", async () => {
    await signInAs(editor);
    await expectRedirect(saveProject(idle, projectForm(slug)), /^\/admin\/projects\/\w+\?saved=1$/);

    const row = await project(slug);
    expect(row).toMatchObject({
      status: "DRAFT",
      version: 1,
      createdById: editor.id,
      publishedAt: null,
    });
    expect((await listProjects()).some((item) => item.slug === slug)).toBe(false);
    expect(await getProject(slug)).toBeUndefined();
    expect(
      (await listProjectsForProgramme("plant-conservation")).some((item) => item.slug === slug),
    ).toBe(false);
    expect(updateTag).not.toHaveBeenCalled();

    const audit = await getDb().auditEvent.findFirst({
      where: { entityId: row.id, action: "projects.create" },
    });
    expect(audit?.actorId).toBe(editor.id);
  });

  it("rejects duplicate slugs and invalid input with field errors", async () => {
    await signInAs(editor);
    expect(await saveProject(idle, projectForm(slug))).toMatchObject({
      ok: false,
      fieldErrors: { slug: "This slug is already used." },
    });
    expect(
      await saveProject(
        idle,
        projectForm(uniqueSlug("x"), { title: "", slug: "Not A Slug", story: "No heading" }),
      ),
    ).toMatchObject({
      ok: false,
      fieldErrors: {
        title: expect.any(String),
        slug: expect.any(String),
        story: expect.any(String),
      },
    });
    expect(
      await saveProject(idle, projectForm(uniqueSlug("x"), { imageId: "does-not-exist" })),
    ).toMatchObject({ ok: false, fieldErrors: { imageId: expect.any(String) } });
  });

  it("an editor submits for review but cannot approve or edit it afterwards", async () => {
    await signInAs(editor);
    expect(await transition(slug, "submit")).toMatchObject({ ok: true });
    expect((await project(slug)).status).toBe("IN_REVIEW");

    expect(await transition(slug, "approve")).toMatchObject({ ok: false });
    const row = await project(slug);
    expect(
      await saveProject(idle, projectForm(slug, { id: row.id, version: row.version })),
    ).toMatchObject({
      ok: false,
      message: expect.stringMatching(/Only reviewers and administrators/),
    });
    expect((await listProjects()).some((item) => item.slug === slug)).toBe(false);
  });

  it("a reviewer approves: the project is published and the public cache expires", async () => {
    await signInAs(reviewer);
    expect(await transition(slug, "approve")).toMatchObject({ ok: true });
    const row = await project(slug);
    expect(row.status).toBe("PUBLISHED");
    expect(row.publishedAt).toBeInstanceOf(Date);
    expect(updateTag).toHaveBeenCalledWith("content:projects");

    const published = await getProject(slug);
    expect(published).toMatchObject({ title: "Integration test project", status: "published" });
    expect(published?.programmes.map((programme) => programme.slug)).toEqual([
      "plant-conservation",
    ]);
    expect(
      (await listProjectsForProgramme("plant-conservation")).some((item) => item.slug === slug),
    ).toBe(true);
  });

  it("refuses a stale edit (optimistic locking)", async () => {
    await signInAs(reviewer);
    const row = await project(slug);
    const result = await saveProject(
      idle,
      projectForm(slug, { id: row.id, version: row.version - 1 }),
    );
    expect(result).toMatchObject({
      ok: false,
      message: expect.stringMatching(/Someone else changed/),
    });
  });

  it("an editor's edit to published content is kept as pending changes, not shown", async () => {
    await signInAs(editor);
    const row = await project(slug);
    await expectRedirect(
      saveProject(
        idle,
        projectForm(slug, { id: row.id, version: row.version, title: "Edited title" }),
      ),
      `/admin/projects/${row.id}?revision=1`,
    );
    // The live row and the public site are unchanged; nothing was expired.
    expect(await project(slug)).toMatchObject({
      title: "Integration test project",
      version: row.version,
    });
    expect((await getProject(slug))?.title).toBe("Integration test project");
    expect(updateTag).not.toHaveBeenCalled();
    expect(await revisionOf(row.id)).toMatchObject({
      status: "DRAFT",
      version: 1,
      baseVersion: row.version,
      createdById: editor.id,
    });

    // Saving again updates the same revision (optimistic locking on the revision).
    const revision = await revisionOf(row.id);
    const again = projectForm(slug, {
      id: row.id,
      version: revision!.version,
      revision: revision!.id,
      title: "Edited again",
    });
    await expectRedirect(saveProject(idle, again), /revision=1/);
    expect(await saveProject(idle, again)).toMatchObject({
      ok: false,
      message: expect.stringMatching(/Someone else changed/),
    });
    expect((await revisionOf(row.id))?.version).toBe(2);
    expect((await getProject(slug))?.title).toBe("Integration test project");
  });

  it("an editor submits the changes but cannot approve them", async () => {
    await signInAs(editor);
    expect(await reviseProject(slug, "approveRevision")).toMatchObject({ ok: false });
    expect(await reviseProject(slug, "submitRevision")).toMatchObject({ ok: true });
    const row = await project(slug);
    expect(await revisionOf(row.id)).toMatchObject({ status: "IN_REVIEW" });
    expect(await reviseProject(slug, "approveRevision")).toMatchObject({ ok: false });
    expect(await reviseProject(slug, "discardRevision")).toMatchObject({ ok: false });
    expect((await getProject(slug))?.title).toBe("Integration test project");
  });

  it("a published item with pending changes cannot be unpublished or archived", async () => {
    await signInAs(reviewer);
    for (const name of ["unpublish", "archive"]) {
      expect(await transition(slug, name)).toMatchObject({
        ok: false,
        message: expect.stringMatching(/changes waiting to be published/),
      });
    }
    expect((await project(slug)).status).toBe("PUBLISHED");
  });

  it("a reviewer approves the changes: they go live and the cache expires", async () => {
    await signInAs(reviewer);
    const before = await project(slug);
    expect(await reviseProject(slug, "approveRevision")).toMatchObject({ ok: true });
    const row = await project(slug);
    expect(row).toMatchObject({
      status: "PUBLISHED",
      title: "Edited again",
      version: before.version + 1,
      updatedById: reviewer.id,
    });
    expect(row.publishedAt).toEqual(before.publishedAt);
    expect(await revisionOf(row.id)).toBeNull();
    expect(updateTag).toHaveBeenCalledWith("content:projects");
    expect((await getProject(slug))?.title).toBe("Edited again");
  });

  it("unpublishing removes it from the public site at once", async () => {
    await signInAs(reviewer);
    expect(await transition(slug, "unpublish")).toMatchObject({ ok: true });
    expect(await project(slug)).toMatchObject({ status: "DRAFT", publishedAt: null });
    expect(updateTag).toHaveBeenCalledWith("content:projects");
    expect(await getProject(slug)).toBeUndefined();
  });

  it("only administrators delete, and only archived or draft items", async () => {
    await signInAs(reviewer);
    expect(await transition(slug, "archive")).toMatchObject({ ok: true });
    let row = await project(slug);
    expect(
      await deleteProject(idle, form({ id: row.id, version: row.version, confirm: true })),
    ).toMatchObject({
      ok: false,
    });

    await signInAs(admin);
    expect(await deleteProject(idle, form({ id: row.id, version: row.version }))).toMatchObject({
      ok: false,
      fieldErrors: { confirm: expect.any(String) },
    });
    row = await project(slug);
    await expectRedirect(
      deleteProject(idle, form({ id: row.id, version: row.version, confirm: true })),
      "/admin/projects?deleted=1",
    );
    expect(await getDb().project.findUnique({ where: { slug } })).toBeNull();

    const actions = await getDb().auditEvent.findMany({
      where: { entityId: row.id },
      orderBy: { createdAt: "asc" },
      select: { action: true },
    });
    expect(actions.map((event) => event.action)).toEqual([
      "projects.create",
      "projects.submit",
      "projects.approve",
      "projects.revise",
      "projects.revise",
      "projects.revision-submit",
      "projects.revision-approve",
      "projects.unpublish",
      "projects.archive",
      "projects.delete",
    ]);
  });
});

describe("relations never leak unpublished content", () => {
  it("a draft partner linked to a published project is not shown", async () => {
    await signInAs(admin);
    const partnerSlug = uniqueSlug("draft-partner");
    await expectRedirect(
      savePartner(
        idle,
        form({
          name: "Draft Partner Org",
          slug: partnerSlug,
          description: "Not yet approved.",
          sortOrder: 5,
        }),
      ),
      /saved=1/,
    );
    const partner = await getDb().partner.findUniqueOrThrow({ where: { slug: partnerSlug } });
    expect((await listPartners()).some((item) => item.slug === partnerSlug)).toBe(false);

    const slug = uniqueSlug("with-partner");
    await expectRedirect(
      saveProject(idle, projectForm(slug, { partnerIds: [partner.id] })),
      /saved=1/,
    );
    await transition(slug, "submit");
    await transition(slug, "approve");
    expect((await getProject(slug))?.partners).toEqual([]);

    // Publishing the partner makes it appear.
    await transitionPartner(
      idle,
      form({ id: partner.id, version: partner.version, transition: "submit" }),
    );
    const submitted = await getDb().partner.findUniqueOrThrow({ where: { id: partner.id } });
    await transitionPartner(
      idle,
      form({ id: partner.id, version: submitted.version, transition: "approve" }),
    );
    expect(updateTag).toHaveBeenCalledWith("content:partners");
    expect((await getProject(slug))?.partners).toEqual(["Draft Partner Org"]);
  });
});

describe("publishing rules", () => {
  it("a team member cannot be published without consent", async () => {
    await signInAs(admin);
    const slug = uniqueSlug("person");
    await expectRedirect(
      saveTeamMember(
        idle,
        form({ name: "Test Person", slug, roleTitle: "Adviser", group: "ADVISER", sortOrder: 1 }),
      ),
      /saved=1/,
    );
    let row = await getDb().teamMember.findUniqueOrThrow({ where: { slug } });
    await transitionTeamMember(
      idle,
      form({ id: row.id, version: row.version, transition: "submit" }),
    );
    row = await getDb().teamMember.findUniqueOrThrow({ where: { slug } });
    expect(
      await transitionTeamMember(
        idle,
        form({ id: row.id, version: row.version, transition: "approve" }),
      ),
    ).toMatchObject({ ok: false, message: expect.stringMatching(/agreed to appear/) });
    expect((await listTeamMembers()).some((member) => member.slug === slug)).toBe(false);
  });

  it("an edited policy page changes only when its pending changes are approved", async () => {
    await signInAs(reviewer);
    const page = await getDb().page.findUniqueOrThrow({ where: { slug: "terms" } });
    const fields = {
      id: page.id,
      version: page.version,
      title: page.title,
      eyebrow: page.eyebrow,
      lead: page.lead,
      description: page.description,
      body: `${page.body}\n\n## Added by the test suite\nTemporary paragraph.`,
    };
    await expectRedirect(savePage(idle, form(fields)), `/admin/pages/${page.id}?revision=1`);
    expect(updateTag).not.toHaveBeenCalled();
    expect((await getPage("terms"))?.body).toBe(page.body);

    const revision = async () =>
      getDb().contentRevision.findUniqueOrThrow({
        where: { collection_entityId: { collection: "pages", entityId: page.id } },
      });
    const revise = async (transition: string) => {
      const current = await revision();
      return transitionPage(
        idle,
        form({ id: page.id, version: current.version, revision: current.id, transition }),
      );
    };
    expect(await revise("submitRevision")).toMatchObject({ ok: true });
    expect(await revise("approveRevision")).toMatchObject({ ok: true });
    expect(updateTag).toHaveBeenCalledWith("content:pages");
    expect((await getPage("terms"))?.body).toContain("Added by the test suite");

    // Restore the seeded text the same way: pending changes, then approval.
    const live = await getDb().page.findUniqueOrThrow({ where: { id: page.id } });
    await expectRedirect(
      savePage(idle, form({ ...fields, version: live.version, body: page.body })),
      /revision=1/,
    );
    expect((await getPage("terms"))?.body).toContain("Added by the test suite");
    expect(await revise("submitRevision")).toMatchObject({ ok: true });
    expect(await revise("approveRevision")).toMatchObject({ ok: true });
    expect((await getPage("terms"))?.body).toBe(page.body);
  });

  it("discarded changes leave the published version untouched", async () => {
    await signInAs(editor);
    const page = await getDb().page.findUniqueOrThrow({ where: { slug: "accessibility" } });
    await expectRedirect(
      savePage(
        idle,
        form({
          id: page.id,
          version: page.version,
          title: "Discard me",
          eyebrow: page.eyebrow,
          lead: page.lead,
          description: page.description,
          body: page.body,
        }),
      ),
      /revision=1/,
    );
    const revision = await getDb().contentRevision.findUniqueOrThrow({
      where: { collection_entityId: { collection: "pages", entityId: page.id } },
    });
    expect(
      await transitionPage(
        idle,
        form({
          id: page.id,
          version: revision.version,
          revision: revision.id,
          transition: "discardRevision",
        }),
      ),
    ).toMatchObject({ ok: true });
    expect(await getDb().contentRevision.findUnique({ where: { id: revision.id } })).toBeNull();
    expect(await getDb().page.findUniqueOrThrow({ where: { id: page.id } })).toMatchObject({
      title: page.title,
      version: page.version,
    });
  });

  it("site settings are saved by administrators and shown at once", async () => {
    await signInAs(admin);
    expect(
      await saveSettings(
        idle,
        form({ contactEmail: "info@each.test", socialLinks: "Example | https://example.org/each" }),
      ),
    ).toMatchObject({ ok: true });
    expect(updateTag).toHaveBeenCalledWith("content:settings");
    expect(await getSiteSettings()).toMatchObject({
      contactEmail: "info@each.test",
      socialLinks: [{ label: "Example", url: "https://example.org/each" }],
    });
    expect(await saveSettings(idle, form({ contactEmail: "not an email" }))).toMatchObject({
      ok: false,
      fieldErrors: { contactEmail: expect.any(String) },
    });
    await saveSettings(idle, form({}));
  });
});
