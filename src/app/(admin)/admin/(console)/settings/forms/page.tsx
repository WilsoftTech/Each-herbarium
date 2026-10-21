import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { FormsSettingsForm, getSettingsForAdmin } from "@/features/settings";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Public forms" };

export default async function FormsSettingsPage() {
  await requireAdmin("settings:edit");
  const settings = await getSettingsForAdmin();

  return (
    <>
      <AdminPageHeader
        title="Public forms"
        description="Changes appear on the website as soon as they are saved."
        back={{ label: "Site settings", href: "/admin/settings" }}
      />
      <FormsSettingsForm settings={settings} />
    </>
  );
}
