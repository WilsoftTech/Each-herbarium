import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { savedMessage } from "@/components/admin/saved-message";
import { canEditItem, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  TeamMemberForm,
  getTeamMemberEditor,
  deleteTeamMember,
  transitionTeamMember,
} from "@/features/team";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit team member" };

export default async function EditTeamPage({
  params,
  searchParams,
}: PageProps<"/admin/team/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [editor, images] = await Promise.all([getTeamMemberEditor(id), listMediaOptions("IMAGE")]);
  if (!editor) notFound();
  const { live: item, draft, revision, revisionError } = editor;

  return (
    <>
      <AdminPageHeader
        title={item.name}
        description={savedMessage(query) ?? `/${item.slug}`}
        back={{ label: "Team", href: "/admin/team" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <TeamMemberForm
          member={draft}
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
            transition={transitionTeamMember}
            remove={deleteTeamMember}
            publicHref={"/about/leadership"}
          />
        </div>
      </div>
    </>
  );
}
