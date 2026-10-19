import type { Metadata } from "next";
import { media, type MediaAsset } from "@/config/media";
import { siteConfig } from "@/config/site";

type PageMetadataInput = {
  /** Page title; the root layout appends "| EACH". */
  title: string;
  description: string;
  /** Route path, used for the canonical URL (resolved against `metadataBase`). */
  path: `/${string}`;
  /** Social sharing image. Defaults to the homepage hero photograph. */
  image?: MediaAsset;
  /** Use the title as is, without the site suffix (the homepage). */
  absoluteTitle?: boolean;
  /**
   * Keep the page out of search results. Used for pages that show only
   * placeholder content, so it is never indexed as institutional fact.
   */
  noindex?: boolean;
};

/** Consistent metadata for every public route: title, description, canonical URL and Open Graph. */
export function pageMetadata({
  title,
  description,
  path,
  image = media.heroBwindiMist,
  absoluteTitle = false,
  noindex = false,
}: PageMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en",
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
