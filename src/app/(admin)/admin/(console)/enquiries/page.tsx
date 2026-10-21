import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import {
  AdminPageHeader,
  EmptyState,
  formatAdminDate,
  Pagination,
} from "@/components/admin/admin-ui";
import { pageCount } from "@/features/cms";
import {
  DeliveryBadge,
  enquiryKindLabel,
  enquiryKindSchema,
  enquiryStatusLabel,
  listEnquiries,
  type EnquiryFilter,
} from "@/features/enquiries";
import { cn } from "@/lib/utils";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Enquiries" };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function href(filter: EnquiryFilter, page = 1) {
  const params = new URLSearchParams();
  if (filter.kind) params.set("kind", filter.kind);
  if (filter.attention) params.set("attention", "1");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/admin/enquiries${query ? `?${query}` : ""}`;
}

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  await requireAdmin("enquiries:manage");
  const raw = await searchParams;
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(10_000)
    .catch(1)
    .parse(first(raw.page) ?? 1);
  const filter: EnquiryFilter = {
    kind: enquiryKindSchema.optional().catch(undefined).parse(first(raw.kind)),
    attention: first(raw.attention) === "1",
  };
  const { items, total, attention } = await listEnquiries(page, filter);

  const filters: { label: string; filter: EnquiryFilter }[] = [
    { label: "All", filter: {} },
    ...enquiryKindSchema.options.map((kind) => ({
      label: enquiryKindLabel[kind],
      filter: { kind },
    })),
    { label: `Staff email not sent (${attention})`, filter: { attention: true } },
  ];
  const current = href(filter);

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="Messages from the public contact, volunteer and partnership forms. They contain personal data: use them only to reply, and close them when done."
      />
      <nav aria-label="Filter enquiries" className="mb-6 flex flex-wrap gap-2 text-sm">
        {filters.map((item) => {
          const target = href(item.filter);
          return (
            <Link
              key={target}
              href={target}
              aria-current={target === current ? "page" : undefined}
              className={cn(
                "rounded-sm border px-3 py-1.5",
                target === current
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {items.length ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Enquiries, newest first</caption>
            <thead className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Received
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  From
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Form
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Staff email
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border align-top last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatAdminDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/enquiries/${item.id}`}
                      className="rounded-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{enquiryKindLabel[item.kind]}</td>
                  <td className="px-4 py-3">{enquiryStatusLabel[item.status]}</td>
                  <td className="px-4 py-3">
                    <DeliveryBadge status={item.notificationStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState>No enquiries here.</EmptyState>
      )}
      <Pagination page={page} pageCount={pageCount(total)} href={(next) => href(filter, next)} />
    </>
  );
}
