import { describe, expect, it } from "vitest";
import { isApprovedHref, staticRoutes } from "@/config/routes";
import {
  applyNavigation,
  hasMenu,
  navigationOverridesSchema,
  primaryNavigation,
  type NavItem,
} from "@/config/navigation";
import { blocks, joinLines, lines } from "@/features/cms/form-data";
import { homeContentSchema, homeSectionKeys, visibleSections } from "@/features/pages/home-content";
import { pageRegistry } from "@/features/pages/registry";
import { bespokeProgrammeSlugs } from "@/features/programmes/schema";
import { seedHomeContent } from "../../prisma/seed/landing-pages";

const base = primaryNavigation as readonly NavItem[];
const seeded = () => seedHomeContent((asset) => `media-${asset.src}`);

describe("approved links", () => {
  it("accepts every approved route, content detail pages and https URLs", () => {
    for (const route of staticRoutes) expect(isApprovedHref(route)).toBe(true);
    expect(isApprovedHref("/projects/montane-forest")).toBe(true);
    expect(isApprovedHref("/our-work/new-programme")).toBe(true);
    expect(isApprovedHref("/volunteer#how")).toBe(true);
    expect(isApprovedHref("https://example.org/report")).toBe(true);
  });

  it("rejects unknown pages, other schemes and credentials", () => {
    for (const href of [
      "/not-a-page",
      "/admin",
      "/admin/users",
      "//evil.example",
      "javascript:alert(1)",
      "http://example.org",
      "https://user:pass@example.org",
      "/projects/Bad_Slug",
      "/volunteer#<script>",
      "",
    ]) {
      expect(isApprovedHref(href), href).toBe(false);
    }
  });
});

describe("page registry", () => {
  it("covers every fixed public route except the designed programme pages", () => {
    const managed = Object.values(pageRegistry).map((entry) => entry.route);
    const programmeRoutes = bespokeProgrammeSlugs.map((slug) => `/our-work/${slug}`);
    expect(new Set([...managed, ...programmeRoutes])).toEqual(new Set(staticRoutes));
    expect(new Set(managed).size).toBe(managed.length);
  });

  it("requires a photograph for pages that open with a full-bleed hero", () => {
    const required = Object.entries(pageRegistry)
      .filter(([, entry]) => "imageRequired" in entry)
      .map(([slug]) => slug);
    expect(required.sort()).toEqual(["home", "our-work"]);
  });
});

describe("homepage content", () => {
  it("accepts the seeded M03 composition", () => {
    const result = homeContentSchema.safeParse(seeded());
    expect(result.success).toBe(true);
    expect(visibleSections(seeded().layout)).toEqual(homeSectionKeys);
  });

  it("rejects links to pages that do not exist", () => {
    const content = seeded();
    content.hero.primaryAction.href = "/nowhere";
    const result = homeContentSchema.safeParse(content);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["hero", "primaryAction", "href"]);
  });

  it("keeps the introduction first and every section listed once", () => {
    const moved = seeded();
    moved.layout.order = [...moved.layout.order.slice(1), "introduction"];
    expect(homeContentSchema.safeParse(moved).success).toBe(false);

    const duplicate = seeded();
    duplicate.layout.order = [...duplicate.layout.order.slice(0, -1), "programmes"];
    expect(homeContentSchema.safeParse(duplicate).success).toBe(false);

    const hiddenIntro = seeded();
    hiddenIntro.layout.hidden = ["introduction"];
    expect(homeContentSchema.safeParse(hiddenIntro).success).toBe(false);
  });

  it("hides and reorders sections after the introduction", () => {
    const content = seeded();
    content.layout.order = ["introduction", "stories", ...content.layout.order.slice(1, -1)];
    content.layout.hidden = ["presence", "bitwiire"];
    const parsed = homeContentSchema.parse(content);
    const visible = visibleSections(parsed.layout);
    expect(visible.slice(0, 2)).toEqual(["introduction", "stories"]);
    expect(visible).not.toContain("presence");
    expect(visible).not.toContain("bitwiire");
  });

  it("limits text lengths and requires images", () => {
    const content = seeded();
    content.heritage.statement = "x".repeat(201);
    content.research.imageId = "";
    const result = homeContentSchema.safeParse(content);
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((issue) => issue.path.join("."));
    expect(paths).toEqual(expect.arrayContaining(["heritage.statement", "research.imageId"]));
  });
});

describe("navigation overrides", () => {
  it("leaves the approved navigation unchanged without overrides", () => {
    expect(applyNavigation(base, { items: {}, links: {} })).toEqual(base);
  });

  it("relabels, reorders and hides links without changing destinations", () => {
    const result = applyNavigation(base, {
      items: { about: { label: "Who we are", order: 99 } },
      links: {
        "/about/leadership": { hidden: true },
        "/about/mission": { label: "Our mission", description: "Why we exist." },
        "/volunteer": { order: 9 },
      },
    });
    expect(result.at(-1)?.id).toBe("about");
    const about = result.find((item) => item.id === "about")!;
    expect(about.label).toBe("Who we are");
    expect(about.href).toBe("/about");
    const links = about.groups!.flatMap((group) => group.links);
    expect(links.map((link) => link.href)).not.toContain("/about/leadership");
    expect(links.find((link) => link.href === "/about/mission")).toMatchObject({
      label: "Our mission",
      description: "Why we exist.",
    });
    const takePart = result
      .find((item) => item.id === "get-involved")!
      .groups!.find((group) => group.heading === "Take part")!;
    expect(takePart.links.map((link) => link.href)).toEqual(["/partnerships", "/volunteer"]);
  });

  it("drops emptied groups and turns an emptied menu into a plain link", () => {
    const projects = base.find((item) => item.id === "projects-impact")!;
    const hidden = Object.fromEntries(
      projects.groups!.flatMap((group) => group.links).map((link) => [link.href, { hidden: true }]),
    );
    const result = applyNavigation(base, { items: {}, links: hidden });
    const item = result.find((entry) => entry.id === "projects-impact")!;
    expect(item.groups).toBeUndefined();
    expect(hasMenu(item)).toBe(false);
    expect(item.href).toBe("/projects");
  });

  it("validates stored overrides", () => {
    expect(navigationOverridesSchema.safeParse({}).success).toBe(true);
    expect(navigationOverridesSchema.safeParse({ items: { about: { label: "" } } }).success).toBe(
      false,
    );
    expect(navigationOverridesSchema.safeParse({ links: { "/about": { order: 0 } } }).success).toBe(
      false,
    );
  });
});

describe("rich-text form fields", () => {
  it("keeps line breaks inside blocks so lists survive", () => {
    expect(blocks("## Heading\n\nIntro line\n\n- one\n  - two\r\n\r\n\n")).toEqual([
      "## Heading",
      "Intro line",
      "- one\n- two",
    ]);
  });

  it("round-trips one-per-line lists", () => {
    expect(lines(joinLines(["First", "Second"]))).toEqual(["First", "Second"]);
  });
});
