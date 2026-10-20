import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { savePage } from "./actions";
import type { PageForAdmin } from "./admin";

const formatHint = (
  <>
    Start a heading with <code>## </code>, a list item with <code>- </code>, and separate paragraphs
    with a blank line. Links: <code>[contact page](/contact)</code> or a full https:// address.
  </>
);

export function PageForm({ page, editable }: { page: PageForAdmin; editable: boolean }) {
  return (
    <ActionForm action={savePage} label="Page text" className="space-y-6">
      <input type="hidden" name="id" value={page.id} />
      <input type="hidden" name="version" value={page.version} />
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
      {editable ? <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton> : null}
    </ActionForm>
  );
}
