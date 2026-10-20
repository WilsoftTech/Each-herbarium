import type { Metadata } from "next";
import { CollectionList } from "@/components/admin/collection-list";
import { listHref, parseListParams, StatusFilter } from "@/features/cms";
import { listPartnersForAdmin } from "@/features/partners";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Partners" };

const basePath = "/admin/partners";

export default async function AdminPartnersPage({ searchParams }: PageProps<"/admin/partners">) {
  const session = await requireAdmin();
  const params = parseListParams(await searchParams);
  const { rows, pageCount, counts } = await listPartnersForAdmin(params);

  return (
    <CollectionList
      title="Partners"
      description="Independent partner organisations shown at /about/partners."
      basePath={basePath}
      newHref={can(session.role, "content:edit-draft") ? `${basePath}/new` : undefined}
      newLabel="New partner"
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
