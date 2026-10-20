import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminPanel,
  AdminStat,
  EmptyState,
  formatAdminDate,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  contentStatuses,
  listAwaitingReview,
  listRecentAudit,
  statusLabel,
  summariseContent,
  summariseOperations,
} from "@/features/cms";
import { findPageId } from "@/features/pages";
import { requireAdmin } from "@/services/admin-auth";
import { can, roleLabel } from "@/services/permissions";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const showAudit = can(session.role, "audit:view");
  const [summary, awaiting, recent, operations, homeId] = await Promise.all([
    summariseContent(),
    listAwaitingReview(),
    showAudit ? listRecentAudit(8) : Promise.resolve([]),
    summariseOperations(),
    findPageId("home"),
  ]);
  const canReview = can(session.role, "content:publish");
  const { attention } = operations;
  const attentionItems = [
    {
      count: attention.placeholders,
      text: "published placeholders: labelled on the site and never indexed; replace them with approved content",
    },
    { count: attention.staleDrafts, text: "drafts unchanged for more than 30 days" },
    {
      count: attention.stuckUploads,
      text: "uploads that never finished (run npm run media:cleanup)",
    },
  ].filter((item) => item.count > 0);
  const quickActions = [
    homeId ? { label: "Edit the homepage", href: `/admin/pages/${homeId}` } : null,
    { label: "New project", href: "/admin/projects/new" },
    { label: "New article", href: "/admin/articles/new" },
    { label: "New programme", href: "/admin/programmes/new" },
    { label: "Upload media", href: "/admin/media/upload" },
    { label: "Review queue", href: "/admin/reviews" },
  ].filter((action): action is { label: string; href: string } => Boolean(action));

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description={`Signed in as ${session.name} (${roleLabel[session.role]}).`}
      />

      <section aria-label="Figures" className="mb-6">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <li>
            <AdminStat
              label="Published pages"
              value={operations.published.pages}
              href="/admin/pages"
            />
          </li>
          <li>
            <AdminStat
              label="Published projects"
              value={operations.published.projects}
              href="/admin/projects?status=PUBLISHED"
            />
          </li>
          <li>
            <AdminStat
              label="Published articles"
              value={operations.published.articles}
              href="/admin/articles?status=PUBLISHED"
            />
          </li>
          <li>
            <AdminStat
              label="Published programmes"
              value={operations.published.programmes}
              href="/admin/programmes?status=PUBLISHED"
            />
          </li>
          <li>
            <AdminStat label="Drafts" value={operations.drafts} />
          </li>
          <li>
            <AdminStat
              label="Waiting for review"
              value={operations.awaitingReview}
              href="/admin/reviews"
            />
          </li>
          <li>
            <AdminStat
              label="Published items with pending changes"
              value={operations.pendingChanges}
              href="/admin/reviews"
            />
          </li>
          <li>
            <AdminStat label="Media files" value={operations.media} href="/admin/media" />
          </li>
        </ul>
      </section>

      <AdminPanel title="Quick actions" className="mb-6">
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button key={action.href} asChild variant="outline" size="sm">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </AdminPanel>

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
                    {item.revision ? "Changes to a published " : ""}
                    {item.revision ? item.collection.toLowerCase() : item.collection} ·{" "}
                    {formatAdminDate(item.updatedAt)}
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

      <AdminPanel title="Needs attention" className="mt-6">
        {attentionItems.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {attentionItems.map((item) => (
              <li key={item.text}>
                <strong className="tabular-nums">{item.count}</strong> {item.text}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>Nothing needs attention.</EmptyState>
        )}
      </AdminPanel>

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
