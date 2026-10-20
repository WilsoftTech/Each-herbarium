import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { canEdit, WorkflowPanel } from "@/features/cms";
import {
  PartnerForm,
  getPartnerForAdmin,
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
  const item = await getPartnerForAdmin(id);
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader
        title={item.name}
        description={query.saved ? "Saved." : `/${item.slug}`}
        back={{ label: "Partners", href: "/admin/partners" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <PartnerForm partner={item} editable={canEdit(session.role, item.status)} />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            transition={transitionPartner}
            remove={deletePartner}
            publicHref={"/about/partners"}
          />
        </div>
      </div>
    </>
  );
}
