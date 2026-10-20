import { expect, test } from "@playwright/test";
import { heroRoutes } from "../routes";
import { desktop } from "./helpers";

test.use({ viewport: desktop });

const header = (page: import("@playwright/test").Page) => page.locator("header[data-appearance]");

test("logo loads without a white plate and keeps its visibility shadow on both header surfaces", async ({
  page,
}) => {
  await page.goto("/");
  const logo = header(page).locator("img").first();
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute("src", /each-logo-transparent/);
  await expect(logo).toHaveJSProperty("complete", true);
  expect(await logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(logo.locator("..")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  expect(await logo.evaluate((image) => getComputedStyle(image).filter)).toContain("drop-shadow");

  await page.mouse.wheel(0, 400);
  await expect(header(page)).toHaveAttribute("data-appearance", "solid");
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((image) => getComputedStyle(image).filter)).toContain("drop-shadow");
});

test("header is transparent over the hero and turns solid on scroll", async ({ page }) => {
  await page.goto("/");
  await expect(header(page)).toHaveAttribute("data-appearance", "transparent");
  await expect(header(page)).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

  await page.mouse.wheel(0, 400);
  await expect(header(page)).toHaveAttribute("data-appearance", "solid");

  await page.mouse.wheel(0, -2000);
  await expect(header(page)).toHaveAttribute("data-appearance", "transparent");
});

test("header turns solid while a mega menu is open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Our Work/ }).click();
  await expect(header(page)).toHaveAttribute("data-appearance", "solid");
  await page.keyboard.press("Escape");
  await expect(header(page)).toHaveAttribute("data-appearance", "transparent");
});

test("header is solid on routes without a hero and content starts below it", async ({ page }) => {
  await page.goto("/design-system");
  await expect(header(page)).toHaveAttribute("data-appearance", "solid");
  const headerBox = await header(page).boundingBox();
  const h1Box = await page.getByRole("heading", { level: 1 }).boundingBox();
  expect(h1Box!.y).toBeGreaterThan(headerBox!.y + headerBox!.height);
});

test("skip link is the first focusable element and moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("header starts transparent on every route that opens with a hero", async ({ page }) => {
  for (const route of heroRoutes) {
    await page.goto(route);
    await expect(header(page), route).toHaveAttribute("data-appearance", "transparent");
  }
});

test("header is solid on routes that open with a typographic header", async ({ page }) => {
  for (const route of ["/about", "/herbarium", "/research", "/bitwiire-herbarium-cafe"]) {
    await page.goto(route);
    await expect(header(page), route).toHaveAttribute("data-appearance", "solid");
    const headerBox = await header(page).boundingBox();
    const h1Box = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(h1Box!.y, route).toBeGreaterThan(headerBox!.y + headerBox!.height);
  }
});

test("the current section is marked in the primary navigation", async ({ page }) => {
  await page.goto("/research");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(
    nav.getByRole("button", { name: "Herbarium & Research (current section)" }),
  ).toBeVisible();
  await expect(nav.getByRole("button", { name: /current section/ })).toHaveCount(1);
});
