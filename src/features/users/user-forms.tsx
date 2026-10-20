import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { roleLabel, roleSchema } from "@/services/permissions";
import { createUser, resetUserPassword, updateUser } from "./actions";
import type { StaffUser } from "./admin";

const roleOptions = roleSchema.options.map((role) => ({ value: role, label: roleLabel[role] }));

const roleHint =
  "Editors write drafts and upload files. Reviewers also approve, publish and archive. Administrators also manage users, settings and the audit log.";

export function CreateUserForm() {
  return (
    <ActionForm action={createUser} label="Create account" className="space-y-5">
      <TextField name="name" label="Name" required maxLength={200} autoComplete="off" />
      <TextField name="email" label="Email address" type="email" required autoComplete="off" />
      <SelectField
        name="role"
        label="Role"
        required
        defaultValue="editor"
        options={roleOptions}
        hint={roleHint}
      />
      <SubmitButton pendingLabel="Creating…">Create account</SubmitButton>
    </ActionForm>
  );
}

export function EditUserForm({ user, isSelf }: { user: StaffUser; isSelf: boolean }) {
  return (
    <div className="space-y-6">
      <AdminPanel title="Access">
        <ActionForm action={updateUser} label="Access" className="space-y-5">
          <input type="hidden" name="id" value={user.id} />
          <fieldset disabled={isSelf} className="space-y-5">
            <SelectField
              name="role"
              label="Role"
              required
              defaultValue={user.role}
              options={roleOptions}
              hint={roleHint}
            />
            <CheckboxField
              name="active"
              label="Account active"
              defaultChecked={user.active}
              hint="Deactivated accounts cannot sign in. Their history is kept."
            />
          </fieldset>
          {isSelf ? (
            <p className="text-sm text-muted-foreground">You cannot change your own access.</p>
          ) : (
            <SubmitButton pendingLabel="Saving…">Save access</SubmitButton>
          )}
        </ActionForm>
      </AdminPanel>
      {isSelf ? null : (
        <AdminPanel
          title="Password"
          description="Issues a new temporary password and signs the user out everywhere."
        >
          <ActionForm action={resetUserPassword} label="Reset password">
            <input type="hidden" name="id" value={user.id} />
            <SubmitButton variant="outline" size="sm" pendingLabel="Resetting…">
              Reset password
            </SubmitButton>
          </ActionForm>
        </AdminPanel>
      )}
    </div>
  );
}
