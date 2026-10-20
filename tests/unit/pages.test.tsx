/// <reference types="vite/client" />
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { landingSections } from "@/features/pages/landing-content";
import { pageRegistry } from "@/features/pages/registry";
import { designedProgrammeSections } from "@/features/programmes/designed-content";
import { seedLandingContent } from "../../prisma/seed/landing-content";
import { seedHomeContent } from "../../prisma/seed/landing-pages";
import { seedProgrammeContent } from "../../prisma/seed/programme-content";
import { noindexRoutes, publicRoutes } from "../routes";

type PageModule = {
  default: (props: {
    params: Promise<Record<string, string>>;
  }) => ReactElement | Promise<ReactElement>;
  metadata?: Metadata;
  generateMetadata?: (props: { params: Promise<Record<string, string>> }) => Promise<Metadata>;
  generateStaticParams?: () => Promise<Record<string, string>[]>;
};

// Parentheses are glob syntax, so match every page and keep the public group.
const modules = import.meta.glob<PageModule>("../../src/app/**/page.tsx");

/** Module for a concrete route, plus the params a dynamic segment receives. */
function resolve(route: string) {
  const exact = modules[`../../src/app/(public)${route === "/" ? "" : route}/page.tsx`];
  if (exact) return { load: exact, params: {} };
  for (const [file, load] of Object.entries(modules)) {
    if (!file.startsWith("../../src/app/(public)/")) continue;
    const pattern = file
      .replace("../../src/app/(public)", "")
      .replace(/\/page\.tsx$/, "")
      .replace(/\[(\w+)\]/g, "(?<$1>[^/]+)");
    const match = new RegExp(`^${pattern || "/"}$`).exec(route);
    if (match) return { load, params: { ...match.groups } };
  }
  throw new Error(`No page module for ${route}`);
}

async function renderRoute(route: string) {
  const { load, params } = resolve(route);
  const page = await load();
  const props = { params: Promise.resolve(params) };
  const metadata = page.metadata ?? (await page.generateMetadata?.(props));
  const html = renderToStaticMarkup(await page.default(props));
  return { html, metadata };
}

const text = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

describe.each(publicRoutes)("%s", (route) => {
  it("renders exactly one h1 and server-renders visible content", async () => {
    const { html } = await renderRoute(route);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/style="[^"]*(opacity:\s*0|visibility:\s*hidden)/);
    expect(html).not.toMatch(/<main\b/); // The public layout owns the single main landmark.
  });

  it("gives every image an alt attribute", async () => {
    const { html } = await renderRoute(route);
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) expect(img).toMatch(/\balt="/);
  });

  it("has a title, description and canonical URL", async () => {
    const { metadata } = await renderRoute(route);
    expect(metadata?.title).toBeTruthy();
    expect(metadata?.description?.length).toBeGreaterThan(30);
    expect(metadata?.alternates?.canonical).toBe(route);
  });

  it("is indexed only when it presents approved content", async () => {
    const { metadata } = await renderRoute(route);
    const noindex = (noindexRoutes as readonly string[]).includes(route);
    expect(metadata?.robots).toEqual(noindex ? { index: false, follow: true } : undefined);
  });

  it("emits only well-formed structured data", async () => {
    const { html } = await renderRoute(route);
    for (const [, json] of html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    )) {
      expect(() => JSON.parse(json ?? "")).not.toThrow();
    }
  });
});

