import type { StaticRoute } from "@/config/routes";

/**
 * Every public page with fixed route whose words are managed in the CMS.
 * The registry is the controlled set of editable pages: the route and the
 * page's layout stay in code, the CMS supplies the words, images and SEO.
 *
 * - `prose`: header plus rich-text body (policies).
 * - `landing`: header (eyebrow, title, lead, image) and SEO; the designed
 *   sections below the header remain in code.
 * - `home`: the homepage; header fields drive the cinematic hero and
 *   `content` holds the typed sections (home-content.ts).
 *
 * `image` says how the page uses its image: shown in the header, or only as
 * the image for social sharing (the layout has no header photograph).
 */
type PageEntry = {
  route: StaticRoute;
  kind: "home" | "landing" | "prose";
  /** Name in the admin list. */
  label: string;
  image: "header" | "sharing";
  /** The layout opens with a full-bleed photograph, so the image is required. */
  imageRequired?: true;
};

export const pageRegistry = {
  home: { route: "/", kind: "home", label: "Homepage", image: "header", imageRequired: true },
  about: { route: "/about", kind: "landing", label: "About EACH", image: "header" },
  "about-mission": {
    route: "/about/mission",
    kind: "landing",
    label: "Mission and values",
    image: "sharing",
  },
  "about-leadership": {
    route: "/about/leadership",
    kind: "landing",
    label: "Leadership",
    image: "sharing",
  },
  "about-partners": {
    route: "/about/partners",
    kind: "landing",
    label: "Partners",
    image: "sharing",
  },
  "our-work": {
    route: "/our-work",
    kind: "landing",
    label: "Our work",
    image: "header",
    imageRequired: true,
  },
  herbarium: { route: "/herbarium", kind: "landing", label: "The herbarium", image: "sharing" },
  research: { route: "/research", kind: "landing", label: "Research", image: "sharing" },
  impact: { route: "/impact", kind: "landing", label: "Impact", image: "sharing" },
  projects: { route: "/projects", kind: "landing", label: "Projects", image: "sharing" },
  resources: { route: "/resources", kind: "landing", label: "Resources", image: "sharing" },
  "get-involved": {
    route: "/get-involved",
    kind: "landing",
    label: "Get involved",
    image: "sharing",
  },
  volunteer: { route: "/volunteer", kind: "landing", label: "Volunteer", image: "header" },
  partnerships: {
    route: "/partnerships",
    kind: "landing",
    label: "Partnerships",
    image: "header",
  },
  "bitwiire-herbarium-cafe": {
    route: "/bitwiire-herbarium-cafe",
    kind: "landing",
    label: "Bitwiire Herbarium Cafe",
    image: "sharing",
  },
  contact: { route: "/contact", kind: "landing", label: "Contact", image: "sharing" },
  privacy: { route: "/privacy", kind: "prose", label: "Privacy", image: "sharing" },
  terms: { route: "/terms", kind: "prose", label: "Terms of use", image: "sharing" },
  accessibility: {
    route: "/accessibility",
    kind: "prose",
    label: "Accessibility",
    image: "sharing",
  },
} as const satisfies Record<string, PageEntry>;

export type ManagedPageSlug = keyof typeof pageRegistry;
export const managedPageSlugs = Object.keys(pageRegistry) as ManagedPageSlug[];

export function isManagedPageSlug(slug: string): slug is ManagedPageSlug {
  return Object.hasOwn(pageRegistry, slug);
}

/** The registry entry for a stored page, or undefined for an unknown slug. */
export function pageEntry(slug: string): PageEntry | undefined {
  return isManagedPageSlug(slug) ? pageRegistry[slug] : undefined;
}
