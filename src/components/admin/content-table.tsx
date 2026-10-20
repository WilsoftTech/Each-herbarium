import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState, formatAdminDate, StatusBadge, Tag } from "./admin-ui";

export type ContentTableRow = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  placeholder: boolean;
  updatedAt: Date;
  /** Optional extra column value (e.g. type or group). */
  detail?: ReactNode;
};

type ContentTableProps = {
  rows: readonly ContentTableRow[];
  /** Edit page base, e.g. "/admin/projects". */
  basePath: string;
  caption: string;
  detailLabel?: string;
  empty?: ReactNode;
};

/** Content list shared by every collection: title (edit link), slug, status, last change. */
export function ContentTable({ rows, basePath, caption, detailLabel, empty }: ContentTableProps) {
  if (!rows.length) return <EmptyState>{empty ?? "Nothing here yet."}</EmptyState>;

  return (
    <div className="overflow-x-auto rounded-sm border border-border bg-card">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Title
            </th>
            {detailLabel ? (
              <th scope="col" className="px-4 py-3 font-medium">
                {detailLabel}
              </th>
            ) : null}
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Last changed
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`${basePath}/${row.id}`}
                  className="rounded-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {row.title}
                </Link>
                <span className="block text-xs text-muted-foreground">/{row.slug}</span>
              </td>
              {detailLabel ? <td className="px-4 py-3">{row.detail}</td> : null}
              <td className="px-4 py-3">
                <span className="flex flex-wrap gap-2">
                  <StatusBadge status={row.status} />
                  {row.placeholder ? <Tag>Placeholder</Tag> : null}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatAdminDate(row.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
