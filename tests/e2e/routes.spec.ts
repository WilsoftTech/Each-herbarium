import { expect, test } from "@playwright/test";
import { noindexRoutes, publicRoutes } from "../routes";
import { desktop, trackErrors } from "./helpers";

test.use({ viewport: desktop });

test.describe("every public route", () => {
  for (const route of publicRoutes) {
    test(`${route} renders with metadata, one h1 and no errors`, async ({ page }) => {
      const tracker = trackErrors(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      await expect(page).toHaveTitle(/\S/);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Primary" })).toBeAttached();
      await expect(page.getByRole("contentinfo")).toBeVisible();

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length).toBeGreaterThan(30);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(route);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);

      const robots = page.locator('meta[name="robots"]');
      if ((noindexRoutes as readonly string[]).includes(route)) {
        await expect(robots).toHaveAttribute("content", /noindex/);
      } else {
        await expect(robots).toHaveCount(0);
      }

      for (const json of await page
        .locator('script[type="application/ld+json"]')
        .allTextContents()) {
        expect(() => JSON.parse(json)).not.toThrow();
      }
      if (route !== "/") {
        await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
      }
      tracker.expectNone();
    });
  }

  test("titles and descriptions are unique", async ({ page }) => {
    test.setTimeout(90_000);
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();
    for (const route of publicRoutes) {
      await page.goto(route);
      const title = await page.title();
      const description =
        (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(
        titles.get(title),
        `${route} repeats the title of ${titles.get(title)}`,
      ).toBeUndefined();
      expect(descriptions.get(description), `${route} repeats a description`).toBeUndefined();
      titles.set(title, route);
      descriptions.set(description, route);
    }
  });
});

test.describe("unknown content", () => {
  for (const route of ["/projects/not-a-project", "/resources/not-a-resource", "/about/history"]) {
    test(`${route} returns the 404 page inside the site shell`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }
});
