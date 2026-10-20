import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/admin/admin-ui";
import { PreviewFrame } from "@/components/admin/preview-banner";
import { ArticleDetail, getArticlePreview } from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Preview article" };

export default async function ArticlePreviewPage({
  params,
}: PageProps<"/admin/preview/articles/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const preview = await getArticlePreview(id);
  if (!preview) notFound();

  return (
    <PreviewFrame status={preview.status} editHref={`/admin/articles/${id}`}>
      {preview.resource ? (
        <ArticleDetail resource={preview.resource} />
      ) : (
        <div className="p-10">
          <EmptyState>{preview.error}</EmptyState>
        </div>
      )}
    </PreviewFrame>
  );
}
