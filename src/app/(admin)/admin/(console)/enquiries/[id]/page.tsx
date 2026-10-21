import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader, AdminPanel, formatAdminDate } from "@/components/admin/admin-ui";
import { KeyFacts } from "@/components/ui/key-facts";
import {
  contactTopics,
  DeliveryBadge,
  enquiryKindLabel,
  EnquiryStatusForm,
  getEnquiry,
  labelOf,
  partnershipTypes,
  RetryDeliveryForm,
  volunteerAreas,
} from "@/features/enquiries";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Enquiry" };

type Details = { areas?: string[]; availability?: string | null; partnershipType?: string };

export default async function EnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  await requireAdmin("enquiries:manage");
  const enquiry = await getEnquiry((await params).id);
  if (!enquiry) notFound();
  const details = (enquiry.details ?? {}) as Details;

  const facts = [
    { term: "Received", value: formatAdminDate(enquiry.createdAt) },
    {
      term: "Email",
      value: (
        <a href={`mailto:${enquiry.email}`} className="text-primary underline underline-offset-4">
          {enquiry.email}
        </a>
      ),
    },
    ...(enquiry.kind === "CONTACT"
      ? [{ term: "Topic", value: labelOf(contactTopics, enquiry.topic) }]
      : []),
    ...(enquiry.organisation ? [{ term: "Organisation", value: enquiry.organisation }] : []),
    ...(details.partnershipType
      ? [{ term: "Partnership", value: labelOf(partnershipTypes, details.partnershipType) }]
      : []),
    ...(details.areas?.length
      ? [
          {
            term: "Areas",
            value: details.areas.map((area) => labelOf(volunteerAreas, area)).join(", "),
          },
        ]
      : []),
    ...(details.availability ? [{ term: "Availability", value: details.availability }] : []),
  ];
  const unsent = enquiry.notificationStatus !== "SENT" || enquiry.acknowledgementStatus !== "SENT";

  return (
    <>
      <AdminPageHeader
        title={`${enquiryKindLabel[enquiry.kind]} from ${enquiry.name}`}
        description="Reply from your own email using the address below."
        back={{ label: "Enquiries", href: "/admin/enquiries" }}
      />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-3">
        <AdminPanel className="lg:col-span-2">
          <KeyFacts facts={facts} />
          <h2 className="mt-2 text-sm font-semibold">Message</h2>
          <p className="mt-2 text-sm whitespace-pre-line">{enquiry.message}</p>
        </AdminPanel>
        <div className="space-y-6">
          <AdminPanel>
            <EnquiryStatusForm id={enquiry.id} status={enquiry.status} />
          </AdminPanel>
          <AdminPanel title="Email">
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt>Staff notification</dt>
                <dd>
                  <DeliveryBadge status={enquiry.notificationStatus} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>Acknowledgement</dt>
                <dd>
                  <DeliveryBadge status={enquiry.acknowledgementStatus} />
                </dd>
              </div>
            </dl>
            {enquiry.deliveryError ? (
              <p className="mt-3 text-sm text-destructive">{enquiry.deliveryError}</p>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">
              Attempts: {enquiry.deliveryAttempts}
            </p>
            {unsent ? (
              <div className="mt-4">
                <RetryDeliveryForm id={enquiry.id} />
              </div>
            ) : null}
          </AdminPanel>
        </div>
      </div>
    </>
  );
}
