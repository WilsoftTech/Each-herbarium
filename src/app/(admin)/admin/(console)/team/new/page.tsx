import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { listMediaOptions } from "@/features/media";
import { TeamMemberForm } from "@/features/team";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "New team member" };

export default async function NewTeamPage() {
  await requireAdmin("content:edit-draft");
  const images = await listMediaOptions("IMAGE");

  return (
    <>
      <AdminPageHeader
        title="New team member"
        description="New items start as drafts and are not visible on the site."
        back={{ label: "Team", href: "/admin/team" }}
      />
      <div className="max-w-4xl">
        <TeamMemberForm images={images} editable />
      </div>
    </>
  );
}
