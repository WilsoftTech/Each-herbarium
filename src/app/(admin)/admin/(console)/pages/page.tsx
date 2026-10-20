import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ContentTable } from "@/components/admin/content-table";
import { listPagesForAdmin } from "@/features/pages";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Pages" };

export default async function AdminPagesPage() {
  await requireAdmin();
  const pages = await listPagesForAdmin();

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Policy pages whose text is managed here. Each belongs to a fixed address, so pages are edited, not created."
      />
      <ContentTable rows={pages} basePath="/admin/pages" caption="Pages" />
    </>
  );
}
