import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { savedMessage } from "@/components/admin/saved-message";
import { canEditItem, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  ArticleForm,
  getArticleEditor,
  deleteArticle,
  transitionArticle,
} from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditArticlesPage({
  params,
  searchParams,
}: PageProps<"/admin/articles/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [editor, images, documents] = await Promise.all([
    getArticleEditor(id),
    listMediaOptions("IMAGE"),
    listMediaOptions("DOCUMENT"),
  ]);
  if (!editor) notFound();
  const { live: item, draft, revision, revisionError } = editor;

  return (
    <>
      <AdminPageHeader
        title={item.title}
        description={savedMessage(query) ?? `/${item.slug}`}
        back={{ label: "Articles & publications", href: "/admin/articles" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ArticleForm
          article={draft}
          revisionId={revision?.id}
          images={images}
          documents={documents}
          editable={canEditItem(session.role, item.status, revision?.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
            revision={revision}
            revisionError={revisionError}
            transition={transitionArticle}
            remove={deleteArticle}
            previewHref={`/admin/preview/articles/${item.id}`}
            publicHref={`/resources/${item.slug}`}
          />
        </div>
      </div>
    </>
  );
}
