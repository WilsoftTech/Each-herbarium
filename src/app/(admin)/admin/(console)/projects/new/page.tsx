import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { listMediaOptions } from "@/features/media";
import { getProjectFormOptions, ProjectForm } from "@/features/projects";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin("content:edit-draft");
  const [images, options] = await Promise.all([listMediaOptions("IMAGE"), getProjectFormOptions()]);

  return (
    <>
      <AdminPageHeader
        title="New project"
        description="New projects start as drafts and are not visible on the site."
        back={{ label: "Projects", href: "/admin/projects" }}
      />
      <div className="max-w-4xl">
        <ProjectForm images={images} {...options} editable />
      </div>
    </>
  );
}
