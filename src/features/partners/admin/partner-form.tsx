import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { savePartner } from "./actions";
import type { PartnerForAdmin } from "./admin";

export function PartnerForm({
  partner,
  editable,
}: {
  partner?: PartnerForAdmin;
  editable: boolean;
}) {
  return (
    <ActionForm action={savePartner} label="Partner details" className="space-y-6">
      {partner ? (
        <>
          <input type="hidden" name="id" value={partner.id} />
          <input type="hidden" name="version" value={partner.version} />
        </>
      ) : null}
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel
          title="Partner"
          description="Every partner is listed as an independent partner: partnership never means that one organisation owns or runs another."
        >
          <TextField
            name="name"
            label="Name"
            required
            maxLength={200}
            defaultValue={partner?.name}
          />
          <TextField
            name="slug"
            label="Slug"
            required
            maxLength={120}
            defaultValue={partner?.slug}
          />
          <TextField
            name="description"
            label="Description"
            required
            rows={4}
            maxLength={1000}
            defaultValue={partner?.description}
            hint="Verified information only, approved by the partner."
          />
          <TextField
            name="href"
            label="Page on this site"
            defaultValue={partner?.href}
            hint="Optional, for example /bitwiire-herbarium-cafe."
          />
          <TextField
            name="websiteUrl"
            label="Partner website"
            type="url"
            defaultValue={partner?.websiteUrl}
            hint="Optional. A full https:// address."
          />
          <TextField
            name="sortOrder"
            label="Display order"
            type="number"
            required
            defaultValue={partner?.sortOrder ?? 0}
          />
          <CheckboxField
            name="placeholder"
            label="Placeholder"
            defaultChecked={partner?.placeholder ?? false}
            hint="Shows the layout only; never presented as fact."
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {partner ? "Save changes" : "Create draft"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
