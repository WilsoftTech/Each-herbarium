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
        description="The homepage and every fixed page of the website. Each belongs to an address and a design in code, so pages are edited here, not created: the homepage sections, page headers, policy text, images and search settings."
      />
      <ContentTable rows={pages} basePath="/admin/pages" caption="Pages" />
    </>
  );
}
