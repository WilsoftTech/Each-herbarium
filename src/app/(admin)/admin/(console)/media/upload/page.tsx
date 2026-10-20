import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { UploadForm } from "@/features/media";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Upload" };

export default async function UploadMediaPage() {
  await requireAdmin("media:upload");

  return (
    <>
      <AdminPageHeader
        title="Upload a file"
        description="Upload only files EACH has permission to publish, and record who made them and under what licence."
        back={{ label: "Media library", href: "/admin/media" }}
      />
      <div className="max-w-3xl">
        <UploadForm />
      </div>
    </>
  );
}
