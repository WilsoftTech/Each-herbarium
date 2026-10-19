import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { publicRoutes } from "../routes";
import { desktop, expectNoHorizontalOverflow, trackErrors } from "./helpers";

const widths = [320, 390, 768, 1024, 1280, 1440, 1920];

test.describe("responsive layout", () => {
  for (const width of widths) {
    test(`no horizontal overflow on any route at ${width}px`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: 900 });
      for (const route of [...publicRoutes, "/design-system"]) {
        await page.goto(route);
        await expectNoHorizontalOverflow(page);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("no horizontal overflow with a mega menu open", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: /^Herbarium & Research/ }).click();
    await expect(page.locator("#mega-menu-herbarium")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  for (const route of ["/", "/herbarium", "/our-work/plant-conservation"]) {
    test(`the opening of ${route} does not shift layout while loading`, async ({ page }) => {
      await page.setViewportSize(desktop);
      await page.goto(route);
      await page.waitForLoadState("load");
      const cls = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let total = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries() as (PerformanceEntry & {
                value: number;
                hadRecentInput: boolean;
              })[]) {
                if (!entry.hadRecentInput) total += entry.value;
              }
            }).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => resolve(total), 1500);
          }),
      );
      expect(cls).toBeLessThan(0.05);
    });
  }
});

test.describe("accessibility (axe, WCAG 2.2 A/AA)", () => {
  const scan = (page: Page) =>
    new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

  const serious = (violations: { impact?: string | null; id: string; nodes: unknown[] }[]) =>
    violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id} (${v.nodes.length})`);

  /** Scrolls through the page so scroll-triggered entrances finish before scanning. */
  async function settle(page: Page) {
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= height; y += 700) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1600);
  }

  for (const route of [...publicRoutes, "/design-system"]) {
    test(`${route} has no serious violations`, async ({ page }) => {
      const tracker = trackErrors(page);
      await page.setViewportSize(desktop);
      await page.goto(route);
      await settle(page);
      const { violations } = await scan(page).analyze();
      expect(serious(violations), route).toEqual([]);
      tracker.expectNone();
    });
  }

  test("pages are also clean on a phone", async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["/", "/herbarium", "/bitwiire-herbarium-cafe", "/impact"]) {
      await page.goto(route);
      await settle(page);
      const { violations } = await scan(page).analyze();
      expect(serious(violations), route).toEqual([]);
    }
  });

  test("open mega menu has no serious violations", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/");
    await page.getByRole("button", { name: /^Our Work/ }).click();
    await page.waitForTimeout(1200);
    const { violations } = await scan(page).include("header").analyze();
    expect(serious(violations)).toEqual([]);
  });

  test("open mobile menu has no serious violations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Herbarium & Research, open section" }).click();
    await page.waitForTimeout(800);
    const { violations } = await scan(page).include("#mobile-menu").analyze();
    expect(serious(violations)).toEqual([]);
  });
});
