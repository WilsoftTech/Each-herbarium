import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { formData, EditorTarget } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import { saveTeamMember } from "./actions";
import type { TeamMemberForAdmin } from "./admin";

type TeamMemberFormProps = {
  /** Set when the form edits the pending changes of a published item. */
  revisionId?: string | null;
  member?: TeamMemberForAdmin;
  images: readonly MediaOption[];
  editable: boolean;
};

export function TeamMemberForm({ member, revisionId, images, editable }: TeamMemberFormProps) {
  return (
    <ActionForm action={saveTeamMember} label="Team member details" className="space-y-6">
      <EditorTarget item={member} revisionId={revisionId} />
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel title="Profile">
          <TextField
            name="name"
            label="Name"
            required
            maxLength={200}
            defaultValue={member?.name}
          />
          <TextField
            name="slug"
            label="Slug"
            required
            maxLength={120}
            defaultValue={member?.slug}
          />
          <TextField
            name="roleTitle"
            label="Role"
            required
            maxLength={200}
            defaultValue={member?.roleTitle}
          />
          <SelectField
            name="group"
            label="Group"
            required
            defaultValue={member?.group ?? "LEADERSHIP"}
            options={[
              { value: "LEADERSHIP", label: "Leadership team" },
              { value: "BOARD", label: "Board" },
              { value: "ADVISER", label: "Advisers" },
            ]}
          />
          <TextField
            name="bio"
            label="Short biography"
            rows={6}
            defaultValue={formData.joinParagraphs(member?.bio ?? [])}
            hint="Separate paragraphs with a blank line."
          />
          <SelectField
            name="photoId"
            label="Photograph"
            defaultValue={member?.photoId ?? ""}
            options={[
              { value: "", label: "No photograph" },
              ...images.map((image) => ({ value: image.id, label: image.label })),
            ]}
          />
          <TextField
            name="sortOrder"
            label="Display order"
            type="number"
            required
            defaultValue={member?.sortOrder ?? 0}
          />
        </AdminPanel>
        <AdminPanel title="Consent">
          <CheckboxField
            name="consentConfirmed"
            label="This person has agreed to appear on the website"
            defaultChecked={member?.consentConfirmed ?? false}
            hint="Required before publishing. Record where the consent is kept, outside this system."
          />
          <CheckboxField
            name="placeholder"
            label="Placeholder"
            defaultChecked={member?.placeholder ?? false}
            hint="Shows the layout only; never presented as fact."
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {!member
            ? "Create draft"
            : member.status === "PUBLISHED"
              ? "Save pending changes"
              : "Save changes"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
