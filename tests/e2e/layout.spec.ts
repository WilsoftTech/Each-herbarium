import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { desktop, expectNoHorizontalOverflow, trackErrors } from "./helpers";

const widths = [320, 390, 768, 1024, 1280, 1440, 1920];
const routes = ["/", "/design-system", "/herbarium"];

test.describe("responsive layout", () => {
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
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
    await page.getByRole("button", { name: /^Research & Learning/ }).click();
    await expect(page.locator("#mega-menu-research-learning")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("the hero image does not shift layout while loading", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/");
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
});

test.describe("accessibility (axe, WCAG 2.2 A/AA)", () => {
  const scan = (page: import("@playwright/test").Page) =>
    new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);

  const serious = (violations: { impact?: string | null; id: string; nodes: unknown[] }[]) =>
    violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id} (${v.nodes.length})`);

  test("homepage and design system have no serious violations", async ({ page }) => {
    const tracker = trackErrors(page);
    await page.setViewportSize(desktop);
    for (const route of ["/", "/design-system"]) {
      await page.goto(route);
      await page.waitForTimeout(1600); // Let entrance animations finish.
      const { violations } = await scan(page).analyze();
      expect(serious(violations), route).toEqual([]);
    }
    tracker.expectNone();
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
    await page.getByRole("button", { name: "Herbarium, open section" }).click();
    await page.waitForTimeout(800);
    const { violations } = await scan(page).include("#mobile-menu").analyze();
    expect(serious(violations)).toEqual([]);
  });
});
