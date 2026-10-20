import type { Metadata } from "next";
import { CollectionList } from "@/components/admin/collection-list";
import { listHref, parseListParams, StatusFilter } from "@/features/cms";
import { listProgrammesForAdmin } from "@/features/programmes";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Programmes" };

const basePath = "/admin/programmes";

export default async function AdminProgrammesPage({
  searchParams,
}: PageProps<"/admin/programmes">) {
  const session = await requireAdmin();
  const params = parseListParams(await searchParams);
  const { rows, pageCount, counts } = await listProgrammesForAdmin(params);

  return (
    <CollectionList
      title="Programmes"
      description="Programmes shown in Our work and the homepage explorer."
      basePath={basePath}
      newHref={can(session.role, "content:edit-draft") ? `${basePath}/new` : undefined}
      newLabel="New programme"
      rows={rows.map((row) => ({ ...row, detail: row.sortOrder }))}
      detailLabel="Order"
      filter={<StatusFilter basePath={basePath} params={params} counts={counts} />}
      query={params.q}
      status={params.status}
      page={params.page}
      pageCount={pageCount}
      pageHref={(page) => listHref(basePath, params, page)}
    />
  );
}
