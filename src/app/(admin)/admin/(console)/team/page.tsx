import type { Metadata } from "next";
import { CollectionList } from "@/components/admin/collection-list";
import { listHref, parseListParams, StatusFilter } from "@/features/cms";
import { listTeamForAdmin } from "@/features/team";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Team" };

const basePath = "/admin/team";

export default async function AdminTeamPage({ searchParams }: PageProps<"/admin/team">) {
  const session = await requireAdmin();
  const params = parseListParams(await searchParams);
  const { rows, pageCount, counts } = await listTeamForAdmin(params);

  return (
    <CollectionList
      title="Team"
      description="Leadership, board and advisers shown at /about/leadership, with their consent."
      basePath={basePath}
      newHref={can(session.role, "content:edit-draft") ? `${basePath}/new` : undefined}
      newLabel="New team member"
      rows={rows.map((row) => ({ ...row, detail: row.roleTitle }))}
      detailLabel="Role"
      filter={<StatusFilter basePath={basePath} params={params} counts={counts} />}
      query={params.q}
      status={params.status}
      page={params.page}
      pageCount={pageCount}
      pageHref={(page) => listHref(basePath, params, page)}
    />
  );
}
