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

/**
 * One signed-in page per role, shared by the editorial flows below. Sign-in is
 * rate limited per account and per address (src/services/rate-limit.ts), so
 * the flows reuse a session instead of signing in for every step.
 */
const sessions = new Map<Role, Page>();

async function session(browser: Browser, role: Role): Promise<Page> {
  const existing = sessions.get(role);
  if (existing && !existing.isClosed()) return existing;
  const page = await newSession(browser, role);
  sessions.set(role, page);
  return page;
}

test.afterAll(async () => {
  for (const page of sessions.values()) await page.context().close();
  sessions.clear();
});

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
  const revisedTitle = `${title} (revised)`;
  let editUrl = "";

  test("an editor creates a draft that is not public", async ({ browser }) => {
    const page = await session(browser, "editor");
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

  test("the editor submits it for review but cannot approve it", async ({ browser }) => {
    const page = await session(browser, "editor");
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
    const page = await session(browser, "reviewer");
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
    const sitemap = await visitor.request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain(`/projects/${slug}`);
    await visitor.close();
  });

  test("an editor's changes to the published project stay private until approved", async ({
    browser,
  }) => {
    const page = await session(browser, "editor");
    await page.goto(editUrl);
    await expect(page.getByText("Published", { exact: true }).first()).toBeVisible();
    await page.getByLabel(/^Title\b/).fill(revisedTitle);
    await page.getByLabel("Featured on the homepage").check();
    await page.getByRole("button", { name: "Save pending changes" }).click();
    await expect(page).toHaveURL(/\?revision=1$/);
    await expect(page.getByRole("heading", { name: "Pending changes" })).toBeVisible();

    // The public page still shows the approved version.
    const visitor = await browser.newPage();
    await visitor.goto(`/projects/${slug}`);
    await expect(visitor.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(visitor.getByRole("heading", { level: 1, name: revisedTitle })).toHaveCount(0);

    // The preview shows the pending changes, clearly labelled.
    await page.getByRole("link", { name: "Preview pending changes" }).click();
    await expect(
      page.getByRole("note").filter({ hasText: "Preview of pending changes" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: revisedTitle })).toBeVisible();

    await page.goto(editUrl);
    await page.getByRole("button", { name: "Submit changes for review" }).click();
    await expect(page.getByRole("status")).toContainText("Submit changes for review: done.");
    await page.reload();
    await expect(page.getByRole("button", { name: "Approve and publish changes" })).toHaveCount(0);
    await visitor.goto(`/projects/${slug}`);
    await expect(visitor.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await visitor.close();
  });

  test("the review queue lists the changes; a reviewer approves and the site updates", async ({
    browser,
  }) => {
    const page = await session(browser, "reviewer");
    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { level: 1, name: "Review queue" })).toBeVisible();
    await expect(page.getByRole("link", { name: title })).toBeVisible();
    await expectAccessible(page);

    await page.goto(editUrl);
    await expect(page.getByRole("button", { name: "Unpublish" })).toHaveCount(0);
    await page.getByRole("button", { name: "Approve and publish changes" }).click();
    await expect(page.getByRole("status")).toContainText("Approve and publish changes: done.");

    const visitor = await browser.newPage();
    await visitor.goto(`/projects/${slug}`);
    await expect(visitor.getByRole("heading", { level: 1, name: revisedTitle })).toBeVisible();
    // The title contains parentheses, so compare text rather than build a pattern.
    expect(await visitor.title()).toContain(revisedTitle);
    await visitor.goto("/");
    await expect(visitor.getByRole("heading", { name: revisedTitle })).toBeVisible();
    await visitor.close();
  });

  test("archiving removes it from the site immediately", async ({ browser }) => {
    const page = await session(browser, "reviewer");
    await page.goto(editUrl);
    await page.getByRole("button", { name: "Archive" }).click();
    await expect(page.getByRole("status")).toContainText("Archive: done.");

    const visitor = await browser.newPage();
    expect((await visitor.goto(`/projects/${slug}`))?.status()).toBe(404);
    await visitor.goto("/projects");
    await expect(visitor.getByRole("heading", { name: revisedTitle })).toHaveCount(0);
    await visitor.goto("/");
    await expect(visitor.getByRole("heading", { name: revisedTitle })).toHaveCount(0);
    const sitemap = await visitor.request.get("/sitemap.xml");
    expect(await sitemap.text()).not.toContain(slug);
    await visitor.close();
  });
});

