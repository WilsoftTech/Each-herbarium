import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/(public)/page";

describe("Home page", () => {
  const html = renderToStaticMarkup(<Home />);
  const text = html.replace(/<[^>]+>/g, "");

  it("renders a single main landmark", () => {
    expect(html.match(/<main\b/g)).toHaveLength(1);
  });

  it("renders the hero headline as the only h1", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
    expect(h1.replace(/<[^>]+>/g, "").replace("&#x27;", "'")).toBe(
      "Preserving East Africa's Plant Heritage.",
    );
  });

  it("renders the supporting copy and both calls to action", () => {
    expect(text).toContain(
      "Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations.",
    );
    expect(html).toMatch(/<a[^>]+href="\/herbarium"[^>]*>Explore the herbarium/);
    expect(html).toMatch(/<a[^>]+href="\/get-involved"[^>]*>Get involved/);
  });

  it("server-renders the final visible state (no hidden inline styles)", () => {
    expect(html).not.toMatch(/style="[^"]*(opacity:\s*0|visibility:\s*hidden)/);
  });

  it("credits the hero photograph", () => {
    expect(text).toContain("Giles Laurent");
    expect(text).toContain("CC BY-SA 4.0");
  });

  it("uses semantic colour tokens rather than raw brand values", () => {
    expect(html).toContain("text-primary");
    expect(html).not.toMatch(/#[0-9a-f]{6}\b/i);
  });
});
