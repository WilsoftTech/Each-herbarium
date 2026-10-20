import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { savedMessage } from "@/components/admin/saved-message";
import { canEditItem, WorkflowPanel } from "@/features/cms";
import {
  PartnerForm,
  getPartnerEditor,
  deletePartner,
  transitionPartner,
} from "@/features/partners";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit partner" };

export default async function EditPartnersPage({
  params,
  searchParams,
}: PageProps<"/admin/partners/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const editor = await getPartnerEditor(id);
  if (!editor) notFound();
  const { live: item, draft, revision, revisionError } = editor;

  return (
    <>
      <AdminPageHeader
        title={item.name}
        description={savedMessage(query) ?? `/${item.slug}`}
        back={{ label: "Partners", href: "/admin/partners" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <PartnerForm
          partner={draft}
          revisionId={revision?.id}
          editable={canEditItem(session.role, item.status, revision?.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            revision={revision}
            revisionError={revisionError}
            transition={transitionPartner}
            remove={deletePartner}
            publicHref={"/about/partners"}
          />
        </div>
      </div>
    </>
  );
}
