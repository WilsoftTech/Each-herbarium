import { expect, test, type Page } from "@playwright/test";
import { desktop, trackErrors } from "./helpers";

test.use({ viewport: desktop });

const trigger = (page: Page, name: string) =>
  page.getByRole("navigation", { name: "Primary" }).getByRole("button", {
    name: new RegExp(`^${name}`),
  });

test.describe("desktop mega menus", () => {
  test("hover opens a menu with featured photography; leaving closes it", async ({ page }) => {
    const tracker = trackErrors(page);
    await page.goto("/");
    await trigger(page, "Herbarium").hover();

    await expect(trigger(page, "Herbarium")).toHaveAttribute("aria-expanded", "true");
    await expect(trigger(page, "Herbarium")).toHaveAttribute(
      "aria-controls",
      "mega-menu-herbarium",
    );
    const panel = page.locator("#mega-menu-herbarium");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: /^Collections/ })).toBeVisible();
    await expect(panel.locator("img")).toBeVisible();
    await expect(panel.getByRole("link", { name: "Royal Botanic Gardens, Kew" })).toBeVisible();

    // Moving across to another trigger switches menus.
    await trigger(page, "Our Work").hover();
    await expect(trigger(page, "Our Work")).toHaveAttribute("aria-expanded", "true");
    await expect(trigger(page, "Herbarium")).toHaveAttribute("aria-expanded", "false");

    // Leaving the navigation for the page closes the hover-opened menu.
    await page.mouse.move(720, 880);
    await expect(trigger(page, "Our Work")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("[data-mega-panel]")).toHaveCount(0);
    tracker.expectNone();
  });

  test("click pins a menu open; clicking outside closes it", async ({ page }) => {
    await page.goto("/");
    await trigger(page, "Get Involved").click();
    await expect(trigger(page, "Get Involved")).toHaveAttribute("aria-expanded", "true");

    await page.mouse.move(720, 880);
    await page.waitForTimeout(400);
    await expect(trigger(page, "Get Involved")).toHaveAttribute("aria-expanded", "true");

    await page.mouse.click(720, 880);
    await expect(trigger(page, "Get Involved")).toHaveAttribute("aria-expanded", "false");
  });

  test("keyboard: Enter opens, Tab enters the panel, Escape closes and restores focus", async ({
    page,
  }) => {
    await page.goto("/");
    await trigger(page, "About EACH").focus();
    await page.keyboard.press("Enter");
    await expect(trigger(page, "About EACH")).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Explore About EACH" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.locator("#mega-menu-about").getByRole("link", { name: /^Our story/ }),
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(trigger(page, "About EACH")).toHaveAttribute("aria-expanded", "false");
    await expect(trigger(page, "About EACH")).toBeFocused();
  });

  test("keyboard: arrows move between items, ArrowDown enters a menu", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Home" })
      .focus();
    await page.keyboard.press("ArrowRight");
    await expect(trigger(page, "About EACH")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(trigger(page, "Our Work")).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(trigger(page, "Our Work")).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Explore Our Work" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#mega-menu-our-work a").nth(1)).toBeFocused();
  });

  test("focus is always visible on navigation controls", async ({ page }) => {
    await page.goto("/");
    await trigger(page, "Herbarium").focus();
    await page.keyboard.press("ArrowRight");
    const outline = await trigger(page, "Research & Learning").evaluate(
      (el) => getComputedStyle(el).outlineStyle,
    );
    expect(outline).toBe("solid");
  });

  test("tabbing past the last link closes the menu", async ({ page }) => {
    await page.goto("/");
    await trigger(page, "Get Involved").focus();
    await page.keyboard.press("Enter");
    const links = page.locator("#mega-menu-get-involved a");
    const count = await links.count();
    for (let i = 0; i <= count; i += 1) await page.keyboard.press("Tab");
    await expect(trigger(page, "Get Involved")).toHaveAttribute("aria-expanded", "false");
  });

  test("selecting a link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    await trigger(page, "Projects & Impact").click();
    await page
      .locator("#mega-menu-projects-impact")
      .getByRole("link", { name: /^News and stories/ })
      .click();
    await expect(page).toHaveURL("/projects-impact/news");
    await expect(page.locator("[data-mega-panel]")).toHaveCount(0);
  });
});
