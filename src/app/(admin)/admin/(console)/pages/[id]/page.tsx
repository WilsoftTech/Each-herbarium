import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { canEdit, WorkflowPanel } from "@/features/cms";
import { getPageForAdmin, PageForm, transitionPage } from "@/features/pages";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditPagePage({
  params,
  searchParams,
}: PageProps<"/admin/pages/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const page = await getPageForAdmin(id);
  if (!page) notFound();

  return (
    <>
      <AdminPageHeader
        title={page.title}
        description={query.saved ? "Saved." : `/${page.slug}`}
        back={{ label: "Pages", href: "/admin/pages" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <PageForm page={page} editable={canEdit(session.role, page.status)} />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={page}
            transition={transitionPage}
            previewHref={`/admin/preview/pages/${page.id}`}
            publicHref={`/${page.slug}`}
          />
        </div>
      </div>
    </>
  );
}
