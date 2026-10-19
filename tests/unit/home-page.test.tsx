import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/(public)/page";
import { siteConfig } from "@/config/site";

describe("Home page", () => {
  const html = renderToStaticMarkup(<Home />);

  it("renders a single main landmark", () => {
    expect(html.match(/<main\b/g)).toHaveLength(1);
  });

  it("renders the organisation name as the only h1", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`<h1[^>]*>${siteConfig.name}</h1>`));
  });

  it("uses semantic colour tokens rather than raw brand values", () => {
    expect(html).toContain("text-primary");
    expect(html).not.toMatch(/#[0-9a-f]{6}/i);
  });
});
