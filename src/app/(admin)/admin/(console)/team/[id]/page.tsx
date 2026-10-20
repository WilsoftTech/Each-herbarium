import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { canEdit, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  TeamMemberForm,
  getTeamMemberForAdmin,
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
  const [item, images] = await Promise.all([getTeamMemberForAdmin(id), listMediaOptions("IMAGE")]);
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader
        title={item.name}
        description={query.saved ? "Saved." : `/${item.slug}`}
        back={{ label: "Team", href: "/admin/team" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <TeamMemberForm
          member={item}
          images={images}
          editable={canEdit(session.role, item.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            transition={transitionTeamMember}
            remove={deleteTeamMember}
            publicHref={"/about/leadership"}
          />
        </div>
      </div>
    </>
  );
}
