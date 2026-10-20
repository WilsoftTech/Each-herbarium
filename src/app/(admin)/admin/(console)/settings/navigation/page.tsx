import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { getSettingsForAdmin, NavigationSettingsForm } from "@/features/settings";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Navigation" };

export default async function NavigationSettingsPage() {
  await requireAdmin("settings:edit");
  const settings = await getSettingsForAdmin();

  return (
    <>
      <AdminPageHeader
        title="Navigation"
        description="Labels, descriptions, order and visibility of the menus. Destinations are the approved pages and cannot be changed here, so a menu can never point at a missing page."
        back={{ label: "Site settings", href: "/admin/settings" }}
      />
      <NavigationSettingsForm settings={settings} />
    </>
  );
}
