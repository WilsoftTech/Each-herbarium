import { expect, test } from "@playwright/test";

test("homepage renders the organisation identity", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("East African Community Herbariums");
  await expect(
    page.getByRole("heading", { level: 1, name: "East African Community Herbariums" }),
  ).toBeVisible();
});

test("unknown routes return 404 and link back to the homepage", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();

  await page.getByRole("link", { name: "Return to the homepage" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "East African Community Herbariums",
  );
});
