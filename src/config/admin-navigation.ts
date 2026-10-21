import type { Permission } from "@/services/permissions";

export type AdminNavItem = {
  label: string;
  href: `/admin${string}`;
  /** Shown only to roles with this permission. Hiding is cosmetic; pages enforce it. */
  permission: Permission;
};

export type AdminNavGroup = { label: string; items: readonly AdminNavItem[] };

/** The admin area's navigation, in sidebar order. */
export const adminNavigation: readonly AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", permission: "admin:access" },
      { label: "Review queue", href: "/admin/reviews", permission: "admin:access" },
      { label: "Enquiries", href: "/admin/enquiries", permission: "enquiries:manage" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Pages", href: "/admin/pages", permission: "admin:access" },
      { label: "Programmes", href: "/admin/programmes", permission: "admin:access" },
      { label: "Projects", href: "/admin/projects", permission: "admin:access" },
      { label: "Articles & publications", href: "/admin/articles", permission: "admin:access" },
      { label: "Resources", href: "/admin/resources", permission: "admin:access" },
      { label: "Partners", href: "/admin/partners", permission: "admin:access" },
      { label: "Team", href: "/admin/team", permission: "admin:access" },
      { label: "Media library", href: "/admin/media", permission: "admin:access" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Site settings", href: "/admin/settings", permission: "settings:edit" },
      { label: "Users", href: "/admin/users", permission: "users:manage" },
      { label: "Audit log", href: "/admin/audit", permission: "audit:view" },
    ],
  },
];
