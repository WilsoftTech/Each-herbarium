import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { canEdit, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  deleteProject,
  getProjectForAdmin,
  getProjectFormOptions,
  ProjectForm,
  transitionProject,
} from "@/features/projects";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
  searchParams,
}: PageProps<"/admin/projects/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [project, images, options] = await Promise.all([
    getProjectForAdmin(id),
    listMediaOptions("IMAGE"),
    getProjectFormOptions(),
  ]);
  if (!project) notFound();

  return (
    <>
      <AdminPageHeader
        title={project.title}
        description={query.saved ? "Saved." : `/projects/${project.slug}`}
        back={{ label: "Projects", href: "/admin/projects" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ProjectForm
          project={project}
          images={images}
          {...options}
          editable={canEdit(session.role, project.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={project}
            transition={transitionProject}
            remove={deleteProject}
            previewHref={`/admin/preview/projects/${project.id}`}
            publicHref={`/projects/${project.slug}`}
          />
        </div>
      </div>
    </>
  );
}
