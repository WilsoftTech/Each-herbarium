import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { listMediaOptions } from "@/features/media";
import { DownloadForm } from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "New resource" };

export default async function NewResourcesPage() {
  await requireAdmin("content:edit-draft");
  const documents = await listMediaOptions("DOCUMENT");

  return (
    <>
      <AdminPageHeader
        title="New resource"
        description="New items start as drafts and are not visible on the site."
        back={{ label: "Resources", href: "/admin/resources" }}
      />
      <div className="max-w-4xl">
        <DownloadForm documents={documents} editable />
      </div>
    </>
  );
}
