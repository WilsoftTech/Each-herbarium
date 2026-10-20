import { siteConfig } from "@/config/site";

/**
 * schema.org structured data. Only verified facts go here: the organisation's
 * name, address on the web, logo and description, and the site's own page
 * hierarchy. Placeholder content never appears in structured data.
 */
export type JsonLdObject = { "@context": "https://schema.org"; "@type": string } & Record<
  string,
  unknown
>;

/** JSON for a `<script type="application/ld+json">`, with `<` escaped so it cannot close the tag. */
export function serializeJsonLd(data: JsonLdObject | readonly JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** `description` is the CMS tagline (Settings, Branding); defaults to the code description. */
export function organizationJsonLd(
  siteUrl: string,
  description: string = siteConfig.description,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/brand/each-logo.jpeg`,
    description,
  };
}

export function websiteJsonLd(siteUrl: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: `${siteUrl}/`,
  };
}

export type Crumb = { label: string; href: string };

export function breadcrumbJsonLd(crumbs: readonly Crumb[], siteUrl: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href === "/" ? "/" : crumb.href}`,
    })),
  };
}
