import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import Image from "next/image";
import { AdminPanel } from "@/components/admin/admin-ui";
import { siteConfig } from "@/config/site";
import { BrandingSettingsForm, getSettingsForAdmin } from "@/features/settings";
import logo from "../../../../../../../public/brand/each-logo.jpeg";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Branding" };

export default async function BrandingSettingsPage() {
  await requireAdmin("settings:edit");
  const settings = await getSettingsForAdmin();

  return (
    <>
      <AdminPageHeader
        title="Branding"
        description="The organisation's name and logo are protected brand assets. They change only through a reviewed code change, never here."
        back={{ label: "Site settings", href: "/admin/settings" }}
      />
      <AdminPanel title="Protected brand assets" className="mb-6 max-w-3xl">
        <div className="flex items-center gap-5">
          <Image
            src={logo}
            alt="The original EACH logo"
            width={96}
            height={96}
            className="rounded-sm bg-white ring-1 ring-black/5"
          />
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Name</dt>
            <dd>{siteConfig.name}</dd>
            <dt className="text-muted-foreground">Short name</dt>
            <dd>{siteConfig.shortName}</dd>
          </dl>
        </div>
        <p className="text-sm text-muted-foreground">
          The original logo is authoritative: it is never redrawn, recoloured, distorted or replaced
          through the CMS. Request changes from EACH and make them in code.
        </p>
      </AdminPanel>
      <BrandingSettingsForm settings={settings} />
    </>
  );
}
