import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { savedMessage } from "@/components/admin/saved-message";
import { canEditItem, WorkflowPanel } from "@/features/cms";
import { getPageEditor, PageForm, transitionPage } from "@/features/pages";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditPagePage({
  params,
  searchParams,
}: PageProps<"/admin/pages/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const editor = await getPageEditor(id);
  if (!editor) notFound();
  const { live: page, draft, revision, revisionError } = editor;

  return (
    <>
      <AdminPageHeader
        title={page.title}
        description={savedMessage(query) ?? `/${page.slug}`}
        back={{ label: "Pages", href: "/admin/pages" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <PageForm
          page={draft}
          revisionId={revision?.id}
          editable={canEditItem(session.role, page.status, revision?.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={page}
            revision={revision}
            revisionError={revisionError}
            transition={transitionPage}
            previewHref={`/admin/preview/pages/${page.id}`}
            publicHref={`/${page.slug}`}
          />
        </div>
      </div>
    </>
  );
}
