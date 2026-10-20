import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import type { MediaOption } from "@/features/media";
import { saveDownload } from "./actions";
import { dateInputValue, type DownloadForAdmin } from "./admin";

type DownloadFormProps = {
  download?: DownloadForAdmin;
  documents: readonly MediaOption[];
  editable: boolean;
};

export function DownloadForm({ download, documents, editable }: DownloadFormProps) {
  return (
    <ActionForm action={saveDownload} label="Resource details" className="space-y-6">
      {download ? (
        <>
          <input type="hidden" name="id" value={download.id} />
          <input type="hidden" name="version" value={download.version} />
        </>
      ) : null}
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel
          title="Resource"
          description="A downloadable document listed under Downloads on /resources."
        >
          <TextField
            name="title"
            label="Title"
            required
            maxLength={200}
            defaultValue={download?.title}
          />
          <TextField
            name="slug"
            label="Slug"
            required
            maxLength={120}
            defaultValue={download?.slug}
          />
          <TextField
            name="summary"
            label="Summary"
            required
            rows={3}
            maxLength={600}
            defaultValue={download?.summary}
          />
          <TextField
            name="publishedOn"
            label="Publication date"
            type="date"
            defaultValue={dateInputValue(download?.publishedOn)}
          />
          <SelectField
            name="documentId"
            label="PDF"
            required
            defaultValue={download?.documentId ?? ""}
            options={[
              { value: "", label: "Choose a PDF…" },
              ...documents.map((document) => ({ value: document.id, label: document.label })),
            ]}
            hint="Upload the PDF in the media library first."
          />
          <CheckboxField
            name="placeholder"
            label="Placeholder"
            defaultChecked={download?.placeholder ?? false}
            hint="Shows the layout only; never presented as fact."
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {download ? "Save changes" : "Create draft"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
