import { expect, type Page } from "@playwright/test";
import { primaryNavigation, type NavItem } from "../../src/config/navigation";

/**
 * Section routes linked from the navigation that are built in M03. Until then
 * they return 404, and Next.js logs a failed (prefetch) request for them.
 */
const pendingRoutes = new Set(
  (primaryNavigation as readonly NavItem[])
    .flatMap((item) => [
      item.href,
      ...(item.groups ?? []).flatMap((g) => g.links.map((l) => l.href)),
    ])
    .filter((href) => href !== "/"),
);

export function isPendingRoute(url: string): boolean {
  return pendingRoutes.has(new URL(url).pathname);
}

/**
 * Collects console errors, uncaught exceptions and failed responses. 404s for
 * pending M03 routes are expected and ignored; everything else is reported.
 */
export function trackErrors(page: Page) {
  const errors: string[] = [];

  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const url = message.location().url;
    if (message.text().startsWith("Failed to load resource") && url && isPendingRoute(url)) return;
    errors.push(`console: ${message.text()} (${url})`);
  });
  page.on("response", (response) => {
    if (response.status() < 400) return;
    if (response.status() === 404 && isPendingRoute(response.url())) return;
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
    `scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`,
  ).toBeLessThanOrEqual(clientWidth);
}

export const desktop = { width: 1440, height: 900 };
