import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { EditorTarget } from "@/features/cms";
import { savePage } from "./actions";
import type { PageForAdmin } from "./admin";

const formatHint = (
  <>
    Start a heading with <code>## </code>, a list item with <code>- </code>, and separate paragraphs
    with a blank line. Links: <code>[contact page](/contact)</code> or a full https:// address.
  </>
);

export function PageForm({
  page,
  revisionId,
  editable,
}: {
  page: PageForAdmin;
  /** Set when the form edits the pending changes of a published page. */
  revisionId?: string | null;
  editable: boolean;
}) {
  return (
    <ActionForm action={savePage} label="Page text" className="space-y-6">
      <EditorTarget item={page} revisionId={revisionId} />
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel title="Header">
          <TextField
            name="title"
            label="Title"
            required
            maxLength={120}
            defaultValue={page.title}
          />
          <TextField
            name="eyebrow"
            label="Label above the title"
            required
            maxLength={60}
            defaultValue={page.eyebrow}
          />
          <TextField
            name="lead"
            label="Introduction"
            rows={3}
            maxLength={600}
            defaultValue={page.lead}
          />
          <TextField
            name="description"
            label="Search description"
            required
            rows={2}
            maxLength={300}
            defaultValue={page.description}
            hint="Shown by search engines and when the page is shared."
          />
        </AdminPanel>
        <AdminPanel title="Text">
          <TextField
            name="body"
            label="Page text"
            required
            rows={24}
            defaultValue={page.body}
            hint={formatHint}
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {page.status === "PUBLISHED" ? "Save pending changes" : "Save changes"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
