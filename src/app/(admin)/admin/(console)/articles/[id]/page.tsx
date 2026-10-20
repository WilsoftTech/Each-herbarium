import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { canEdit, WorkflowPanel } from "@/features/cms";
import { listMediaOptions } from "@/features/media";
import {
  ArticleForm,
  getArticleForAdmin,
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
  const [item, images, documents] = await Promise.all([
    getArticleForAdmin(id),
    listMediaOptions("IMAGE"),
    listMediaOptions("DOCUMENT"),
  ]);
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader
        title={item.title}
        description={query.saved ? "Saved." : `/${item.slug}`}
        back={{ label: "Articles & publications", href: "/admin/articles" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ArticleForm
          article={item}
          images={images}
          documents={documents}
          editable={canEdit(session.role, item.status)}
        />
        <div className="xl:sticky xl:top-8 xl:self-start">
          <WorkflowPanel
            role={session.role}
            item={item}
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
