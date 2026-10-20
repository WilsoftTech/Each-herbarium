import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { FooterSettingsForm, getSettingsForAdmin } from "@/features/settings";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Footer" };

export default async function FooterSettingsPage() {
  await requireAdmin("settings:edit");
  const settings = await getSettingsForAdmin();

  return (
    <>
      <AdminPageHeader
        title="Footer"
        description="Wording of the footer on every public page."
        back={{ label: "Site settings", href: "/admin/settings" }}
      />
      <FooterSettingsForm settings={settings} />
    </>
  );
}
