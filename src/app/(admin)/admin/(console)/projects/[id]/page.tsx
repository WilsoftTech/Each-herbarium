import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { savedMessage } from "@/components/admin/saved-message";
import { canEditItem, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  deleteProject,
  getProjectEditor,
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
  const [editor, images, options] = await Promise.all([
    getProjectEditor(id),
    listMediaOptions("IMAGE"),
    getProjectFormOptions(),
  ]);
  if (!editor) notFound();
  const { live, draft, revision, revisionError } = editor;

  return (
    <>
      <AdminPageHeader
        title={live.title}
        description={savedMessage(query) ?? `/projects/${live.slug}`}
        back={{ label: "Projects", href: "/admin/projects" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ProjectForm
          project={draft}
          revisionId={revision?.id}
          images={images}
          {...options}
          editable={canEditItem(session.role, live.status, revision?.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={live}
            revision={revision}
            revisionError={revisionError}
            transition={transitionProject}
            remove={deleteProject}
            previewHref={`/admin/preview/projects/${live.id}`}
            publicHref={`/projects/${live.slug}`}
          />
        </div>
      </div>
    </>
  );
}
