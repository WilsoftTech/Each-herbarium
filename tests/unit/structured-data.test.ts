import { describe, expect, it } from "vitest";
import { media } from "@/config/media";
import { pageMetadata } from "@/lib/metadata";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";

const site = "https://example.org";

describe("structured data", () => {
  it("escapes < so the payload cannot close its script tag", () => {
    const json = serializeJsonLd({
      "@context": "https://schema.org",
      "@type": "Thing",
      name: "</script><script>alert(1)</script>",
    });
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json).name).toBe("</script><script>alert(1)</script>");
  });

  it("describes the organisation with verified fields only", () => {
    const org = organizationJsonLd(site);
    expect(Object.keys(org).sort()).toEqual(
      ["@context", "@type", "alternateName", "description", "logo", "name", "url"].sort(),
    );
    expect(org.logo).toBe(`${site}/brand/each-logo.jpeg`);
    expect(websiteJsonLd(site).url).toBe(`${site}/`);
  });

  it("numbers breadcrumb positions from 1 with absolute URLs", () => {
    const list = breadcrumbJsonLd(
      [
        { label: "Home", href: "/" },
        { label: "Our work", href: "/our-work" },
      ],
      site,
    );
    expect(list.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "Our work", item: `${site}/our-work` },
    ]);
  });
});

describe("pageMetadata", () => {
  it("sets the title, description, canonical URL and sharing image", () => {
    const metadata = pageMetadata({
      title: "Herbarium",
      description: "About the herbarium.",
      path: "/herbarium",
      image: media.herbariumSheet,
    });
    expect(metadata.title).toBe("Herbarium");
    expect(metadata.alternates?.canonical).toBe("/herbarium");
    expect(metadata.openGraph).toMatchObject({ url: "/herbarium", title: "Herbarium" });
    expect(JSON.stringify(metadata.openGraph)).toContain(media.herbariumSheet.src);
    expect(metadata.robots).toBeUndefined();
  });

  it("keeps placeholder pages out of search results", () => {
    const metadata = pageMetadata({ title: "x", description: "y", path: "/x", noindex: true });
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("uses an absolute title for the homepage", () => {
    expect(
      pageMetadata({ title: "EACH", description: "y", path: "/", absoluteTitle: true }).title,
    ).toEqual({ absolute: "EACH" });
  });
});
