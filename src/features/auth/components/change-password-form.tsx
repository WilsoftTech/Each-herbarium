import { ActionForm } from "@/components/admin/action-form";
import { TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { changePassword } from "../actions";
import { PASSWORD_MIN } from "../schema";

export function ChangePasswordForm() {
  return (
    <ActionForm action={changePassword} label="Change password" className="max-w-md space-y-5">
      <TextField
        name="currentPassword"
        label="Current password"
        type="password"
        autoComplete="current-password"
        required
      />
      <TextField
        name="newPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        hint={`At least ${PASSWORD_MIN} characters. A passphrase of several words works well.`}
        required
      />
      <TextField
        name="confirmPassword"
        label="Repeat the new password"
        type="password"
        autoComplete="new-password"
        required
      />
      <SubmitButton pendingLabel="Saving…">Change password</SubmitButton>
    </ActionForm>
  );
}