test.describe.serial("designed page sections", () => {
  const original = "How a specimen is made";
  const changed = `How a herbarium specimen is made ${Date.now()}`;
  const heading = "[name='content.process.title']";

  async function openHerbarium(page: Page) {
    await page.goto("/admin/pages");
    await page.getByRole("link", { name: /^The herbarium:/ }).click();
    await expect(page.locator(heading)).toBeVisible();
  }

  /** Saves, submits and approves a new section heading as a reviewer. */
  async function publishHeading(page: Page, value: string) {
    await openHerbarium(page);
    await page.locator(heading).fill(value);
    await page.getByRole("button", { name: "Save pending changes" }).click();
    await expect(page).toHaveURL(/\?revision=1$/);
    await page.getByRole("button", { name: "Submit changes for review" }).click();
    await expect(page.getByRole("status")).toContainText("done.");
    await page.getByRole("button", { name: "Approve and publish changes" }).click();
    await expect(page.getByRole("status")).toContainText("Approve and publish changes: done.");
  }

  test("an editor's change to a designed section stays private until approved", async ({
    browser,
  }) => {
    const editor = await session(browser, "editor");
    await openHerbarium(editor);
    await expect(editor.locator(heading)).toHaveValue(original);
    await expectAccessible(editor);
    await editor.locator(heading).fill(changed);
    await editor.getByRole("button", { name: "Save pending changes" }).click();
    await expect(editor).toHaveURL(/\?revision=1$/);

    // The public page keeps the approved wording.
    const visitor = await browser.newPage();
    await visitor.goto("/herbarium");
    await expect(visitor.getByRole("heading", { level: 2, name: original })).toBeVisible();
    await expect(visitor.getByRole("heading", { name: changed })).toHaveCount(0);

    // The preview renders the real page composition with the pending change.
    await editor.getByRole("link", { name: "Preview pending changes" }).click();
    await expect(
      editor.getByRole("note").filter({ hasText: "Preview of pending changes" }),
    ).toBeVisible();
    await expect(editor.getByRole("heading", { level: 2, name: changed })).toBeVisible();
    await expect(
      editor.getByRole("heading", { level: 2, name: "Developing the herbarium foundation" }),
    ).toBeVisible();

    await openHerbarium(editor);
    await editor.getByRole("button", { name: "Submit changes for review" }).click();
    await expect(editor.getByRole("status")).toContainText("Submit changes for review: done.");
    await editor.reload();
    await expect(editor.getByRole("button", { name: "Approve and publish changes" })).toHaveCount(
      0,
    );
    await visitor.goto("/herbarium");
    await expect(visitor.getByRole("heading", { level: 2, name: original })).toBeVisible();

    const reviewer = await session(browser, "reviewer");
    await openHerbarium(reviewer);
    await reviewer.getByRole("button", { name: "Approve and publish changes" }).click();
    await expect(reviewer.getByRole("status")).toContainText("Approve and publish changes: done.");

    // Approval expires the cached page: the next request shows the new heading.
    await visitor.goto("/herbarium");
    await expect(visitor.getByRole("heading", { level: 2, name: changed })).toBeVisible();
    await expect(visitor.getByRole("heading", { name: original })).toHaveCount(0);
    await visitor.close();
  });

  test("a reviewer restores the approved wording the same way", async ({ browser }) => {
    const reviewer = await session(browser, "reviewer");
    await publishHeading(reviewer, original);
    const visitor = await browser.newPage();
    await visitor.goto("/herbarium");
    await expect(visitor.getByRole("heading", { level: 2, name: original })).toBeVisible();
    await visitor.close();
  });

  test("founding programme editors include the designed sections", async ({ browser }) => {
    const page = await session(browser, "reviewer");
    await page.goto("/admin/programmes");
    await page.getByRole("link", { name: "Plant conservation" }).click();
    await expect(page.getByRole("heading", { name: "Why it matters" })).toBeVisible();
    await expect(page.locator("[name='content.approach.items']")).toHaveValue(
      /## Know what grows where/,
    );
    await expectAccessible(page);
  });
});

