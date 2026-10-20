import { z } from "zod";
import { media, type MediaAsset } from "./media";

/**
 * The single source of truth for site navigation. The desktop mega menus, the
 * mobile menu and the footer all render from this file.
 *
 * Routes follow the M03 route list. Link labels and descriptions are
 * navigation copy, not statements about EACH's programmes; EACH reviews them
 * with the rest of the site copy (docs/content/awaiting-approval.md).
 */
export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  heading: string;
  links: readonly NavLink[];
};

export type NavFeature = {
  eyebrow: string;
  title: string;
  href: string;
  image: MediaAsset;
};

export type NavItem = {
  /** Stable key, also used to build element ids. */
  id: string;
  label: string;
  /** Landing page of the section. */
  href: string;
  /** One-sentence introduction shown in the mega menu and on cards. */
  summary?: string;
  /** Items with groups open a mega menu; items without are plain links. */
  groups?: readonly NavGroup[];
  feature?: NavFeature;
};

export type NavItemWithMenu = NavItem & { groups: readonly NavGroup[]; summary: string };

export const primaryNavigation = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "about",
    label: "About EACH",
    href: "/about",
    summary:
      "An independent initiative for plant conservation, herbarium development and botanical knowledge in East Africa, beginning in Uganda.",
    groups: [
      {
        heading: "Who we are",
        links: [
          {
            label: "Mission and values",
            href: "/about/mission",
            description: "The purpose and principles behind our work.",
          },
          {
            label: "Leadership",
            href: "/about/leadership",
            description: "The people who guide EACH.",
          },
        ],
      },
      {
        heading: "Partners",
        links: [
          {
            label: "Partners",
            href: "/about/partners",
            description: "Organisations we work alongside.",
          },
          {
            label: "Bitwiire Herbarium Cafe",
            href: "/bitwiire-herbarium-cafe",
            description: "An independent partner of EACH.",
          },
        ],
      },
    ],
  },
  {
    id: "our-work",
    label: "Our Work",
    href: "/our-work",
    summary:
      "Protecting East Africa's plant diversity by connecting plants, people, science and indigenous knowledge.",
    groups: [
      {
        heading: "Conservation",
        links: [
          {
            label: "Plant conservation",
            href: "/our-work/plant-conservation",
            description: "Protecting native plants and the places they grow.",
          },
          {
            label: "Environmental conservation",
            href: "/our-work/environmental-conservation",
            description: "Caring for the forests, wetlands and grasslands plants depend on.",
          },
        ],
      },
      {
        heading: "Knowledge",
        links: [
          {
            label: "Medicinal plants",
            href: "/our-work/medicinal-plants",
            description: "Plant knowledge in its scientific and cultural context.",
          },
          {
            label: "Indigenous knowledge",
            href: "/our-work/indigenous-knowledge",
            description: "Recording plant knowledge with respect for its custodians.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Afromontane flora",
      title: "Conserving the plants of East Africa's mountains and forests",
      href: "/our-work/plant-conservation",
      image: media.rwenzoriVegetation,
    },
  },
  {
    id: "herbarium",
    label: "Herbarium & Research",
    href: "/herbarium",
    summary:
      "Building herbarium collections and botanical knowledge that document East African plants for science, education and conservation.",
    groups: [
      {
        heading: "Herbarium",
        links: [
          {
            label: "The herbarium",
            href: "/herbarium",
            description: "What a herbarium is and how EACH is building one.",
          },
        ],
      },
      {
        heading: "Knowledge",
        links: [
          {
            label: "Research",
            href: "/research",
            description: "Botanical study across East African ecosystems.",
          },
          {
            label: "Resources",
            href: "/resources",
            description: "Publications, guides and stories.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Specimens",
      title: "Every pressed plant is a lasting scientific record",
      href: "/herbarium",
      image: media.herbariumSheet,
    },
  },
  {
    id: "projects-impact",
    label: "Projects & Impact",
    href: "/projects",
    summary: "Follow EACH's projects and the difference they make for plants and people.",
    groups: [
      {
        heading: "Projects",
        links: [
          {
            label: "Conservation projects",
            href: "/projects",
            description: "Case studies from the field.",
          },
        ],
      },
      {
        heading: "Impact",
        links: [
          {
            label: "Our impact",
            href: "/impact",
            description: "How we will measure and report what our work achieves.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Case studies",
      title: "Project stories, told through the landscapes they protect",
      href: "/projects",
      image: media.kidepoEuphorbia,
    },
  },
  {
    id: "get-involved",
    label: "Get Involved",
    href: "/get-involved",
    summary: "Volunteer, partner or get in touch to help protect East Africa's plant heritage.",
    groups: [
      {
        heading: "Take part",
        links: [
          {
            label: "Volunteer",
            href: "/volunteer",
            description: "Give your time and skills.",
          },
          {
            label: "Partnerships",
            href: "/partnerships",
            description: "Collaborate as an institution or organisation.",
          },
        ],
      },
      {
        heading: "Talk to us",
        links: [
          { label: "Contact", href: "/contact", description: "Start a conversation with us." },
        ],
      },
    ],
    feature: {
      eyebrow: "Join us",
      title: "Help protect East Africa's plant heritage",
      href: "/get-involved",
      image: media.semulikiVegetation,
    },
  },
] as const satisfies readonly NavItem[];

/** Policy pages, linked from the footer. */
export const legalNavigation = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
] as const satisfies readonly NavLink[];

export function hasMenu(item: NavItem): item is NavItemWithMenu {
  return Boolean(item.groups?.length && item.summary);
}

/** Whether `pathname` is the item's landing page or one of its sub-pages. */
export function isActivePath(item: Pick<NavItem, "href">, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Whether `pathname` belongs to a top-level section: its landing page, or any
 * page its menu links to (sections group routes that do not share a prefix,
 * such as `/herbarium` and `/research`).
 */
export function isActiveSection(item: NavItem, pathname: string): boolean {
  return (
    isActivePath(item, pathname) ||
    (item.groups ?? []).some((group) => group.links.some((link) => isActivePath(link, pathname)))
  );
}

/** Element id of the mega menu panel controlled by an item's trigger. */
export function megaMenuPanelId(item: Pick<NavItem, "id">): string {
  return `mega-menu-${item.id}`;
}

// ---------------------------------------------------------------------------
// CMS overrides (Settings → Navigation)
// ---------------------------------------------------------------------------

const label = z.string().trim().min(1).max(40);
const order = z.number().int().min(1).max(50);

/**
 * Wording, order and visibility changes made in the CMS. Destinations are
 * never stored: overrides are keyed by an item's `id` or a link's `href` in
 * the approved navigation above, so a menu can only point at real routes.
 */
export const navigationOverridesSchema = z.object({
  items: z
    .record(
      z.string(),
      z.object({
        label: label.optional(),
        summary: z.string().trim().min(1).max(300).optional(),
        order: order.optional(),
      }),
    )
    .default({}),
  links: z
    .record(
      z.string(),
      z.object({
        label: label.optional(),
        description: z.string().trim().min(1).max(160).optional(),
        order: order.optional(),
        hidden: z.boolean().optional(),
      }),
    )
    .default({}),
});

export type NavigationOverrides = z.infer<typeof navigationOverridesSchema>;

export const noNavigationOverrides: NavigationOverrides = { items: {}, links: {} };

/** Every link that appears in a menu group, with the item it belongs to. */
export function navigationLinks(
  items: readonly NavItem[] = primaryNavigation,
): { item: NavItem; group: NavGroup; link: NavLink }[] {
  return items.flatMap((item) =>
    (item.groups ?? []).flatMap((group) => group.links.map((link) => ({ item, group, link }))),
  );
}

/**
 * The navigation with CMS overrides applied: labels, summaries and
 * descriptions replaced, items and links reordered, hidden links removed.
 * Groups left without links are dropped; an item left without groups becomes
 * a plain link. Overrides for unknown ids or links are ignored.
 */
export function applyNavigation(
  base: readonly NavItem[],
  overrides: NavigationOverrides,
): NavItem[] {
  const byOrder = <T>(entries: { value: T; order: number; index: number }[]) =>
    entries.sort((a, b) => a.order - b.order || a.index - b.index).map((entry) => entry.value);

  const items = base.map((item, index) => {
    const override = overrides.items[item.id] ?? {};
    const groups = (item.groups ?? [])
      .map((group) => ({
        ...group,
        links: byOrder(
          group.links
            .map((link, linkIndex) => ({
              link,
              override: overrides.links[link.href] ?? {},
              linkIndex,
            }))
            .filter(({ override: linkOverride }) => !linkOverride.hidden)
            .map(({ link, override: linkOverride, linkIndex }) => ({
              value: {
                ...link,
                label: linkOverride.label ?? link.label,
                description: linkOverride.description ?? link.description,
              },
              order: linkOverride.order ?? linkIndex + 1,
              index: linkIndex,
            })),
        ),
      }))
      .filter((group) => group.links.length);
    const next: NavItem = {
      ...item,
      label: override.label ?? item.label,
      summary: override.summary ?? item.summary,
    };
    if (item.groups) {
      if (groups.length) next.groups = groups;
      else delete next.groups;
    }
    return { value: next, order: override.order ?? index + 1, index };
  });
  return byOrder(items);
}
