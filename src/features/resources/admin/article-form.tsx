import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { EditorTarget, formData, SeoFields } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import { saveArticle } from "./actions";
import { dateInputValue, type ArticleForAdmin } from "./admin";

type ArticleFormProps = {
  /** Set when the form edits the pending changes of a published item. */
  revisionId?: string | null;
  article?: ArticleForAdmin;
  images: readonly MediaOption[];
  documents: readonly MediaOption[];
  editable: boolean;
};

export function ArticleForm({
  article,
  revisionId,
  images,
  documents,
  editable,
}: ArticleFormProps) {
  return (
    <ActionForm action={saveArticle} label="Article details" className="space-y-6">
      <EditorTarget item={article} revisionId={revisionId} />
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
            hint='Separate paragraphs with a blank line. "## " starts a heading, "- " a list item; links: [text](https://example.org).'
          />
          <TextField
            name="references"
            label="References"
            rows={4}
            hint="One source per line. Links: [title](https://example.org/paper)."
            defaultValue={formData.joinLines(article?.references ?? [])}
          />
          <CheckboxField
            name="featured"
            label="Featured on the homepage"
            defaultChecked={article?.featured ?? false}
            hint="Featured published articles appear under the homepage's latest stories; without any, the three newest are shown."
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
        <SeoFields value={article} />
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {!article
            ? "Create draft"
            : article.status === "PUBLISHED"
              ? "Save pending changes"
              : "Save changes"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