test.describe.serial("managed page header", () => {
  const original = "Measuring what matters";
  const changed = `Measuring results ${Date.now()}`;

  async function editImpact(page: Page, value: string) {
    await page.goto("/admin/pages");
    await page.getByRole("link", { name: /^Impact:/ }).click();
    await page.locator("[name='title']").fill(value);
    await page.getByRole("button", { name: "Save pending changes" }).click();
    await expect(page).toHaveURL(/\?revision=1$/);
    await page.getByRole("button", { name: "Submit changes for review" }).click();
    await expect(page.getByRole("status")).toContainText("done.");
    await page.getByRole("button", { name: "Approve and publish changes" }).click();
    await expect(page.getByRole("status")).toContainText("Approve and publish changes: done.");
  }

  test("a reviewer publishes a new page headline without redeployment", async ({ browser }) => {
    const page = await session(browser, "reviewer");
    await editImpact(page, changed);
    const visitor = await browser.newPage();
    await visitor.goto("/impact");
    await expect(visitor.getByRole("heading", { level: 1, name: changed })).toBeVisible();
    await visitor.close();

    await editImpact(page, original);
    const after = await browser.newPage();
    await after.goto("/impact");
    await expect(after.getByRole("heading", { level: 1, name: original })).toBeVisible();
    await after.close();
  });

  test("settings and page editors are accessible", async ({ page }) => {
    await signIn(page, "admin");
    for (const path of ["/admin/settings", "/admin/settings/navigation", "/admin/pages"]) {
      await page.goto(path);
      await expectAccessible(page);
    }
    await page.getByRole("link", { name: /^Homepage:/ }).click();
    await expect(page.getByRole("heading", { name: "Section order and visibility" })).toBeVisible();
    await expectAccessible(page);
  });
});

test.describe.serial("public forms", () => {
  const email = `e2e-${Date.now()}@example.org`;

  async function setForms(page: Page, on: boolean) {
    await page.goto("/admin/settings/forms");
    await page.getByLabel("Show the forms on the website").setChecked(on);
    await page.getByRole("button", { name: "Save public forms" }).click();
    await expect(page.getByRole("status")).toContainText("Settings saved.");
  }

  test("an administrator switches the forms on and the contact page shows the form", async ({
    browser,
  }) => {
    const admin = await session(browser, "admin");
    await setForms(admin, true);
    const visitor = await browser.newPage();
    await visitor.goto("/contact");
    await expect(visitor.getByRole("form", { name: "Contact form" })).toBeVisible();
    await expect(visitor.getByText("The contact form is not available yet")).toHaveCount(0);
    await expectAccessible(visitor);
    await visitor.close();
  });

  test("invalid input is reported beside each field and nothing is stored", async ({ page }) => {
    await page.goto("/contact");
    const contactForm = page.getByRole("form", { name: "Contact form" });
    await contactForm.getByLabel("Your name").fill("E2E visitor");
    // Bypass browser validation so the server's own checks are exercised.
    await contactForm.evaluate((element) => element.setAttribute("novalidate", ""));
    await contactForm.getByLabel("Email address").fill("not-an-email");
    await contactForm.getByRole("button", { name: "Send message" }).click();
    await expect(contactForm.getByRole("alert")).toContainText("Check the highlighted fields.");
    await expect(contactForm.getByText("Enter an email address in the format")).toBeVisible();
    await expect(contactForm.getByText("Choose a topic.")).toBeVisible();
    await expect(contactForm.getByLabel("Your name")).toHaveValue("E2E visitor");
  });

  test("a valid message is received and listed for staff with its email status", async ({
    page,
    browser,
  }) => {
    await page.goto("/contact");
    const contactForm = page.getByRole("form", { name: "Contact form" });
    await contactForm.getByLabel("Your name").fill("E2E visitor");
    await contactForm.getByLabel("Email address").fill(email);
    await contactForm.getByLabel("Topic").selectOption("general");
    await contactForm.getByLabel("Message").fill("A question sent by the end-to-end tests.");
    await contactForm.getByLabel(/may store these details/).check();
    await contactForm.getByRole("button", { name: "Send message" }).click();
    await expect(contactForm.getByRole("status")).toContainText("Your message has been received");
    await expect(contactForm.getByLabel("Your name")).toHaveValue("");

    const admin = await session(browser, "admin");
    await admin.goto("/admin/enquiries");
    await admin.getByRole("link", { name: "E2E visitor" }).first().click();
    await expect(admin.getByText(email)).toBeVisible();
    await expect(admin.getByText("A question sent by the end-to-end tests.")).toBeVisible();
    await expectAccessible(admin);
  });

  test("editors cannot open the enquiries", async ({ browser }) => {
    const editor = await session(browser, "editor");
    await expect(editor.getByRole("link", { name: "Enquiries" })).toHaveCount(0);
    await editor.goto("/admin/enquiries");
    // Next.js returns HTTP 200 when notFound() resolves after streaming starts.
    await expect(editor.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  });

  test("switching the forms off restores the notices", async ({ browser }) => {
    const admin = await session(browser, "admin");
    await setForms(admin, false);
    const visitor = await browser.newPage();
    await visitor.goto("/volunteer");
    await expect(visitor.getByText("The volunteer form is not available yet")).toBeVisible();
    await expect(visitor.getByRole("form", { name: "Volunteer interest form" })).toHaveCount(0);
    await visitor.close();
  });
});
