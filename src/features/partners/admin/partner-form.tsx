import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { EditorTarget } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import { savePartner } from "./actions";
import type { PartnerForAdmin } from "./admin";

export function PartnerForm({
  partner,
  revisionId,
  images,
  editable,
}: {
  partner?: PartnerForAdmin;
  /** Set when the form edits the pending changes of a published partner. */
  revisionId?: string | null;
  images: readonly MediaOption[];
  editable: boolean;
}) {
  return (
    <ActionForm action={savePartner} label="Partner details" className="space-y-6">
      <EditorTarget item={partner} revisionId={revisionId} />
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
            name="category"
            label="Partnership category"
            maxLength={60}
            defaultValue={partner?.category}
            hint="Optional, for example Research, Community or Hospitality."
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
        <AdminPanel
          title="Logo"
          description="Upload the logo exactly as the partner approved it, in the media library. It is shown at its own proportions and never cropped or recoloured."
        >
          <SelectField
            name="logoId"
            label="Logo"
            options={[
              { value: "", label: "No logo" },
              ...images.map((image) => ({ value: image.id, label: image.label })),
            ]}
            defaultValue={partner?.logoId ?? ""}
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {!partner
            ? "Create draft"
            : partner.status === "PUBLISHED"
              ? "Save pending changes"
              : "Save changes"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
