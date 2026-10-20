import { expect, test } from "@playwright/test";
import { desktop } from "./helpers";

test.describe("reduced motion", () => {
  test.use({ viewport: desktop, reducedMotion: "reduce" });

  test("hero is shown in its final state immediately", async ({ page }) => {
    await page.goto("/");
    const words = page.locator("#hero-title span span");
    await expect(words.first()).toBeVisible();
    for (const transform of await words.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).transform),
    )) {
      // A finished CSS animation may report the identity matrix instead of "none".
      expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
    }
  });

  test("scrolling does not move the hero and revealed content is not hidden", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(400);
    await expect(page.locator("[data-hero-media]")).toHaveCSS("transform", "none");

    await page.locator("#programmes").scrollIntoViewIfNeeded();
    for (const opacity of await page
      .locator("[data-reveal]")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))) {
      expect(opacity).toBe("1");
    }
  });

  test("menus still open, without transform animation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Herbarium/ }).click();
    await expect(page.locator("#mega-menu-herbarium")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mega-menu-herbarium")).toHaveCount(0);
  });
});

test.describe("motion allowed", () => {
  test.use({ viewport: desktop, reducedMotion: "no-preference" });

  test("cards reveal as they scroll into view", async ({ page }) => {
    await page.goto("/our-work");
    const firstCard = page.locator("#programmes article").first();
    await firstCard.scrollIntoViewIfNeeded();
    await expect.poll(() => firstCard.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});

test.describe("without JavaScript", () => {
  test.use({ viewport: desktop, javaScriptEnabled: false });

  test("all content is visible and navigation links remain reachable", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Preserving East Africa's Plant Heritage." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore the herbarium" })).toBeVisible();

    const projects = page.locator("section[aria-labelledby=projects-title]");
    await expect(projects.locator("article")).toHaveCount(0);
    await expect(projects.locator('[data-pending="projects"]')).toBeVisible();

    // Exercise real programme cards, rather than requiring sample projects.
    await page.goto("/our-work");
    const cards = page.locator("#programmes article");
    await expect(cards).toHaveCount(4);
    for (const opacity of await cards.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).opacity),
    )) {
      expect(opacity).toBe("1");
    }

    // The footer sitemap gives every section without JavaScript.
    const footer = page.getByRole("navigation", { name: "Footer" });
    await expect(
      footer.getByRole("link", { name: "Herbarium & Research", exact: true }),
    ).toBeVisible();
    await expect(footer.getByRole("link", { name: "Volunteer" })).toBeVisible();
  });
});
