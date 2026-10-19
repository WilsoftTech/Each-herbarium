import { devices, expect, test, type Page } from "@playwright/test";
import { trackErrors } from "./helpers";

test.use({ ...devices["Pixel 7"] });

const menuButton = (page: Page) => page.getByRole("button", { name: "Menu" });

test.describe("mobile navigation", () => {
  test("desktop navigation is hidden and the Menu button is available", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    await expect(menuButton(page)).toBeVisible();
    const box = await menuButton(page).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("opens a full-screen dialog, locks scroll and traps focus", async ({ page }) => {
    const tracker = trackErrors(page);
    await page.goto("/");
    await menuButton(page).tap();

    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    const viewport = page.viewportSize()!;
    const box = await dialog.boundingBox();
    expect(box!.width).toBe(viewport.width);
    expect(box!.height).toBe(viewport.height);

    // Scroll lock: the document cannot scroll behind the dialog.
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    // Focus trap.
    for (let i = 0; i < 15; i += 1) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    tracker.expectNone();
  });

  test("Escape closes, restores focus to Menu and unlocks scroll", async ({ page }) => {
    await page.goto("/");
    await menuButton(page).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(menuButton(page)).toBeFocused();
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });

  test("drill into a section, use the accordion and go back", async ({ page }) => {
    await page.goto("/");
    await menuButton(page).tap();
    await page.getByRole("button", { name: "Herbarium & Research, open section" }).tap();

    const back = page.getByRole("button", { name: "Back to main menu" });
    await expect(back).toBeFocused();
    await expect(
      page.getByRole("dialog").getByRole("heading", { level: 2, name: "Herbarium & Research" }),
    ).toBeVisible();

    const learning = page
      .getByRole("dialog")
      .getByRole("button", { name: "Knowledge", exact: true });
    await expect(learning).toHaveAttribute("aria-expanded", "false");
    await learning.tap();
    await expect(learning).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("dialog").getByRole("link", { name: /^Resources/ })).toBeVisible();

    await back.tap();
    await expect(
      page.getByRole("button", { name: "Herbarium & Research, open section" }),
    ).toBeFocused();
  });

  test("following a link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    await menuButton(page).tap();
    await page.getByRole("button", { name: "Get Involved, open section" }).tap();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /^Volunteer/ })
      .tap();
    await expect(page).toHaveURL("/volunteer");
    await expect(
      page.getByRole("heading", { level: 1, name: "Volunteer with EACH" }),
    ).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });

  test("closes when the viewport grows to the desktop layout", async ({ page }) => {
    await page.goto("/");
    await menuButton(page).tap();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });
});
