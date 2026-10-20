import { expect, test } from "@playwright/test";

test("responses carry the baseline security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(response.status()).toBe(200);
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("the admin area requires signing in and is never indexed", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/sign-in$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]:not([content*="noindex"])')).toHaveCount(0);
});

test("uploaded media are only served for known keys", async ({ request }) => {
  const response = await request.get("/media/../../etc/passwd");
  expect([400, 404]).toContain(response.status());
  const unknown = await request.get("/media/2026/01/00000000-0000-0000-0000-000000000000.jpg");
  expect(unknown.status()).toBe(404);
});
