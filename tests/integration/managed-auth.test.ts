import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAuth } from "@/services/auth";
import { getDb } from "@/services/db";
import { createUser } from "./helpers";

const identity = vi.hoisted(() => ({
  getSession: vi.fn(),
  signIn: { email: vi.fn() },
  reader: vi.fn<(config: unknown) => void>(),
}));
vi.unmock("@/services/auth");
vi.mock("next/server", () => ({ connection: vi.fn(async () => undefined) }));
vi.mock("@neondatabase/auth/next/server", () => ({ createNeonAuth: () => identity }));
vi.mock("@neondatabase/auth/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@neondatabase/auth/server")>()),
  createAuthServer: (config: unknown) => {
    identity.reader(config);
    return identity;
  },
}));
const request = { headers: new Headers({ cookie: "__Secure-neon-auth.session_token=test" }) };

beforeEach(() => {
  identity.getSession.mockReset();
  identity.signIn.email.mockReset();
  identity.reader.mockReset();
});

describe("managed identity and CMS membership", () => {
  it("does not contact identity without a session cookie", async () => {
    expect(await getAuth().api.getSession({ headers: new Headers() })).toBeNull();
    expect(identity.getSession).not.toHaveBeenCalled();
  });
  it("does not reuse optional cached identity data for authorization", async () => {
    identity.getSession.mockResolvedValue({ data: null, error: null });
    await getAuth().api.getSession({
      headers: new Headers({
        cookie:
          "__Secure-neon-auth.session_token=test; __Secure-neon-auth.local.session_data=stale; preference=kept",
      }),
    });
    const call = identity.reader.mock.calls[0];
    if (!call) throw new Error("Expected an identity reader context.");
    const config = call[0] as {
      context: () => { getCookies: () => string; setCookie: () => void };
    };
    expect(config.context().getCookies()).toBe(
      "__Secure-neon-auth.session_token=test; preference=kept",
    );
    expect(config.context().setCookie()).toBeUndefined();
  });
  it("does not grant CMS membership to an arbitrary managed identity", async () => {
    identity.getSession.mockResolvedValue({
      data: { user: { id: "not-a-staff-member" }, session: {} },
      error: null,
    });
    expect(await getAuth().api.getSession(request)).toBeNull();
  });
  it("uses current local roles and active state, ignoring identity role claims", async () => {
    const user = await createUser("editor");
    identity.getSession.mockResolvedValue({
      data: { user: { id: user.id, role: "admin" }, session: {} },
      error: null,
    });
    expect((await getAuth().api.getSession(request))?.user.role).toBe("editor");
    await getDb().user.update({ where: { id: user.id }, data: { active: false } });
    expect((await getAuth().api.getSession(request))?.user.active).toBe(false);
    await expect(
      getAuth().api.signInEmail({
        body: { email: user.email, password: "unused" },
        headers: new Headers(),
      }),
    ).rejects.toThrow();
    expect(identity.signIn.email).not.toHaveBeenCalled();
  });
  it("fails closed when the identity service fails", async () => {
    identity.getSession.mockResolvedValue({ data: null, error: { message: "unavailable" } });
    await expect(getAuth().api.getSession(request)).rejects.toThrow(
      "identity service is unavailable",
    );
  });
});
