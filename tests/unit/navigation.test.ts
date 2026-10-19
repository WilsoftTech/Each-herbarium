import { describe, expect, it } from "vitest";
import {
  hasMenu,
  isActivePath,
  megaMenuPanelId,
  primaryNavigation,
  type NavItem,
} from "@/config/navigation";

const items: readonly NavItem[] = primaryNavigation;

describe("primary navigation config", () => {
  it("lists the required top-level items in order", () => {
    expect(items.map((item) => item.label)).toEqual([
      "Home",
      "About EACH",
      "Our Work",
      "Herbarium",
      "Research & Learning",
      "Projects & Impact",
      "Get Involved",
    ]);
  });

  it("uses unique ids and internal, absolute hrefs", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    for (const item of items) {
      expect(item.href).toMatch(/^\/[a-z0-9/-]*$/);
      for (const link of item.groups?.flatMap((group) => group.links) ?? []) {
        expect(link.href).toMatch(/^\/[a-z0-9/-]+$/);
      }
    }
  });

  it("gives every item except Home a mega menu with a summary and links", () => {
    for (const item of items) {
      if (item.id === "home") {
        expect(hasMenu(item)).toBe(false);
        continue;
      }
      expect(hasMenu(item)).toBe(true);
      for (const group of item.groups ?? []) {
        expect(group.links.length).toBeGreaterThan(0);
      }
    }
  });

  it("does not repeat a link within one menu", () => {
    for (const item of items) {
      const hrefs = item.groups?.flatMap((group) => group.links.map((link) => link.href)) ?? [];
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });

  it("features only credited images with alt text", () => {
    const features = items.flatMap((item) => (item.feature ? [item.feature] : []));
    expect(features.length).toBeGreaterThan(0);
    for (const { image } of features) {
      expect(image.alt.length).toBeGreaterThan(20);
      expect(image.credit.author).not.toBe("");
      expect(image.credit.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//);
      expect(image.src).toMatch(/^\/images\//);
    }
  });
});

describe("isActivePath", () => {
  it("matches Home only on the root path", () => {
    expect(isActivePath({ href: "/" }, "/")).toBe(true);
    expect(isActivePath({ href: "/" }, "/herbarium")).toBe(false);
  });

  it("matches a section and its sub-pages, not look-alike prefixes", () => {
    expect(isActivePath({ href: "/herbarium" }, "/herbarium")).toBe(true);
    expect(isActivePath({ href: "/herbarium" }, "/herbarium/collections")).toBe(true);
    expect(isActivePath({ href: "/herbarium" }, "/herbariums")).toBe(false);
  });
});

describe("megaMenuPanelId", () => {
  it("builds a stable element id from the item id", () => {
    expect(megaMenuPanelId({ id: "our-work" })).toBe("mega-menu-our-work");
  });
});
