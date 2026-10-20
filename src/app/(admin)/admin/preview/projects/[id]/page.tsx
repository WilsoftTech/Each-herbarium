import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/admin/admin-ui";
import { PreviewFrame } from "@/components/admin/preview-banner";
import { getProjectPreview, ProjectDetail } from "@/features/projects";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Preview project" };

export default async function ProjectPreviewPage({
  params,
}: PageProps<"/admin/preview/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const preview = await getProjectPreview(id);
  if (!preview) notFound();

  return (
    <PreviewFrame status={preview.status} editHref={`/admin/projects/${id}`}>
      {preview.project ? (
        <ProjectDetail project={preview.project} />
      ) : (
        <div className="p-10">
          <EmptyState>{preview.error}</EmptyState>
        </div>
      )}
    </PreviewFrame>
  );
}
