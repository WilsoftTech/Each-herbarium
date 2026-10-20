import { signOut } from "../actions";

/** Plain form so signing out works without JavaScript. */
export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="rounded-sm text-primary underline-offset-4 hover:underline">
        Sign out
      </button>
    </form>
  );
}
