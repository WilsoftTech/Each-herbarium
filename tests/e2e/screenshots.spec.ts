import { devices, test, type Page } from "@playwright/test";

// Evidence capture, not an assertion suite. Run with:
//   SCREENSHOTS=1 npx playwright test screenshots
// Output: docs/audits/m03-screenshots/ (M02 evidence stays in m02-screenshots/).
test.skip(!process.env.SCREENSHOTS, "Set SCREENSHOTS=1 to capture evidence screenshots.");

const dir = "docs/audits/m03-screenshots";

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

const pages = [
  ["home", "/"],
  ["about", "/about"],
  ["plant-conservation", "/our-work/plant-conservation"],
  ["medicinal-plants", "/our-work/medicinal-plants"],
  ["herbarium", "/herbarium"],
  ["research", "/research"],
  ["project", "/projects/placeholder-montane-forest"],
  ["impact", "/impact"],
  ["bitwiire", "/bitwiire-herbarium-cafe"],
] as const;

/** Pages also captured in full, at the smallest and largest widths. */
const fullPages = new Set(["home", "herbarium", "medicinal-plants", "project", "bitwiire"]);

/** Scrolls through the page so scroll-triggered entrances finish, then returns to the top. */
async function settle(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

for (const [name, options] of Object.entries(viewports)) {
  test.describe(name, () => {
    test.use(options);

    test(`${name} screenshots`, async ({ page }) => {
      test.setTimeout(240_000);
      for (const [slug, route] of pages) {
        await page.goto(route);
        await page.waitForTimeout(1600);
        await page.screenshot({ path: `${dir}/${name}-${slug}.jpg`, type: "jpeg", quality: 60 });
        // Full pages for a subset only, to keep the committed evidence small.
        if (name !== "tablet" && fullPages.has(slug)) {
          await settle(page);
          await page.screenshot({
            path: `${dir}/${name}-${slug}-full.jpg`,
            type: "jpeg",
            quality: 40,
            fullPage: true,
          });
        }
      }
    });
  });
}
