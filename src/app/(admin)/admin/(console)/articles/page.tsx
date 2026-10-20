import type { Metadata } from "next";
import { CollectionList } from "@/components/admin/collection-list";
import { listHref, parseListParams, StatusFilter } from "@/features/cms";
import { listArticlesForAdmin } from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Articles & publications" };

const basePath = "/admin/articles";
const typeLabel = { PUBLICATION: "Publication", GUIDE: "Guide", STORY: "Story" } as const;

export default async function AdminArticlesPage({ searchParams }: PageProps<"/admin/articles">) {
  const session = await requireAdmin();
  const params = parseListParams(await searchParams);
  const { rows, pageCount, counts } = await listArticlesForAdmin(params);

  return (
    <CollectionList
      title="Articles & publications"
      description="Publications, guides and stories read at /resources."
      basePath={basePath}
      newHref={can(session.role, "content:edit-draft") ? `${basePath}/new` : undefined}
      newLabel="New article"
      rows={rows.map((row) => ({ ...row, detail: typeLabel[row.type] }))}
      detailLabel="Type"
      filter={<StatusFilter basePath={basePath} params={params} counts={counts} />}
      query={params.q}
      status={params.status}
      page={params.page}
      pageCount={pageCount}
      pageHref={(page) => listHref(basePath, params, page)}
    />
  );
}
