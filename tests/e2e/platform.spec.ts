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

test("the admin area denies access without revealing itself", async ({ page }) => {
  const response = await page.goto("/admin");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Administration" })).toHaveCount(0);
  await expect(page).not.toHaveTitle(/admin/i);
  const robots = page.locator('meta[name="robots"]');
  await expect(robots.first()).toBeAttached();
  await expect(page.locator('meta[name="robots"]:not([content*="noindex"])')).toHaveCount(0);
});
