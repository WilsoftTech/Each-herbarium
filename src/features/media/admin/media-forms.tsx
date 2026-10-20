import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import {
  CheckboxField,
  controlClass,
  describedBy,
  Field,
  TextField,
} from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { allowedUploadTypes } from "../upload-rules";
import { deleteMedia, updateMediaMetadata, uploadMedia } from "./actions";
import type { MediaForAdmin } from "./admin";

function MetadataFields({ asset }: { asset?: MediaForAdmin }) {
  return (
    <>
      <TextField
        name="alt"
        label="Alt text"
        rows={2}
        maxLength={500}
        defaultValue={asset?.alt}
        hint="Images: what the image shows, for people who cannot see it (at least 20 characters). Not needed for PDFs."
      />
      <TextField
        name="caption"
        label="Caption"
        maxLength={300}
        defaultValue={asset?.caption}
        hint="Images: what and where, e.g. Montane forest, Mount Elgon."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          name="creditAuthor"
          label="Credit"
          required
          maxLength={200}
          defaultValue={asset?.creditAuthor}
          hint="Who made it, or EACH."
        />
        <TextField
          name="license"
          label="Licence"
          required
          maxLength={100}
          defaultValue={asset?.license}
          hint="For example CC BY 4.0, or All rights reserved."
        />
        <TextField
          name="licenseUrl"
          label="Licence link"
          type="url"
          defaultValue={asset?.licenseUrl}
        />
        <TextField
          name="sourceUrl"
          label="Source link"
          type="url"
          defaultValue={asset?.sourceUrl}
        />
      </div>
    </>
  );
}

/** Upload a new image or PDF with its descriptive and licensing details. */
export function UploadForm() {
  const accept = Object.keys(allowedUploadTypes).join(",");
  return (
    <ActionForm action={uploadMedia} label="Upload a file" className="space-y-6">
      <AdminPanel
        title="File"
        description="JPEG, PNG, WebP or AVIF images, or PDF documents, up to 4 MB. Use only files EACH has permission to publish."
      >
        <Field
          name="file"
          label="File"
          required
          hint="The file is checked on the server before it is stored."
        >
          <input
            id="file"
            name="file"
            type="file"
            required
            accept={accept}
            aria-describedby={describedBy("file", true)}
            className={controlClass}
          />
        </Field>
      </AdminPanel>
      <AdminPanel title="Details and licence">
        <MetadataFields />
      </AdminPanel>
      <SubmitButton pendingLabel="Uploading…">Upload</SubmitButton>
    </ActionForm>
  );
}

export function MetadataForm({ asset, editable }: { asset: MediaForAdmin; editable: boolean }) {
  return (
    <ActionForm action={updateMediaMetadata} label="File details" className="space-y-6">
      <input type="hidden" name="id" value={asset.id} />
      <input type="hidden" name="updatedAt" value={asset.updatedAt.toISOString()} />
      <fieldset disabled={!editable}>
        <AdminPanel
          title="Details and licence"
          description={
            editable
              ? "Changes appear on every page that uses this file."
              : "Only reviewers and administrators can change these details."
          }
        >
          <MetadataFields asset={asset} />
        </AdminPanel>
      </fieldset>
      {editable ? <SubmitButton pendingLabel="Saving…">Save details</SubmitButton> : null}
    </ActionForm>
  );
}

export function DeleteMediaForm({ id }: { id: string }) {
  return (
    <ActionForm action={deleteMedia} label="Delete file" className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <CheckboxField name="confirm" label="I understand this cannot be undone" required />
      <SubmitButton variant="destructive" size="sm" pendingLabel="Deleting…">
        Delete file
      </SubmitButton>
    </ActionForm>
  );
}
