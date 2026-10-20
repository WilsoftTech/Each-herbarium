import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";
import { registerManagedIdentity, promoteManagedAdmin } from "./managed-identity";
import { createScriptClient, databaseHost } from "./script-env";

const { values } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string" },
    id: { type: "string" },
  },
});
const email = values.email?.trim().toLowerCase();
const name = values.name?.trim();
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) {
  throw new Error(
    'Usage: npm run admin:create -- --email someone@example.org --name "Full Name" [--id existing-managed-id]',
  );
}
const db = createScriptClient();

async function main(email: string, name: string) {
  const password = randomBytes(24).toString("base64url");
  const identity = values.id
    ? { id: values.id }
    : await registerManagedIdentity({ email, name, password });
  // Existing IDs must match the email in the managed directory, never a caller's assertion.
  const identities = await db.$queryRaw<{ id: string; email: string }[]>`
    SELECT id, email FROM neon_auth."user" WHERE id::text = ${identity.id} AND email = ${email}
  `;
  if (identities.length !== 1) throw new Error("Managed identity/email mismatch.");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing && existing.id !== identity.id) {
    throw new Error(
      "Existing CMS user has a different identity ID; explicit data migration is required.",
    );
  }
  promoteManagedAdmin(identity.id);
  await db.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { id: identity.id },
      update: { role: "admin", active: true, name },
      create: { id: identity.id, email, name, role: "admin", active: true, emailVerified: true },
    });
    await tx.auditEvent.create({
      data: {
        action: "user.create",
        entityType: "user",
        entityId: identity.id,
        summary: `Bootstrapped managed administrator ${email}`,
      },
    });
  });
  console.log(`Administrator ready on ${databaseHost()}: ${email}`);
  if (!values.id) console.log(`Temporary password (shown once): ${password}`);
  console.log("Sign in at /admin/sign-in and change your password under Your account.");
}
main(email, name)
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
