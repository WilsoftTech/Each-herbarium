import type { Metadata } from "next";
import { CollectionList } from "@/components/admin/collection-list";
import { listHref, parseListParams, StatusFilter } from "@/features/cms";
import { listDownloadsForAdmin } from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Resources" };

const basePath = "/admin/resources";

export default async function AdminResourcesPage({ searchParams }: PageProps<"/admin/resources">) {
  const session = await requireAdmin();
  const params = parseListParams(await searchParams);
  const { rows, pageCount, counts } = await listDownloadsForAdmin(params);

  return (
    <CollectionList
      title="Resources"
      description="Downloadable documents listed under Downloads on /resources."
      basePath={basePath}
      newHref={can(session.role, "content:edit-draft") ? `${basePath}/new` : undefined}
      newLabel="New resource"
      rows={rows.map((row) => row)}
      filter={<StatusFilter basePath={basePath} params={params} counts={counts} />}
      query={params.q}
      status={params.status}
      page={params.page}
      pageCount={pageCount}
      pageHref={(page) => listHref(basePath, params, page)}
    />
  );
}
