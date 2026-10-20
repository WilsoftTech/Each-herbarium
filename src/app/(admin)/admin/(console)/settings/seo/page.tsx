import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { listMediaOptions } from "@/features/media";
import { getSettingsForAdmin, SeoSettingsForm } from "@/features/settings";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Search defaults" };

export default async function SeoSettingsPage() {
  await requireAdmin("settings:edit");
  const [settings, images] = await Promise.all([getSettingsForAdmin(), listMediaOptions("IMAGE")]);

  return (
    <>
      <AdminPageHeader
        title="Search defaults"
        description="Defaults for search engines and social sharing. The default description is the tagline (Branding)."
        back={{ label: "Site settings", href: "/admin/settings" }}
      />
      <SeoSettingsForm settings={settings} images={images} />
    </>
  );
}
