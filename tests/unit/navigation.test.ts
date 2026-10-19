import { describe, expect, it } from "vitest";
import {
  hasMenu,
  isActivePath,
  isActiveSection,
  legalNavigation,
  megaMenuPanelId,
  primaryNavigation,
  type NavItem,
} from "@/config/navigation";
import { staticRoutes as approvedRoutes } from "../routes";

const items: readonly NavItem[] = primaryNavigation;
const menuLinks = (item: NavItem) => item.groups?.flatMap((group) => group.links) ?? [];

describe("primary navigation config", () => {
  it("lists the top-level sections in order", () => {
    expect(items.map((item) => item.label)).toEqual([
      "Home",
      "About EACH",
      "Our Work",
      "Herbarium & Research",
      "Projects & Impact",
      "Get Involved",
    ]);
  });

  it("uses unique ids and internal, absolute hrefs", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    for (const item of items) {
      expect(item.href).toMatch(/^\/[a-z0-9/-]*$/);
      for (const link of menuLinks(item)) expect(link.href).toMatch(/^\/[a-z0-9/-]+$/);
    }
  });

  it("gives every item except Home a mega menu with a summary and links", () => {
    for (const item of items) {
      expect(hasMenu(item)).toBe(item.id !== "home");
      for (const group of item.groups ?? []) expect(group.links.length).toBeGreaterThan(0);
    }
  });

  it("does not repeat a link within a menu or across menus", () => {
    const hrefs = items.flatMap((item) => menuLinks(item).map((link) => link.href));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("links every approved route from the header menus or the footer", () => {
    const linked = new Set([
      ...items.flatMap((item) => [item.href, ...menuLinks(item).map((link) => link.href)]),
      ...legalNavigation.map((link) => link.href),
    ]);
    for (const route of approvedRoutes) expect(linked, route).toContain(route);
    expect([...linked].sort()).toEqual([...approvedRoutes].sort());
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
    expect(isActivePath({ href: "/projects" }, "/projects")).toBe(true);
    expect(isActivePath({ href: "/projects" }, "/projects/placeholder-montane-forest")).toBe(true);
    expect(isActivePath({ href: "/projects" }, "/projectsx")).toBe(false);
  });
});

describe("isActiveSection", () => {
  const section = (id: string) => items.find((item) => item.id === id)!;

  it("treats pages linked from a section's menu as part of it", () => {
    expect(isActiveSection(section("herbarium"), "/research")).toBe(true);
    expect(isActiveSection(section("herbarium"), "/resources/placeholder-publication")).toBe(true);
    expect(isActiveSection(section("projects-impact"), "/impact")).toBe(true);
    expect(isActiveSection(section("get-involved"), "/contact")).toBe(true);
    expect(isActiveSection(section("about"), "/bitwiire-herbarium-cafe")).toBe(true);
  });

  it("marks exactly one section active on every approved route", () => {
    for (const route of approvedRoutes) {
      if (["/privacy", "/terms", "/accessibility"].includes(route)) continue;
      const active = items.filter((item) => isActiveSection(item, route));
      expect(active, route).toHaveLength(1);
    }
  });
});

describe("megaMenuPanelId", () => {
  it("builds a stable element id from the item id", () => {
    expect(megaMenuPanelId({ id: "our-work" })).toBe("mega-menu-our-work");
  });
});
