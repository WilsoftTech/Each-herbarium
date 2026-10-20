import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ContactSettingsForm, getSettingsForAdmin } from "@/features/settings";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Contact details" };

export default async function ContactSettingsPage() {
  await requireAdmin("settings:edit");
  const settings = await getSettingsForAdmin();

  return (
    <>
      <AdminPageHeader
        title="Contact details"
        description="Shown on the contact page. Changes appear on the website as soon as they are saved."
        back={{ label: "Site settings", href: "/admin/settings" }}
      />
      <ContactSettingsForm settings={settings} />
    </>
  );
}
