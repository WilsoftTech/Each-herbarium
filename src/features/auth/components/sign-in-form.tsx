import { ActionForm } from "@/components/admin/action-form";
import { TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { signIn } from "../actions";

export function SignInForm() {
  return (
    <ActionForm action={signIn} label="Sign in" className="space-y-5">
      <TextField name="email" label="Email address" type="email" autoComplete="username" required />
      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
      />
      <SubmitButton className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </ActionForm>
  );
}
