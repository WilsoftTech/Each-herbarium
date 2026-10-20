import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { canEdit, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  DownloadForm,
  getDownloadForAdmin,
  deleteDownload,
  transitionDownload,
} from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit resource" };

export default async function EditResourcesPage({
  params,
  searchParams,
}: PageProps<"/admin/resources/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [item, documents] = await Promise.all([
    getDownloadForAdmin(id),
    listMediaOptions("DOCUMENT"),
  ]);
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader
        title={item.title}
        description={query.saved ? "Saved." : `/${item.slug}`}
        back={{ label: "Resources", href: "/admin/resources" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <DownloadForm
          download={item}
          documents={documents}
          editable={canEdit(session.role, item.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            transition={transitionDownload}
            remove={deleteDownload}
            publicHref={"/resources"}
          />
        </div>
      </div>
    </>
  );
}
