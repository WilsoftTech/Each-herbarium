import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { formData } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import { saveArticle } from "./actions";
import { dateInputValue, type ArticleForAdmin } from "./admin";

type ArticleFormProps = {
  article?: ArticleForAdmin;
  images: readonly MediaOption[];
  documents: readonly MediaOption[];
  editable: boolean;
};

export function ArticleForm({ article, images, documents, editable }: ArticleFormProps) {
  return (
    <ActionForm action={saveArticle} label="Article details" className="space-y-6">
      {article ? (
        <>
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="version" value={article.version} />
        </>
      ) : null}
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel title="Article">
          <SelectField
            name="type"
            label="Type"
            required
            defaultValue={article?.type ?? "STORY"}
            options={[
              { value: "PUBLICATION", label: "Publication" },
              { value: "GUIDE", label: "Guide" },
              { value: "STORY", label: "Story" },
            ]}
          />
          <TextField
            name="title"
            label="Title"
            required
            maxLength={200}
            defaultValue={article?.title}
          />
          <TextField
            name="slug"
            label="Slug"
            required
            maxLength={120}
            defaultValue={article?.slug}
            hint="The address: /resources/your-slug."
          />
          <TextField
            name="summary"
            label="Summary"
            required
            rows={3}
            maxLength={600}
            defaultValue={article?.summary}
          />
          <TextField
            name="publishedOn"
            label="Publication date"
            type="date"
            defaultValue={dateInputValue(article?.publishedOn)}
            hint="Shown to readers. Leave empty until confirmed."
          />
          <TextField
            name="authors"
            label="Authors"
            rows={3}
            defaultValue={(article?.authors ?? []).join("\n")}
            hint="One per line."
          />
          <TextField
            name="body"
            label="Text"
            rows={14}
            defaultValue={formData.joinParagraphs(article?.body ?? [])}
            hint="Separate paragraphs with a blank line."
          />
        </AdminPanel>
        <AdminPanel title="Files" description="Upload files in the media library first.">
          <SelectField
            name="imageId"
            label="Image"
            defaultValue={article?.imageId ?? ""}
            options={[
              { value: "", label: "No image" },
              ...images.map((image) => ({ value: image.id, label: image.label })),
            ]}
          />
          <SelectField
            name="documentId"
            label="PDF download"
            defaultValue={article?.documentId ?? ""}
            options={[
              { value: "", label: "No download" },
              ...documents.map((document) => ({ value: document.id, label: document.label })),
            ]}
          />
          <CheckboxField
            name="placeholder"
            label="Placeholder"
            defaultChecked={article?.placeholder ?? false}
            hint="Shows the layout only; never presented as fact."
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {article ? "Save changes" : "Create draft"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
