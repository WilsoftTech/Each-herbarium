import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PartnerForm } from "@/features/partners";
import { listMediaOptions } from "@/features/media";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "New partner" };

export default async function NewPartnersPage() {
  await requireAdmin("content:edit-draft");
  const images = await listMediaOptions("IMAGE");

  return (
    <>
      <AdminPageHeader
        title="New partner"
        description="New items start as drafts and are not visible on the site."
        back={{ label: "Partners", href: "/admin/partners" }}
      />
      <div className="max-w-4xl">
        <PartnerForm images={images} editable />
      </div>
    </>
  );
}