describe("homepage", () => {
  it("keeps the approved hero headline, copy and actions", async () => {
    const { html } = await renderRoute("/");
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
    expect(text(h1)).toBe("Preserving East Africa's Plant Heritage.");
    expect(text(html)).toContain(
      "Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations.",
    );
    expect(html).toMatch(/<a[^>]+href="\/herbarium"[^>]*>Explore the herbarium/);
    expect(html).toMatch(/<a[^>]+href="\/get-involved"[^>]*>Get involved/);
  });

  it("includes all twelve brief sections in order", async () => {
    const { html } = await renderRoute("/");
    const order = [
      'id="hero-title"',
      'id="introduction"',
      'id="programmes-title"',
      'id="heritage-title"',
      'id="projects-title"',
      'id="presence-title"',
      'id="research-title"',
      'id="community-title"',
      'id="bitwiire-title"',
      'id="involved-title"',
      'id="stories-title"',
    ];
    const positions = order.map((marker) => html.indexOf(marker));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it("describes the organisation in structured data", async () => {
    const { html } = await renderRoute("/");
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"@type":"WebSite"');
  });

  it("credits photographs and uses semantic colour tokens", async () => {
    const { html } = await renderRoute("/");
    expect(text(html)).toContain("Giles Laurent");
    expect(html).toContain("text-primary");
    expect(html.replace(/<script[\s\S]*?<\/script>/g, "")).not.toMatch(/#[0-9a-f]{6}\b/i);
  });
});

describe("content integrity", () => {
  it("states Bitwiire's independence wherever it is featured", async () => {
    for (const route of ["/", "/bitwiire-herbarium-cafe", "/about/partners"]) {
      const { html } = await renderRoute(route);
      expect(text(html), route).toMatch(/independent partner of EACH/);
    }
  });

  it("never presents a specimen database as existing", async () => {
    const { html } = await renderRoute("/herbarium");
    expect(text(html)).toContain("EACH does not yet offer a searchable specimen database");
    expect(html).not.toMatch(/<input|<form/);
  });

  it("marks medicinal plant content as not medical advice", async () => {
    const { html } = await renderRoute("/our-work/medicinal-plants");
    expect(text(html)).toContain("This is not medical advice");
  });

  it("publishes no impact figures until they are verified", async () => {
    const { html } = await renderRoute("/impact");
    expect(text(html)).toContain("Not yet published");
    expect(text(html)).not.toMatch(/\d{2,}\s*(hectares|species|specimens|people)/i);
  });

  it("labels placeholder projects and resources on their pages", async () => {
    for (const route of [
      "/projects/placeholder-montane-forest",
      "/resources/placeholder-publication",
    ]) {
      const { html } = await renderRoute(route);
      expect(html, route).toMatch(/data-pending="(projects|resources)"/);
    }
  });
});

/**
 * Visible words in seeded section content: every string except link
 * destinations and media ids, with rich-text markup reduced to its text.
 */
function seededWords(value: unknown, key = ""): string[] {
  if (typeof value === "string") {
    if (!value || key === "href" || key === "imageId") return [];
    return value
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .split(/\n\s*\n/)
      .map((part) => part.trim());
  }
  if (Array.isArray(value)) return value.flatMap((item) => seededWords(item, key));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([child, item]) => seededWords(item, child));
  }
  return [];
}

describe("designed sections come from the CMS", () => {
  const imageId = (asset: { src: string }) => asset.src;
  const landing = seedLandingContent(imageId);
  const programmes = seedProgrammeContent(imageId);

  it.each(Object.keys(landingSections) as (keyof typeof landing)[])(
    "%s shows every seeded word of its sections",
    async (slug) => {
      // Shown only when nothing is published in the collection they introduce.
      const conditional = new Set(slug === "resources" ? ["Documents", "Downloads"] : []);
      const { html } = await renderRoute(pageRegistry[slug].route);
      for (const words of seededWords(landing[slug])) {
        if (!conditional.has(words)) expect(text(html), words).toContain(words);
      }
    },
  );

  it.each(Object.keys(designedProgrammeSections) as (keyof typeof programmes)[])(
    "/our-work/%s shows every seeded word of its sections",
    async (slug) => {
      const { html } = await renderRoute(`/our-work/${slug}`);
      for (const words of seededWords(programmes[slug])) {
        expect(text(html), words).toContain(words);
      }
    },
  );

  it("the homepage shows its landscapes and regional presence", async () => {
    const home = seedHomeContent(imageId);
    const { html } = await renderRoute("/");
    for (const words of seededWords([home.heritage.landscapes, home.presence])) {
      expect(text(html), words).toContain(words);
    }
    expect(html).toMatch(/data-pending="regionalPresence"/);
  });

  it("keeps scientific names in italics", async () => {
    const { html } = await renderRoute("/our-work/medicinal-plants");
    expect(html).toContain("<i>Warburgia ugandensis</i>");
    expect(html).toContain("<i>Prunus africana</i>");
  });
});
