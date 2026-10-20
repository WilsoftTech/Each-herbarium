import { randomBytes } from "node:crypto";
import {
  registerManagedIdentity,
  promoteManagedAdmin,
  setManagedIdentityRole,
} from "../../../scripts/managed-identity";
import { createScriptClient } from "../../../scripts/script-env";
import { developmentDatabaseUrl } from "../../test-database";

developmentDatabaseUrl();
const roles = ["admin", "reviewer", "editor"] as const;
const db = createScriptClient();

async function setup() {
  const credentials: Record<string, { email: string; password: string }> = {};
  const runId = Date.now();
  for (const role of roles) {
    const email = `e2e-${role}-${runId}@each.test`;
    const password = randomBytes(24).toString("base64url");
    const identity = await registerManagedIdentity({ email, name: `E2E ${role}`, password });
    if (role === "admin") promoteManagedAdmin(identity.id);
    await db.user.create({
      data: {
        id: identity.id,
        email,
        name: `E2E ${role}`,
        role,
        active: true,
        emailVerified: true,
      },
    });
    credentials[role] = { email, password };
  }
  await db.rateLimit.deleteMany({ where: { key: { startsWith: "app:" } } });
  process.stdout.write(JSON.stringify(credentials));
}

async function teardown() {
  const administrators = await db.user.findMany({
    where: {
      email: { startsWith: "e2e-", endsWith: "@each.test" },
      role: "admin",
    },
    select: { id: true },
  });
  for (const user of administrators) setManagedIdentityRole(user.id, "user");
  const projects = await db.project.findMany({
    where: { slug: { startsWith: "e2e-" } },
    select: { id: true },
  });
  await db.contentRevision.deleteMany({
    where: { collection: "projects", entityId: { in: projects.map((project) => project.id) } },
  });
  await db.project.deleteMany({ where: { slug: { startsWith: "e2e-" } } });
  // Keep audit references, but revoke application access for test identities.
  await db.user.updateMany({
    where: { email: { endsWith: "@each.test" } },
    data: { active: false, role: "editor" },
  });
}

(process.argv[2] === "setup"
  ? setup()
  : process.argv[2] === "teardown"
    ? teardown()
    : Promise.reject(new Error("setup | teardown"))
)
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
