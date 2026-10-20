import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { canEdit, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  ProgrammeForm,
  getProgrammeForAdmin,
  deleteProgramme,
  transitionProgramme,
} from "@/features/programmes";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit programme" };

export default async function EditProgrammesPage({
  params,
  searchParams,
}: PageProps<"/admin/programmes/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [item, images] = await Promise.all([getProgrammeForAdmin(id), listMediaOptions("IMAGE")]);
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader
        title={item.title}
        description={query.saved ? "Saved." : `/${item.slug}`}
        back={{ label: "Programmes", href: "/admin/programmes" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ProgrammeForm
          programme={item}
          images={images}
          editable={canEdit(session.role, item.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            transition={transitionProgramme}
            remove={deleteProgramme}
            publicHref={`/our-work/${item.slug}`}
          />
        </div>
      </div>
    </>
  );
}
