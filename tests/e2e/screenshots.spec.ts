import { devices, test } from "@playwright/test";

// Evidence capture, not an assertion suite. Run with:
//   SCREENSHOTS=1 npx playwright test screenshots
// Output: docs/audits/m02-screenshots/
test.skip(!process.env.SCREENSHOTS, "Set SCREENSHOTS=1 to capture evidence screenshots.");

const dir = "docs/audits/m02-screenshots";
const settle = 2200;

// Device presets carry defaultBrowserType, which cannot be set inside a describe,
// so only the emulation fields are taken.
const { viewport, userAgent, isMobile, hasTouch } = devices["Pixel 7"];
// Captured at 1x to keep the committed evidence small.
const pixel7 = { viewport, userAgent, deviceScaleFactor: 1, isMobile, hasTouch };

const viewports = {
  mobile: pixel7,
  tablet: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
} as const;

for (const [name, options] of Object.entries(viewports)) {
  test.describe(name, () => {
    test.use(options);

    test(`${name} screenshots`, async ({ page }) => {
      const shot = (file: string) =>
        page.screenshot({ path: `${dir}/${name}-${file}.jpg`, type: "jpeg", quality: 70 });

      await page.goto("/");
      await page.waitForTimeout(settle);
      await shot("hero");

      if (name === "desktop") {
        await page.getByRole("button", { name: /^Herbarium/ }).hover();
        await page.waitForTimeout(1400);
        await shot("mega-menu-herbarium");
        await page.getByRole("button", { name: /^About EACH/ }).hover();
        await page.waitForTimeout(1200);
        await shot("mega-menu-about");
        await page.mouse.move(720, 880);
        await page.waitForTimeout(800);
      } else {
        await page.getByRole("button", { name: "Menu" }).click();
        await page.waitForTimeout(1200);
        await shot("menu");
        await page.getByRole("button", { name: "Our Work, open section" }).click();
        await page.waitForTimeout(1000);
        await shot("menu-section");
        await page.keyboard.press("Escape");
        await page.waitForTimeout(800);
      }

      await page.locator("#focus").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1800);
      await shot("focus-section");

      await page.goto("/design-system");
      await page.waitForTimeout(1200);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `${dir}/${name}-design-system.jpg`,
        type: "jpeg",
        quality: 60,
        fullPage: true,
      });
    });
  });
}
