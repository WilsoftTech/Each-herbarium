import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders a native button with the primary variant by default", () => {
    const html = renderToStaticMarkup(<Button>Save</Button>);
    expect(html).toMatch(/^<button\b/);
    expect(html).toContain("bg-primary");
    expect(html).toContain("text-primary-foreground");
  });

  it("renders its child element when asChild is set", () => {
    const html = renderToStaticMarkup(
      <Button asChild variant="outline">
        <a href="/herbarium">Herbarium</a>
      </Button>,
    );
    expect(html).toMatch(/^<a\b[^>]*href="\/herbarium"/);
    expect(html).toContain("border-foreground/40");
    expect(html).not.toContain("<button");
  });

  it("lets callers override conflicting utilities", () => {
    const html = renderToStaticMarkup(<Button className="px-10">Wide</Button>);
    expect(html).toContain("px-10");
    expect(html).not.toMatch(/\bpx-6\b/);
  });
});
