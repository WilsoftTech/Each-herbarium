import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { listMediaOptions } from "@/features/media";
import { ArticleForm } from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "New article" };

export default async function NewArticlesPage() {
  await requireAdmin("content:edit-draft");
  const [images, documents] = await Promise.all([
    listMediaOptions("IMAGE"),
    listMediaOptions("DOCUMENT"),
  ]);

  return (
    <>
      <AdminPageHeader
        title="New article"
        description="New items start as drafts and are not visible on the site."
        back={{ label: "Articles & publications", href: "/admin/articles" }}
      />
      <div className="max-w-4xl">
        <ArticleForm images={images} documents={documents} editable />
      </div>
    </>
  );
}
