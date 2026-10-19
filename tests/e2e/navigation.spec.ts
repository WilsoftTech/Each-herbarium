import { expect, test } from "@playwright/test";
import { desktop, trackErrors } from "./helpers";

test.use({ viewport: desktop });

test("homepage renders the hero and organisation identity", async ({ page }) => {
  const tracker = trackErrors(page);
  await page.goto("/");

  await expect(page).toHaveTitle("East African Community Herbariums");
  await expect(
    page.getByRole("heading", { level: 1, name: "Preserving East Africa's Plant Heritage." }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore the herbarium" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get involved", exact: true })).toBeVisible();
  tracker.expectNone();
});

test("unknown routes return 404 inside the site shell and link back home", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();

  await page.getByRole("link", { name: "Return to the homepage" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Preserving East Africa's Plant Heritage.",
  );
});

test("client-side navigation away and back re-initialises animation without errors", async ({
  page,
}) => {
  const tracker = trackErrors(page);
  await page.goto("/design-system");
  await expect(page.getByRole("heading", { level: 1, name: "Design system" })).toBeVisible();

  // Logo link: client-side navigation to the homepage.
  await page
    .getByRole("banner")
    .getByRole("link", { name: "EACH, East African Community Herbariums, home" })
    .click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Back and forward through history.
  await page.goBack();
  await expect(page).toHaveURL("/design-system");
  await page.goForward();
  await expect(page).toHaveURL("/");

  // The hero's scroll animation is live again after remounting.
  const media = page.locator("[data-hero-media]");
  await page.mouse.wheel(0, 500);
  await expect.poll(() => media.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");

  // Into a pending section through the menu, then back home.
  await page.mouse.wheel(0, -2000);
  await page.getByRole("button", { name: /^Herbarium/ }).click();
  await page
    .locator("#mega-menu-herbarium")
    .getByRole("link", { name: /^Collections/ })
    .click();
  await expect(page).toHaveURL("/herbarium/collections");
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Return to the homepage" }).click();
  await expect(page).toHaveURL("/");

  tracker.expectNone();
});
