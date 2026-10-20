import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { savedMessage } from "@/components/admin/saved-message";
import { canEditItem, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  ProgrammeForm,
  getProgrammeEditor,
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
  const [editor, images] = await Promise.all([getProgrammeEditor(id), listMediaOptions("IMAGE")]);
  if (!editor) notFound();
  const { live: item, draft, revision, revisionError } = editor;

  return (
    <>
      <AdminPageHeader
        title={item.title}
        description={savedMessage(query) ?? `/${item.slug}`}
        back={{ label: "Programmes", href: "/admin/programmes" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ProgrammeForm
          programme={draft}
          revisionId={revision?.id}
          images={images}
          editable={canEditItem(session.role, item.status, revision?.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            revision={revision}
            revisionError={revisionError}
            transition={transitionProgramme}
            remove={deleteProgramme}
            publicHref={`/our-work/${item.slug}`}
          />
        </div>
      </div>
    </>
  );
}
