import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  formatAdminDate,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { listAwaitingReview, listPendingRevisions, type ReviewItem } from "@/features/cms";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Review queue" };

function ReviewList({
  items,
  empty,
  showStatus,
}: {
  items: readonly (ReviewItem & { status?: "DRAFT" | "IN_REVIEW" })[];
  empty: string;
  showStatus?: boolean;
}) {
  if (!items.length) return <EmptyState>{empty}</EmptyState>;
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li
          key={`${item.collection}-${item.id}`}
          className="flex flex-wrap items-center justify-between gap-3 py-3"
        >
          <span className="flex flex-wrap items-center gap-3">
            <Link
              href={item.href}
              className="rounded-sm font-medium underline-offset-4 hover:underline"
            >
              {item.title}
            </Link>
            {showStatus && item.status ? <StatusBadge status={item.status} /> : null}
          </span>
          <span className="text-sm text-muted-foreground">
            {item.collection} · {formatAdminDate(item.updatedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Everything in the editorial workflow that is not live: new items in
 * review, and pending changes to published items. Every role can see the
 * queue; only reviewers and administrators can approve (checked by the
 * actions on each item's page).
 */
export default async function ReviewQueuePage() {
  const session = await requireAdmin();
  const [awaiting, revisions] = await Promise.all([listAwaitingReview(), listPendingRevisions()]);
  const newItems = awaiting.filter((item) => !item.revision);
  const canReview = can(session.role, "content:publish");

  return (
    <>
      <AdminPageHeader
        title="Review queue"
        description={
          canReview
            ? "Approve, return or discard from each item's page. Oldest first."
            : "Submitted content waits here for a reviewer. Oldest first."
        }
      />
      <div className="grid gap-6">
        <AdminPanel
          title="New content in review"
          description="Not yet on the website. Approval publishes it."
        >
          <ReviewList items={newItems} empty="No new content is waiting for review." />
        </AdminPanel>
        <AdminPanel
          title="Pending changes to published content"
          description="The website shows the published version until these changes are approved."
        >
          <ReviewList items={revisions} empty="No published item has pending changes." showStatus />
        </AdminPanel>
      </div>
    </>
  );
}
