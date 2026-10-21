import { expect, test, type Page } from "@playwright/test";
import { legacySampleRoutes, publicRoutes } from "../routes";
import { desktop } from "./helpers";

test.use({ viewport: desktop });

const origin = (page: Page) => new URL(page.url()).origin;

/** Every link on the current page: internal paths (with any hash) and external URLs. */
async function linksOn(page: Page) {
  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((anchors) => anchors.map((a) => (a as HTMLAnchorElement).href));
  const here = origin(page);
  return {
    internal: hrefs.filter((href) => href.startsWith(here)).map((href) => new URL(href)),
    external: hrefs.filter((href) => !href.startsWith(here)),
  };
}

test("no broken internal links or in-page anchors on any route", async ({ page, request }) => {
  test.setTimeout(180_000);
  const checked = new Map<string, number>();
  const problems: string[] = [];

  for (const route of publicRoutes) {
    await page.goto(route);
    const { internal } = await linksOn(page);
    for (const url of internal) {
      if (url.hash && url.pathname === route) {
        const id = decodeURIComponent(url.hash.slice(1));
        const exists = await page.locator(`[id="${id}"]`).count();
        if (!exists) problems.push(`${route}: missing anchor ${url.hash}`);
      }
      const path = url.pathname;
      if (!checked.has(path)) checked.set(path, (await request.get(path)).status());
      if (checked.get(path) !== 200) problems.push(`${route} -> ${path} (${checked.get(path)})`);
    }
  }

  expect(problems, problems.join("\n")).toEqual([]);
  expect(checked.size).toBeGreaterThanOrEqual(publicRoutes.length);
});

test("external links are well-formed https URLs", async ({ page }) => {
  // Reachability of third-party sites is not checked here (network-dependent).
  const bad: string[] = [];
  for (const route of publicRoutes) {
    await page.goto(route);
    for (const href of (await linksOn(page)).external) {
      if (!/^https:\/\/[^\s/]+\.[a-z]{2,}\//.test(href)) bad.push(`${route}: ${href}`);
    }
  }
  expect(bad, bad.join("\n")).toEqual([]);
});

test("public navigation reaches every landing page and omits sample records", async ({ page }) => {
  test.setTimeout(180_000);
  const seen = new Set<string>(["/"]);
  const queue = ["/"];
  while (queue.length) {
    const path = queue.shift()!;
    await page.goto(path);
    for (const url of (await linksOn(page)).internal) {
      if (!seen.has(url.pathname)) {
        seen.add(url.pathname);
        queue.push(url.pathname);
      }
    }
  }
  for (const route of publicRoutes) expect([...seen], route).toContain(route);
  // Samples remain directly accessible for review, but must not be promoted
  // as projects or publications. Route tests still verify their labels/noindex.
  for (const route of legacySampleRoutes) expect([...seen], route).not.toContain(route);
  // The design system preview is internal and never linked.
  expect(seen.has("/design-system")).toBe(false);
});
