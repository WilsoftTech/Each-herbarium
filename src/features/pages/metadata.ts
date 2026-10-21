import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { MediaAsset } from "@/config/media";
import { getSiteSettings } from "@/features/settings";
import { pageMetadata } from "@/lib/metadata";
import { isLandingSlug, type LandingSlug } from "./landing-content";
import { getHomePage, getLandingPage, getPage } from "./queries";
import { pageRegistry, type ManagedPageSlug } from "./registry";
import type { LandingPage, Page } from "./schema";

/** The published page for a fixed route, or a 404 when it is not published. */
export async function loadManagedPage(slug: ManagedPageSlug): Promise<Page> {
  // Reuse the render's cached read rather than independently fetching the
  // same page and hero image again just for metadata.
  const page =
    slug === "home"
      ? (await getHomePage())?.page
      : isLandingSlug(slug)
        ? (await getLandingPage(slug))?.page
        : await getPage(slug);
  if (!page) notFound();
  return page;
}

/** The published landing page with its designed sections, or a 404 when it is not published. */
export async function loadLandingPage<S extends LandingSlug>(slug: S): Promise<LandingPage<S>> {
  const landing = await getLandingPage(slug);
  if (!landing) notFound();
  return landing;
}

/**
 * Metadata for a managed page from its published CMS fields: search title
 * (or title), description, canonical route, sharing image and indexing.
 * Placeholder pages and pages marked "hide from search engines" get noindex.
 */
export function managedPageMetadata(
  page: Page,
  options: { absoluteTitle?: boolean; noindex?: boolean; defaultImage?: MediaAsset | null } = {},
): Metadata {
  const route = pageRegistry[page.slug as ManagedPageSlug]?.route ?? `/${page.slug}`;
  return pageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.description,
    path: route,
    image: page.image ?? options.defaultImage ?? undefined,
    absoluteTitle: options.absoluteTitle,
    noindex: page.noindex || page.status === "placeholder" || Boolean(options.noindex),
  });
}

/** generateMetadata for a fixed route whose page is managed in the CMS. */
export async function metadataForPage(
  slug: ManagedPageSlug,
  options: { absoluteTitle?: boolean; noindex?: boolean } = {},
): Promise<Metadata> {
  const [page, settings] = await Promise.all([loadManagedPage(slug), getSiteSettings()]);
  return managedPageMetadata(page, { ...options, defaultImage: settings.socialImage });
}
