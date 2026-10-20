import { APIError } from "better-auth/api";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { signIn } from "@/features/auth/actions";
import { getDb } from "@/services/db";
import { authApi } from "./auth-double";
import { expectRedirect, form, idle } from "./helpers";

beforeEach(() => {
  authApi.signInEmail.mockReset();
});

describe("sign-in", () => {
  it("signs in through Better Auth and redirects to the dashboard", async () => {
    await getDb().user.upsert({
      where: { email: "editor@each.test" },
      update: {},
      create: {
        id: "sign-in-test-editor",
        name: "Test editor",
        email: "editor@each.test",
        role: "editor",
      },
    });
    authApi.signInEmail.mockResolvedValueOnce({});
    await expectRedirect(
      signIn(idle, form({ email: "Editor@Each.test", password: "a passphrase" })),
      "/admin",
    );
    expect(authApi.signInEmail).toHaveBeenCalledWith(
      expect.objectContaining({ body: { email: "editor@each.test", password: "a passphrase" } }),
    );
  });

  it("gives one generic message for every failure and audits it without the raw email", async () => {
    authApi.signInEmail.mockRejectedValueOnce(
      new APIError("UNAUTHORIZED", { message: "Invalid email or password" }),
    );
    const result = await signIn(idle, form({ email: "nobody@each.test", password: "wrong" }));
    expect(result).toEqual({ ok: false, message: "The email address or password is incorrect." });

    const event = await getDb().auditEvent.findFirstOrThrow({
      where: { action: "auth.sign-in-failed" },
      orderBy: { createdAt: "desc" },
    });
    expect(JSON.stringify(event)).not.toContain("nobody@each.test");
  });

  it("rejects malformed input without calling Better Auth", async () => {
    expect(await signIn(idle, form({ email: "not-an-email", password: "" }))).toMatchObject({
      ok: false,
    });
    expect(authApi.signInEmail).not.toHaveBeenCalled();
  });

  it("limits repeated attempts for one account", async () => {
    const email = `limited-${Date.now()}@each.test`;
    authApi.signInEmail.mockRejectedValue(new APIError("UNAUTHORIZED", { message: "Invalid" }));
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(await signIn(idle, form({ email, password: "wrong" }))).toMatchObject({
        message: "The email address or password is incorrect.",
      });
    }
    const limited = await signIn(idle, form({ email, password: "wrong" }));
    expect(limited).toMatchObject({
      ok: false,
      message: expect.stringMatching(/Too many attempts/),
    });
    expect(authApi.signInEmail).toHaveBeenCalledTimes(5);
    vi.mocked(authApi.signInEmail).mockReset();
  });
});
