import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { expect as baseExpect, test, type Browser, type Page } from "@playwright/test";

type Role = "admin" | "reviewer" | "editor";

test.setTimeout(120_000);
const expect = baseExpect.configure({ timeout: 45_000 });

function credentials(role: Role): { email: string; password: string } {
  const users = JSON.parse(process.env.E2E_USERS ?? "{}") as Record<
    Role,
    { email: string; password: string }
  >;
  const user = users[role];
  if (!user)
    throw new Error("E2E_USERS is not set; run through playwright.config.ts (globalSetup).");
  return user;
}

async function signIn(page: Page, role: Role) {
  await signInWithCredentials(page, credentials(role));
}

async function signInWithCredentials(
  page: Page,
  { email, password }: { email: string; password: string },
) {
  await page.goto("/admin/sign-in");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel(/^Password\b/).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible({
    timeout: 45_000,
  });
}

async function newSession(browser: Browser, role: Role): Promise<Page> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await signIn(page, role);
  return page;
}

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
}

test.describe("admin access", () => {
  test("managed account creation, password reset and deactivation work together", async ({
    page,
    browser,
  }) => {
    test.setTimeout(180_000);
    await signIn(page, "admin");
    await page.goto("/admin/users");
    const name = `E2E managed staff ${Date.now()}`;
    const email = `e2e-managed-${Date.now()}@each.test`;
    await page.getByLabel(/^Name\b/).fill(name);
    await page.getByLabel("Email address").fill(email);
    await page.getByRole("button", { name: "Create account", exact: true }).click();
    const status = page.getByRole("status");
    await expect(status).toContainText("Account created.");
    const password = /Temporary password \(shown only now\): ([\w-]+)/.exec(
      await status.innerText(),
    )?.[1];
    expect(password).toBeTruthy();
    const staff = await browser.newPage();
    await signInWithCredentials(staff, { email, password: password! });
    await page.reload();
    await page.getByRole("link", { name, exact: true }).click();
    await page.getByRole("button", { name: "Reset password", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("New temporary password");
    const resetPassword = /New temporary password \(shown only now\): ([\w-]+)/.exec(
      await page.getByRole("status").innerText(),
    )?.[1];
    expect(resetPassword).toBeTruthy();
    await staff.reload();
    await expect(staff).toHaveURL(/\/admin\/sign-in$/);
    await signInWithCredentials(staff, { email, password: resetPassword! });
    await page.getByLabel("Account active").uncheck();
    await page.getByRole("button", { name: "Save access", exact: true }).click();
    await expect(page.getByRole("status").first()).toContainText("Saved.");
    await staff.reload();
    await expect(staff).toHaveURL(/\/admin\/sign-in$/);
    await staff.close();
  });

  test("managed sessions survive reload and sign-out removes protected access", async ({
    page,
  }) => {
    await signIn(page, "editor");
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/sign-in$/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/sign-in$/);
  });

  test("Neon Functions is reachable from the settings page", async ({ page }) => {
    await signIn(page, "admin");
    await page.goto("/admin/settings");
    await expect(page.getByText("Background service: available", { exact: true })).toBeVisible();
  });

  test("an uploaded image round-trips through Neon storage and the public media route", async ({
    page,
    request,
  }) => {
    await signIn(page, "admin");
    await page.goto("/admin/media/upload");
    await page.getByLabel(/^File\b/).setInputFiles("public/images/budongo-forest-tree.jpg");
    await page.getByLabel("Alt text").fill("A tall forest tree used by the automated storage test");
    await page.getByLabel(/^Caption\b/).fill("Storage verification");
    await page.getByLabel(/^Credit\b/).fill("Automated test fixture");
    await page.locator('[name="license"]').fill("Test fixture only");
    await page.getByRole("button", { name: "Upload", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/media\/\w+\?uploaded=1$/, { timeout: 30_000 });
    const path = await page.getByRole("link", { name: "Open file" }).getAttribute("href");
    expect(path).toMatch(/^\/media\//);
    const response = await request.get(path!);
    expect(response.status()).toBe(200);
    expect(await response.body()).toEqual(readFileSync("public/images/budongo-forest-tree.jpg"));
    await page.getByLabel("I understand this cannot be undone").check();
    await page.getByRole("button", { name: "Delete file", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/media\?deleted=1$/);
    expect((await request.get(path!)).status()).toBe(404);
  });

  test("protected pages redirect to a sign-in page that is not indexed", async ({ page }) => {
    for (const path of ["/admin", "/admin/projects", "/admin/users", "/admin/preview/projects/x"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/sign-in$/);
    }
    await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expectAccessible(page);
  });

  test("a wrong password gets a generic message", async ({ page }) => {
    await page.goto("/admin/sign-in");
    await page.getByLabel("Email address").fill(credentials("editor").email);
    await page.getByLabel(/^Password\b/).fill("definitely-not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page.getByRole("form", { name: "Sign in", exact: true }).getByRole("alert"),
    ).toHaveText("The email address or password is incorrect.");
  });

  test("editors cannot open administrator pages", async ({ page }) => {
    await signIn(page, "editor");
    await expect(page.getByRole("link", { name: "Users" })).toHaveCount(0);
    for (const path of ["/admin/users", "/admin/settings", "/admin/audit"]) {
      await page.goto(path);
      // Next.js returns HTTP 200 when notFound() resolves after streaming starts.
      await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
      await expect(page.locator('meta[name="robots"]').last()).toHaveAttribute(
        "content",
        /noindex/,
      );
      await expect(page.getByRole("form")).toHaveCount(0);
    }
  });

  test("the dashboard and media library are accessible", async ({ page }) => {
    await signIn(page, "admin");
    await expectAccessible(page);
    await page.goto("/admin/media");
    await expect(page.getByRole("heading", { level: 1, name: "Media library" })).toBeVisible();
    await expectAccessible(page);
  });
});

test.describe.serial("publish flow", () => {
  const slug = `e2e-project-${Date.now()}`;
  const title = `E2E case study ${Date.now()}`;
  let editUrl = "";

  test("an editor creates a draft that is not public", async ({ page }) => {
    await signIn(page, "editor");
    await page.goto("/admin/projects/new");
    await page.getByLabel(/^Title\b/).fill(title);
    await page.getByLabel("Slug").fill(slug);
    await page.getByLabel("Summary").fill("Created by the browser test suite.");
    await page.getByLabel("Landscape type").fill("Montane forest");
    const main = page.getByLabel("Main image");
    await main.selectOption({ index: 1 });
    await page.getByLabel(/^Heading\b/).fill("The landscape");
    await page.getByLabel(/^Text\b/).fill("A landscape paragraph.");
    await page.getByLabel("Plant conservation").check();
    await expectAccessible(page);
    await page.getByRole("button", { name: "Create draft" }).click();

    await expect(page).toHaveURL(/\/admin\/projects\/\w+\?saved=1$/);
    editUrl = page.url().replace("?saved=1", "");
    await expect(page.getByText("Draft", { exact: true }).first()).toBeVisible();

    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(404);
  });

  test("the editor submits it for review but cannot approve it", async ({ page }) => {
    await signIn(page, "editor");
    await page.goto(editUrl);
    await page.getByRole("button", { name: "Submit for review" }).click();
    await expect(page.getByRole("status")).toContainText("Submit for review: done.");
    await page.reload();
    await expect(page.getByText("In review", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Approve and publish" })).toHaveCount(0);
  });

  test("a reviewer approves: the page and the project list update immediately", async ({
    browser,
  }) => {
    const page = await newSession(browser, "reviewer");
    await page.goto(editUrl);
    await page.getByRole("link", { name: "Preview" }).click();
    await expect(
      page.getByRole("note").filter({ hasText: "Preview. This item is in review" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await page.goto(editUrl);
    await page.getByRole("button", { name: "Approve and publish" }).click();
    await expect(page.getByRole("status")).toContainText("Approve and publish: done.");

    const visitor = await browser.newPage();
    const response = await visitor.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(visitor.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await visitor.goto("/projects");
    await expect(visitor.getByRole("heading", { name: title })).toBeVisible();
    await visitor.close();
  });

  test("unpublishing removes it from the site immediately", async ({ browser }) => {
    const page = await newSession(browser, "reviewer");
    await page.goto(editUrl);
    await page.getByRole("button", { name: "Unpublish" }).click();
    await expect(page.getByRole("status")).toContainText("Unpublish: done.");

    const visitor = await browser.newPage();
    expect((await visitor.goto(`/projects/${slug}`))?.status()).toBe(404);
    await visitor.goto("/projects");
    await expect(visitor.getByRole("heading", { name: title })).toHaveCount(0);
    await visitor.close();
  });
});
