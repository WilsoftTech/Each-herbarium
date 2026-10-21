import { ActionForm } from "@/components/admin/action-form";
import { SelectField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import type { DeliveryStatus, InquiryStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { retryEnquiryDelivery, updateEnquiryStatus } from "./actions";

export const enquiryStatusLabel: Record<InquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CLOSED: "Closed",
};

const deliveryLabel: Record<DeliveryStatus, string> = {
  PENDING: "Not sent yet",
  SENT: "Sent",
  FAILED: "Failed",
  NOT_CONFIGURED: "Email not configured",
};

export function DeliveryBadge({ status }: { status: DeliveryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        status === "SENT"
          ? "border-primary/50 bg-primary/10 text-foreground"
          : status === "FAILED"
            ? "border-destructive/50 bg-destructive/5 text-destructive"
            : "border-border bg-muted text-foreground",
      )}
    >
      {deliveryLabel[status]}
    </span>
  );
}

export function EnquiryStatusForm({ id, status }: { id: string; status: InquiryStatus }) {
  return (
    <ActionForm action={updateEnquiryStatus} label="Enquiry status" className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <SelectField
        name="status"
        label="Status"
        defaultValue={status}
        options={Object.entries(enquiryStatusLabel).map(([value, label]) => ({ value, label }))}
      />
      <SubmitButton size="sm" pendingLabel="Saving…">
        Save status
      </SubmitButton>
    </ActionForm>
  );
}

export function RetryDeliveryForm({ id }: { id: string }) {
  return (
    <ActionForm action={retryEnquiryDelivery} label="Retry email">
      <input type="hidden" name="id" value={id} />
      <SubmitButton size="sm" variant="outline" pendingLabel="Sending…">
        Retry email
      </SubmitButton>
    </ActionForm>
  );
}
