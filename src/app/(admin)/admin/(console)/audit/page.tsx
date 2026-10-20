import type { Metadata } from "next";
import { z } from "zod";
import {
  AdminPageHeader,
  EmptyState,
  formatAdminDate,
  Pagination,
} from "@/components/admin/admin-ui";
import { pageCount, pageWindow } from "@/features/cms";
import { requireAdmin } from "@/services/admin-auth";
import { getDb } from "@/services/db";

export const metadata: Metadata = { title: "Audit log" };

export default async function AuditPage({ searchParams }: PageProps<"/admin/audit">) {
  await requireAdmin("audit:view");
  const raw = (await searchParams).page;
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(10_000)
    .catch(1)
    .parse(Array.isArray(raw) ? raw[0] : (raw ?? 1));

  const db = getDb();
  const [events, total] = await Promise.all([
    db.auditEvent.findMany({ orderBy: { createdAt: "desc" }, ...pageWindow(page) }),
    db.auditEvent.count(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Audit log"
        description="Every sign-in, content change, publication, upload and account change. The log cannot be edited or deleted."
      />
      {events.length ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Audit events, newest first</caption>
            <thead className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  When
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Who
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  What
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-border align-top last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatAdminDate(event.createdAt)}
                  </td>
                  <td className="px-4 py-3">{event.actorEmail ?? "System or anonymous"}</td>
                  <td className="px-4 py-3">{event.summary}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {event.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState>No events yet.</EmptyState>
      )}
      <Pagination
        page={page}
        pageCount={pageCount(total)}
        href={(next) => `/admin/audit?page=${next}`}
      />
    </>
  );
}
