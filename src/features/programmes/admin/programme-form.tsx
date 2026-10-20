import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { EditorTarget } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import { saveProgramme } from "./actions";
import type { ProgrammeForAdmin } from "./admin";

type ProgrammeFormProps = {
  /** Set when the form edits the pending changes of a published item. */
  revisionId?: string | null;
  programme?: ProgrammeForAdmin;
  images: readonly MediaOption[];
  editable: boolean;
};

export function ProgrammeForm({ programme, revisionId, images, editable }: ProgrammeFormProps) {
  return (
    <ActionForm action={saveProgramme} label="Programme details" className="space-y-6">
      <EditorTarget item={programme} revisionId={revisionId} />
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel title="Programme">
          <TextField
            name="title"
            label="Title"
            required
            maxLength={120}
            defaultValue={programme?.title}
          />
          <TextField
            name="slug"
            label="Slug"
            required
            maxLength={120}
            defaultValue={programme?.slug}
            hint="The address: /our-work/your-slug."
          />
          <TextField
            name="summary"
            label="Summary"
            required
            maxLength={300}
            defaultValue={programme?.summary}
            hint="One sentence, used in menus, cards and the homepage explorer."
          />
          <TextField
            name="intro"
            label="Opening paragraph"
            required
            rows={5}
            maxLength={2000}
            defaultValue={programme?.intro}
          />
          <SelectField
            name="imageId"
            label="Image"
            required
            defaultValue={programme?.imageId ?? ""}
            options={[
              { value: "", label: "Choose an image…" },
              ...images.map((image) => ({ value: image.id, label: image.label })),
            ]}
          />
          <TextField
            name="sortOrder"
            label="Display order"
            type="number"
            required
            defaultValue={programme?.sortOrder ?? 0}
            hint="Lower numbers appear first."
          />
          <CheckboxField
            name="placeholder"
            label="Placeholder"
            defaultChecked={programme?.placeholder ?? false}
            hint="Shows the layout only; never presented as fact."
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {!programme
            ? "Create draft"
            : programme.status === "PUBLISHED"
              ? "Save pending changes"
              : "Save changes"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
