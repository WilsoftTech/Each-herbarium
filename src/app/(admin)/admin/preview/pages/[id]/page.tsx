import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/admin/admin-ui";
import { PreviewFrame } from "@/components/admin/preview-banner";
import { getPagePreview, PolicyPage } from "@/features/pages";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Preview page" };

export default async function PagePreviewPage({ params }: PageProps<"/admin/preview/pages/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const preview = await getPagePreview(id);
  if (!preview) notFound();

  return (
    <PreviewFrame status={preview.status} editHref={`/admin/pages/${id}`}>
      {preview.page ? (
        <PolicyPage page={preview.page} />
      ) : (
        <div className="p-10">
          <EmptyState>{preview.error}</EmptyState>
        </div>
      )}
    </PreviewFrame>
  );
}
