import { expect, test, type Page } from "@playwright/test";
import { publicRoutes } from "../routes";
import { desktop, trackErrors } from "./helpers";

/** The photograph currently shown in a crossfading panel (the one at full opacity). */
async function visiblePanelImage(page: Page, panel: string) {
  return page
    .locator(`${panel} img`)
    .evaluateAll((images) =>
      images
        .filter((img) => getComputedStyle(img).opacity === "1")
        .map((img) =>
          decodeURIComponent((img as HTMLImageElement).currentSrc || img.getAttribute("src") || ""),
        ),
    );
}

test.describe("cinematic interactions", () => {
  test.use({ viewport: desktop, reducedMotion: "no-preference" });

  test("programme explorer follows keyboard focus and mouse hover", async ({ page }) => {
    const tracker = trackErrors(page);
    await page.goto("/");
    const list = page.locator("[data-explorer-list]");
    await list.scrollIntoViewIfNeeded();

    const medicinal = list.getByRole("link", { name: /Medicinal plants/ });
    await medicinal.focus();
    await expect(medicinal).toHaveAttribute("data-active", "true");
    await expect
      .poll(() => visiblePanelImage(page, "section#programmes [aria-hidden='true']"))
      .toEqual([expect.stringContaining("warburgia-ugandensis-leaves")]);

    const herbarium = list.getByRole("link", { name: /The herbarium/ });
    await herbarium.hover();
    await expect(herbarium).toHaveAttribute("data-active", "true");
    await expect(medicinal).not.toHaveAttribute("data-active", "true");

    await herbarium.click();
    await expect(page).toHaveURL("/herbarium");
    tracker.expectNone();
  });

  test("the pinned story keeps its panel in view and follows the chapters", async ({ page }) => {
    await page.goto("/");
    const chapters = page.locator("[data-step]");
    await expect(chapters).toHaveCount(4);

    await chapters.nth(2).scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect(chapters.nth(2)).toHaveAttribute("data-active", "true");

    const panel = page.locator("section[aria-labelledby='heritage-title'] .sticky");
    await expect(panel).toBeInViewport();
    await expect(panel).toContainText("03");
    await expect(panel).toContainText("Wetlands");
  });

  test("statement text brightens as it reaches the reading position", async ({ page }) => {
    await page.goto("/");
    const words = page.locator("#introduction [data-word]");
    await page.locator("#introduction").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 500);
    await expect.poll(() => words.last().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });

  test("photographs drift on scroll", async ({ page }) => {
    await page.goto("/our-work/plant-conservation");
    const media = page.locator("[data-parallax]").first();
    await media.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 300);
    await expect
      .poll(() => media.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe("none");
  });

  test("client navigation fades the next page in and moves through history", async ({ page }) => {
    const tracker = trackErrors(page);
    await page.goto("/about");
    await page
      .getByRole("main")
      .getByRole("link", { name: /^Mission and values/ })
      .first()
      .click();
    await expect(page).toHaveURL("/about/mission");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "About EACH" })
      .click();
    await expect(page).toHaveURL("/about");
    await page.goBack();
    await expect(page).toHaveURL("/about/mission");
    tracker.expectNone();
  });
});

test.describe("reduced motion across pages", () => {
  test.use({ viewport: desktop, reducedMotion: "reduce" });

  for (const route of ["/", "/herbarium", "/our-work/plant-conservation", "/projects"]) {
    test(`${route}: nothing is hidden or moved by animation`, async ({ page }) => {
      await page.goto(route);
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y <= height; y += 800) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
      }
      await page.waitForTimeout(300);
      const hidden = await page
        .locator("[data-reveal], [data-word]")
        .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
      expect(hidden).toBe(0);
      const moved = await page
        .locator("[data-parallax], [data-hero-media]")
        .evaluateAll((els) => els.filter((el) => getComputedStyle(el).transform !== "none").length);
      expect(moved).toBe(0);
    });
  }

  test("the programme explorer still responds, without movement", async ({ page }) => {
    await page.goto("/");
    const link = page
      .locator("[data-explorer-list]")
      .getByRole("link", { name: /Indigenous knowledge/ });
    await link.focus();
    await expect(link).toHaveAttribute("data-active", "true");
  });
});

test.describe("without JavaScript", () => {
  test.use({ viewport: desktop, javaScriptEnabled: false });

  test("every route shows its full content", async ({ page }) => {
    test.setTimeout(120_000);
    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page.locator("h1"), route).toBeVisible();
      const hidden = await page
        .locator("[data-reveal], [data-word], [data-step]")
        .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
      expect(hidden, route).toBe(0);
      await expect(page.getByRole("navigation", { name: "Footer" }), route).toBeVisible();
    }
  });
});
