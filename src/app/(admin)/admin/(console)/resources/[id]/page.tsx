import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { savedMessage } from "@/components/admin/saved-message";
import { canEditItem, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  DownloadForm,
  getDownloadEditor,
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
  const [editor, documents] = await Promise.all([
    getDownloadEditor(id),
    listMediaOptions("DOCUMENT"),
  ]);
  if (!editor) notFound();
  const { live: item, draft, revision, revisionError } = editor;

  return (
    <>
      <AdminPageHeader
        title={item.title}
        description={savedMessage(query) ?? `/${item.slug}`}
        back={{ label: "Resources", href: "/admin/resources" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <DownloadForm
          download={draft}
          revisionId={revision?.id}
          documents={documents}
          editable={canEditItem(session.role, item.status, revision?.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            revision={revision}
            revisionError={revisionError}
            transition={transitionDownload}
            remove={deleteDownload}
            publicHref={"/resources"}
          />
        </div>
      </div>
    </>
  );
}
