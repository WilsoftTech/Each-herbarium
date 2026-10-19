import { media, type MediaAsset } from "./media";

/**
 * The single source of truth for site navigation. The desktop mega menus, the
 * mobile menu and the footer all render from this file.
 *
 * Section landing pages and sub-pages are built in M03, where the final route
 * names are agreed. Until then these routes return the 404 page. Link labels
 * and descriptions are provisional information architecture, not statements
 * about EACH's programmes; confirm them with EACH before M03 content work.
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
            label: "Our story",
            href: "/about/story",
            description: "Why EACH was founded and where it is going.",
          },
          {
            label: "Mission and values",
            href: "/about/mission",
            description: "The principles that guide our work.",
          },
        ],
      },
      {
        heading: "Connect",
        links: [
          {
            label: "Partners",
            href: "/partners",
            description: "Organisations we work alongside.",
          },
          { label: "Contact", href: "/contact", description: "How to reach the EACH team." },
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
            href: "/our-work/conservation",
            description: "Protecting native plants and the places they grow.",
          },
          {
            label: "Community engagement",
            href: "/our-work/communities",
            description: "Working with the people who know these landscapes best.",
          },
        ],
      },
      {
        heading: "Knowledge",
        links: [
          {
            label: "Medicinal plants and traditional knowledge",
            href: "/our-work/traditional-knowledge",
            description: "Recording plant knowledge with respect for its custodians.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Afromontane flora",
      title: "Conserving the plants of East Africa's mountains and forests",
      href: "/our-work/conservation",
      image: media.rwenzoriVegetation,
    },
  },
  {
    id: "herbarium",
    label: "Herbarium",
    href: "/herbarium",
    summary:
      "Building herbarium collections that document East African plants for science, education and conservation.",
    groups: [
      {
        heading: "The herbarium",
        links: [
          {
            label: "About the herbarium",
            href: "/herbarium/about",
            description: "What a herbarium is and why it matters.",
          },
          {
            label: "Collections",
            href: "/herbarium/collections",
            description: "Preserved plant specimens and their records.",
          },
        ],
      },
      {
        heading: "Develop",
        links: [
          {
            label: "Herbarium development",
            href: "/herbarium/development",
            description: "Establishing and strengthening community herbariums.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Specimens",
      title: "Every pressed plant is a lasting scientific record",
      href: "/herbarium/collections",
      image: media.herbariumSheet,
    },
  },
  {
    id: "research-learning",
    label: "Research & Learning",
    href: "/research-learning",
    summary: "Sharing botanical knowledge through research, education and open resources.",
    groups: [
      {
        heading: "Research",
        links: [
          {
            label: "Research",
            href: "/research-learning/research",
            description: "Botanical study across East African ecosystems.",
          },
        ],
      },
      {
        heading: "Learning",
        links: [
          {
            label: "Education",
            href: "/research-learning/education",
            description: "Learning opportunities for students and communities.",
          },
          {
            label: "Resources",
            href: "/research-learning/resources",
            description: "Guides and materials to explore and download.",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Field study",
      title: "Learning from East Africa's forests",
      href: "/research-learning/research",
      image: media.budongoTree,
    },
  },
  {
    id: "projects-impact",
    label: "Projects & Impact",
    href: "/projects-impact",
    summary: "Follow EACH's projects and the difference they make for plants and people.",
    groups: [
      {
        heading: "Projects",
        links: [
          {
            label: "Current projects",
            href: "/projects-impact/projects",
            description: "Work under way across the region.",
          },
        ],
      },
      {
        heading: "Impact",
        links: [
          {
            label: "Our impact",
            href: "/projects-impact/impact",
            description: "What our work has achieved so far.",
          },
          {
            label: "News and stories",
            href: "/projects-impact/news",
            description: "Updates from the field and the herbarium.",
          },
        ],
      },
    ],
  },
  {
    id: "get-involved",
    label: "Get Involved",
    href: "/get-involved",
    summary: "Volunteer, partner or support EACH to help protect East Africa's plant heritage.",
    groups: [
      {
        heading: "Take part",
        links: [
          {
            label: "Volunteer",
            href: "/get-involved/volunteer",
            description: "Give your time and skills.",
          },
          {
            label: "Partner with us",
            href: "/get-involved/partner",
            description: "Collaborate as an institution or organisation.",
          },
        ],
      },
      {
        heading: "Support",
        links: [
          {
            label: "Support our work",
            href: "/get-involved/support",
            description: "Ways to help sustain EACH.",
          },
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

export function hasMenu(item: NavItem): item is NavItemWithMenu {
  return Boolean(item.groups?.length && item.summary);
}

/** Whether `pathname` is the item's landing page or one of its sub-pages. */
export function isActivePath(item: Pick<NavItem, "href">, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Element id of the mega menu panel controlled by an item's trigger. */
export function megaMenuPanelId(item: Pick<NavItem, "id">): string {
  return `mega-menu-${item.id}`;
}
