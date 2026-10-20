import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  formatAdminDate,
} from "@/components/admin/admin-ui";
import {
  contentStatuses,
  listAwaitingReview,
  listRecentAudit,
  statusLabel,
  summariseContent,
} from "@/features/cms";
import { requireAdmin } from "@/services/admin-auth";
import { can, roleLabel } from "@/services/permissions";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const showAudit = can(session.role, "audit:view");
  const [summary, awaiting, recent] = await Promise.all([
    summariseContent(),
    listAwaitingReview(),
    showAudit ? listRecentAudit(8) : Promise.resolve([]),
  ]);
  const canReview = can(session.role, "content:publish");

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description={`Signed in as ${session.name} (${roleLabel[session.role]}).`}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminPanel
          title={canReview ? "Waiting for your review" : "Waiting for review"}
          description="Content submitted for review, oldest first."
          className="xl:col-span-2"
        >
          {awaiting.length ? (
            <ul className="divide-y divide-border">
              {awaiting.map((item) => (
                <li
                  key={`${item.collection}-${item.id}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-3"
                >
                  <Link
                    href={item.href}
                    className="rounded-sm font-medium underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {item.collection} · {formatAdminDate(item.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Nothing is waiting for review.</EmptyState>
          )}
        </AdminPanel>

        {showAudit ? (
          <AdminPanel title="Recent activity">
            {recent.length ? (
              <ul className="space-y-3 text-sm">
                {recent.map((event) => (
                  <li key={event.id}>
                    <p>{event.summary}</p>
                    <p className="text-muted-foreground">
                      {event.actorEmail ?? "System"} · {formatAdminDate(event.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>No activity yet.</EmptyState>
            )}
            <Link
              href="/admin/audit"
              className="inline-block rounded-sm text-sm text-primary underline-offset-4 hover:underline"
            >
              Full audit log
            </Link>
          </AdminPanel>
        ) : null}
      </div>

      <AdminPanel title="Content" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Content by status</caption>
            <thead className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Type
                </th>
                {contentStatuses.map((status) => (
                  <th key={status} scope="col" className="px-4 py-2 text-right font-medium">
                    {statusLabel[status]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.href} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-4 font-medium">
                    <Link href={row.href} className="rounded-sm underline-offset-4 hover:underline">
                      {row.label}
                    </Link>
                  </th>
                  {contentStatuses.map((status) => (
                    <td key={status} className="px-4 py-2 text-right tabular-nums">
                      {row.counts[status] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>
    </>
  );
}
