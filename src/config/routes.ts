/**
 * The approved public routes (M03 route list). The CMS validates internal
 * links against this list, so an editor cannot point a button at a page that
 * does not exist. Content detail pages are matched by pattern.
 */
export const staticRoutes = [
  "/",
  "/about",
  "/about/mission",
  "/about/leadership",
  "/about/partners",
  "/our-work",
  "/our-work/plant-conservation",
  "/our-work/environmental-conservation",
  "/our-work/medicinal-plants",
  "/our-work/indigenous-knowledge",
  "/herbarium",
  "/research",
  "/resources",
  "/projects",
  "/impact",
  "/get-involved",
  "/volunteer",
  "/partnerships",
  "/bitwiire-herbarium-cafe",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;

export type StaticRoute = (typeof staticRoutes)[number];

/** Detail pages of CMS collections: /projects/<slug>, /resources/<slug>, /our-work/<slug>. */
const detailRoute = /^\/(projects|resources|our-work)\/[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Whether `href` is a link the CMS may store: an approved site path
 * (optionally with a #fragment) or an https URL without credentials.
 */
export function isApprovedHref(href: string): boolean {
  if (href.startsWith("/")) {
    const [path = "", fragment] = href.split("#", 2);
    if (fragment !== undefined && !/^[a-z0-9-]+$/.test(fragment)) return false;
    return (staticRoutes as readonly string[]).includes(path) || detailRoute.test(path);
  }
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
