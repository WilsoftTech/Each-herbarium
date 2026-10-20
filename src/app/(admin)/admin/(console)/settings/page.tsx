import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { emptySiteSettings, SettingsForm, siteSettingsSchema } from "@/features/settings";
import { requireAdmin } from "@/services/admin-auth";
import { getDb } from "@/services/db";
import { backendIsAlive } from "@/services/backend-health";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireAdmin("settings:edit");
  const row = await getDb().siteSettings.findUnique({ where: { id: 1 } });
  const settings = row ? siteSettingsSchema.parse({ ...row }) : emptySiteSettings;
  const backendHealthy = await backendIsAlive().catch(() => false);

  return (
    <>
      <AdminPageHeader
        title="Site settings"
        description="Organisation-wide details. Changes appear on the website as soon as they are saved."
      />
      <SettingsForm settings={settings} />
      <p className="mt-6 text-sm text-muted-foreground">
        Background service: {backendHealthy ? "available" : "unavailable"}
      </p>
    </>
  );
}
