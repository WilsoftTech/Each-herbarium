import { expect, type Page } from "@playwright/test";

/**
 * Collects console errors, uncaught exceptions and failed responses. Every
 * route linked from the site exists since M03, so any 4xx or 5xx response
 * is reported. Pass `allow` for responses a test expects (such as a 404 it
 * requests on purpose).
 */
export function trackErrors(
  page: Page,
  allow: (url: string, status: number) => boolean = () => false,
) {
  const errors: string[] = [];

  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const url = message.location().url;
    if (message.text().startsWith("Failed to load resource") && url && allow(url, 404)) return;
    errors.push(`console: ${message.text()} (${url})`);
  });
  page.on("response", (response) => {
    if (response.status() < 400 || allow(response.url(), response.status())) return;
    errors.push(`http ${response.status()}: ${response.url()}`);
  });

  return {
    errors,
    expectNone: () => expect(errors, errors.join("\n")).toEqual([]),
  };
}

/** Fails if the document is wider than the viewport. */
export async function expectNoHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `${page.url()}: scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`,
  ).toBeLessThanOrEqual(clientWidth);
}

export const desktop = { width: 1440, height: 900 };
