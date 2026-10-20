import type { Metadata } from "next";
import { CollectionList } from "@/components/admin/collection-list";
import { listHref, parseListParams, StatusFilter } from "@/features/cms";
import { listProjectsForAdmin } from "@/features/projects";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Projects" };

const basePath = "/admin/projects";

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const session = await requireAdmin();
  const params = parseListParams(await searchParams);
  const { rows, pageCount, counts } = await listProjectsForAdmin(params);

  return (
    <CollectionList
      title="Projects"
      description="Conservation case studies shown at /projects."
      basePath={basePath}
      newHref={can(session.role, "content:edit-draft") ? `${basePath}/new` : undefined}
      newLabel="New project"
      rows={rows.map((row) => ({ ...row, detail: row.ecosystem }))}
      detailLabel="Landscape"
      filter={<StatusFilter basePath={basePath} params={params} counts={counts} />}
      query={params.q}
      status={params.status}
      page={params.page}
      pageCount={pageCount}
      pageHref={(page) => listHref(basePath, params, page)}
    />
  );
}
