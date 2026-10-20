import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/services/admin-auth";
import { backendIsAlive } from "@/services/backend-health";

export const metadata: Metadata = { title: "Site settings" };

const sections = [
  {
    href: "/admin/settings/contact",
    title: "Contact details",
    description: "Email, telephone, address, location, office hours and social accounts.",
  },
  {
    href: "/admin/settings/branding",
    title: "Branding",
    description:
      "The tagline. The organisation's name and logo are protected and shown for reference.",
  },
  {
    href: "/admin/settings/navigation",
    title: "Navigation",
    description: "Menu labels, descriptions, order and visibility of the approved pages.",
  },
  {
    href: "/admin/settings/footer",
    title: "Footer",
    description: "Closing statement, small print and copyright line.",
  },
  {
    href: "/admin/settings/seo",
    title: "Search defaults",
    description: "The default sharing image. Each page's own search settings are on the page.",
  },
] as const;

export default async function SettingsPage() {
  await requireAdmin("settings:edit");
  const backendHealthy = await backendIsAlive().catch(() => false);

  return (
    <>
      <AdminPageHeader
        title="Site settings"
        description="Organisation-wide details. Administrators only; changes appear on the website as soon as they are saved, and every change is recorded in the audit log."
      />
      <ul className="grid max-w-4xl gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <li key={section.href}>
            <AdminPanel className="h-full">
              <Link
                href={section.href}
                className="rounded-sm text-base font-semibold text-primary underline-offset-4 hover:underline"
              >
                {section.title}
              </Link>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </AdminPanel>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground">
        Background service: {backendHealthy ? "available" : "unavailable"}
      </p>
    </>
  );
}
