import { randomUUID } from "node:crypto";
import { expect } from "vitest";
import { getDb } from "@/services/db";
import type { Role } from "@/services/permissions";
import { actAs } from "./auth-double";

export type TestUser = { id: string; name: string; email: string; role: Role; active: boolean };

/** Creates a staff user row (no password needed: sessions come from the auth double). */
export async function createUser(role: Role, overrides: Partial<TestUser> = {}): Promise<TestUser> {
  const id = randomUUID();
  const user: TestUser = {
    id,
    name: `Test ${role}`,
    email: `${role}-${id.slice(0, 8)}@each.test`,
    role,
    active: true,
    ...overrides,
  };
  await getDb().user.create({ data: { ...user, emailVerified: true } });
  return user;
}

export async function signInAs(user: TestUser | null): Promise<void> {
  actAs(user);
}

/** Next.js control-flow errors carry their target in `digest`. */
export async function expectRedirect(
  promise: Promise<unknown>,
  to: string | RegExp,
): Promise<void> {
  const error = await promise.then(
    () => null,
    (caught: unknown) => caught as { digest?: string },
  );
  expect(error?.digest, "expected a redirect").toMatch(/^NEXT_REDIRECT/);
  const target = error?.digest?.split(";")[2] ?? "";
  if (typeof to === "string") expect(target).toBe(to);
  else expect(target).toMatch(to);
}

export async function expectNotFound(promise: Promise<unknown>): Promise<void> {
  const error = await promise.then(
    () => null,
    (caught: unknown) => caught as { digest?: string },
  );
  expect(error?.digest, "expected notFound()").toBe("NEXT_HTTP_ERROR_FALLBACK;404");
}

/** Builds FormData from plain values; arrays become repeated fields. */
export function form(
  values: Record<string, string | number | boolean | string[] | File | undefined>,
): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === false) continue;
    if (Array.isArray(value)) value.forEach((item) => data.append(key, item));
    else if (value === true) data.set(key, "on");
    else if (value instanceof File) data.set(key, value);
    else data.set(key, String(value));
  }
  return data;
}

export const idle = { ok: true } as const;

/** Any ready image from the seeded media library. */
export async function anyImageId(): Promise<string> {
  const image = await getDb().mediaAsset.findFirstOrThrow({
    where: { kind: "IMAGE", status: "READY" },
  });
  return image.id;
}

export function uniqueSlug(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}
