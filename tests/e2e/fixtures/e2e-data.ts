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

/**
 * The browser suite edits two published pages and restores them in the same
 * run. If a run was interrupted, its pending changes and its marked values
 * (the suite's own wording plus a run id) are left behind; clear them so the
 * next run starts from the approved wording. Nothing else is touched.
 */
async function recoverInterruptedRun() {
  const pages = await db.page.findMany({
    where: { slug: { in: ["herbarium", "impact"] } },
    select: { id: true, slug: true, title: true, content: true },
  });
  await db.contentRevision.deleteMany({
    where: { collection: "pages", entityId: { in: pages.map((page) => page.id) } },
  });
  for (const page of pages) {
    if (page.slug === "impact" && page.title.startsWith("Measuring results ")) {
      await db.page.update({ where: { id: page.id }, data: { title: "Measuring what matters" } });
    }
    const content = page.content as { process?: { title?: string } };
    if (
      page.slug === "herbarium" &&
      content.process?.title?.startsWith("How a herbarium specimen is made ")
    ) {
      await db.page.update({
        where: { id: page.id },
        data: {
          content: { ...content, process: { ...content.process, title: "How a specimen is made" } },
        },
      });
    }
  }
}

async function setup() {
  await recoverInterruptedRun();
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
  // Enquiries sent by the public forms flow (personal data in real use).
  await db.inquiry.deleteMany({
    where: { email: { startsWith: "e2e-", endsWith: "@example.org" } },
  });
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
