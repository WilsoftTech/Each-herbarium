import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RichText } from "@/components/ui/rich-text";
import { isSafeHref, parseInline, parseRichText } from "@/lib/rich-text";

describe("rich text", () => {
  it("parses headings, paragraphs and lists", () => {
    expect(parseRichText("## Title\nFirst line\ncontinues.\n\nSecond.\n- One\n- Two")).toEqual([
      { type: "heading", text: "Title" },
      { type: "paragraph", content: [{ type: "text", value: "First line continues." }] },
      { type: "paragraph", content: [{ type: "text", value: "Second." }] },
      {
        type: "list",
        items: [[{ type: "text", value: "One" }], [{ type: "text", value: "Two" }]],
      },
    ]);
  });

  it("keeps only site paths and https links", () => {
    expect(isSafeHref("/contact")).toBe(true);
    expect(isSafeHref("https://example.org/a")).toBe(true);
    for (const href of [
      "javascript:alert(1)",
      "//evil.example",
      "http://example.org",
      "data:text/html,x",
      "https://u:p@example.org",
    ]) {
      expect(isSafeHref(href), href).toBe(false);
    }
    expect(parseInline("see [x](javascript:alert(1)) now")).toEqual([
      { type: "text", value: "see " },
      { type: "text", value: "[x](javascript:alert(1)" },
      { type: "text", value: ") now" },
    ]);
  });

  it("renders stored HTML as text, never as markup", () => {
    const html = renderToStaticMarkup(
      <RichText source={'<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">'} />,
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders links as anchors", () => {
    const html = renderToStaticMarkup(<RichText source="Use the [contact page](/contact)." />);
    expect(html).toContain('<a href="/contact">contact page</a>');
  });
});
