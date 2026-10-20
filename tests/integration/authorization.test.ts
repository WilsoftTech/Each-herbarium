import { beforeAll, describe, expect, it } from "vitest";
import { changePassword } from "@/features/auth/actions";
import { deleteMedia, updateMediaMetadata, uploadMedia } from "@/features/media";
import { savePage, transitionPage } from "@/features/pages";
import { deletePartner, savePartner, transitionPartner } from "@/features/partners";
import { deleteProgramme, saveProgramme, transitionProgramme } from "@/features/programmes";
import { deleteProject, saveProject, transitionProject } from "@/features/projects";
import {
  deleteArticle,
  deleteDownload,
  saveArticle,
  saveDownload,
  transitionArticle,
  transitionDownload,
} from "@/features/resources";
import { saveSettings } from "@/features/settings";
import { deleteTeamMember, saveTeamMember, transitionTeamMember } from "@/features/team";
import { createUser as createUserAction, resetUserPassword, updateUser } from "@/features/users";
import { getAdminSession, requireAdmin } from "@/services/admin-auth";
import { getDb } from "@/services/db";
import {
  createUser,
  expectNotFound,
  expectRedirect,
  form,
  idle,
  signInAs,
  type TestUser,
} from "./helpers";

type Action = (state: typeof idle, data: FormData) => Promise<unknown>;

/** Every admin Server Action. Each must authorise on the server. */
const actions: Record<string, Action> = {
  saveProject,
  transitionProject,
  deleteProject,
  saveProgramme,
  transitionProgramme,
  deleteProgramme,
  savePartner,
  transitionPartner,
  deletePartner,
  saveTeamMember,
  transitionTeamMember,
  deleteTeamMember,
  saveArticle,
  transitionArticle,
  deleteArticle,
  saveDownload,
  transitionDownload,
  deleteDownload,
  savePage,
  transitionPage,
  uploadMedia,
  updateMediaMetadata,
  deleteMedia,
  saveSettings,
  createUserAction,
  updateUser,
  resetUserPassword,
  changePassword,
};

let admin: TestUser;
let reviewer: TestUser;
let editor: TestUser;
let deactivated: TestUser;

beforeAll(async () => {
  admin = await createUser("admin");
  reviewer = await createUser("reviewer");
  editor = await createUser("editor");
  deactivated = await createUser("admin", { active: false });
});

describe("requireAdmin", () => {
  it("redirects to sign-in without a session", async () => {
    await signInAs(null);
    await expectRedirect(requireAdmin(), "/admin/sign-in");
  });

  it("treats deactivated accounts and unknown roles as signed out", async () => {
    await signInAs(deactivated);
    expect(await getAdminSession()).toBeNull();
    await expectRedirect(requireAdmin(), "/admin/sign-in");

    await signInAs({ ...editor, role: "owner" as never });
    expect(await getAdminSession()).toBeNull();
  });

  it("responds 404 when the role lacks the permission", async () => {
    await signInAs(editor);
    await expectNotFound(requireAdmin("users:manage"));
    await expectNotFound(requireAdmin("settings:edit"));
    await signInAs(reviewer);
    await expectNotFound(requireAdmin("audit:view"));
    await signInAs(admin);
    await expect(requireAdmin("users:manage")).resolves.toMatchObject({ role: "admin" });
  });
});

describe("Server Actions without a session", () => {
  it.each(Object.entries(actions))(
    "%s redirects to sign-in and writes nothing",
    async (_name, action) => {
      await signInAs(null);
      const before = await getDb().auditEvent.count();
      const data = form({
        id: "x",
        version: 1,
        title: "Intruder",
        slug: "intruder",
        transition: "approve",
        confirm: true,
        name: "Intruder",
        email: "intruder@example.org",
        role: "admin",
      });
      await expectRedirect(action(idle, data), "/admin/sign-in");
      expect(await getDb().auditEvent.count()).toBe(before);
      expect(await getDb().project.findUnique({ where: { slug: "intruder" } })).toBeNull();
    },
  );
});

describe("cross-role access", () => {
  it("editors cannot approve, delete, change settings or manage users", async () => {
    await signInAs(editor);
    const denied = { ok: false, message: "You do not have permission to do that." };
    expect(
      await transitionProject(idle, form({ id: "x", version: 1, transition: "approve" })),
    ).toEqual(denied);
    expect(await deleteProject(idle, form({ id: "x", version: 1, confirm: true }))).toEqual(denied);
    expect(await saveSettings(idle, form({ contactEmail: "a@b.org" }))).toEqual(denied);
    expect(
      await createUserAction(idle, form({ name: "X", email: "x@each.test", role: "admin" })),
    ).toEqual(denied);
    expect(await updateMediaMetadata(idle, form({ id: "x" }))).toEqual(denied);
    expect(await deleteMedia(idle, form({ id: "x", confirm: true }))).toEqual(denied);
  });

  it("reviewers cannot manage users, settings or permanently delete content", async () => {
    await signInAs(reviewer);
    const denied = { ok: false, message: "You do not have permission to do that." };
    expect(
      await createUserAction(idle, form({ name: "X", email: "x2@each.test", role: "editor" })),
    ).toEqual(denied);
    expect(await updateUser(idle, form({ id: editor.id, role: "admin", active: true }))).toEqual(
      denied,
    );
    expect(await saveSettings(idle, form({}))).toEqual(denied);
    expect(await deleteArticle(idle, form({ id: "x", version: 1, confirm: true }))).toEqual(denied);
  });

  it("an editor cannot escalate their own role", async () => {
    await signInAs(editor);
    await updateUser(idle, form({ id: editor.id, role: "admin", active: true }));
    expect((await getDb().user.findUniqueOrThrow({ where: { id: editor.id } })).role).toBe(
      "editor",
    );
  });
});

describe("user management safeguards", () => {
  it("administrators cannot demote or deactivate themselves", async () => {
    await signInAs(admin);
    const result = await updateUser(idle, form({ id: admin.id, role: "editor", active: true }));
    expect(result).toMatchObject({ ok: false });
    expect((await getDb().user.findUniqueOrThrow({ where: { id: admin.id } })).role).toBe("admin");
  });

  it("a role change signs the user out at once", async () => {
    await signInAs(admin);
    await getDb().session.create({
      data: {
        id: `session-${reviewer.id}`,
        token: `token-${reviewer.id}`,
        userId: reviewer.id,
        expiresAt: new Date(Date.now() + 3_600_000),
      },
    });
    expect(
      await updateUser(idle, form({ id: reviewer.id, role: "editor", active: true })),
    ).toMatchObject({ ok: true });
    expect(await getDb().session.count({ where: { userId: reviewer.id } })).toBe(0);
    await updateUser(idle, form({ id: reviewer.id, role: "reviewer", active: true }));
  });

  it("creates accounts with a one-time password and rejects duplicate emails", async () => {
    await signInAs(admin);
    const email = `new-${Date.now()}@each.test`;
    const created = await createUserAction(
      idle,
      form({ name: "New Editor", email, role: "editor" }),
    );
    expect(created).toMatchObject({
      ok: true,
      message: expect.stringMatching(/Temporary password/),
    });
    const user = await getDb().user.findUniqueOrThrow({ where: { email } });
    // Credentials belong to Neon Auth; the CMS stores only staff membership.
    expect(await getDb().account.count({ where: { userId: user.id } })).toBe(0);
    expect(
      await createUserAction(idle, form({ name: "Again", email, role: "editor" })),
    ).toMatchObject({
      ok: false,
      fieldErrors: { email: expect.any(String) },
    });
  });
});
