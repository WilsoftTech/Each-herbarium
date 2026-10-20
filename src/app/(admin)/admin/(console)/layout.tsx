import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { SignOutButton } from "@/features/auth";
import { getAdminSession, SIGN_IN_PATH } from "@/services/admin-auth";

/**
 * Console chrome. Reading the session here only shapes the navigation; it is
 * not the security control: every page and action calls requireAdmin().
 */
export default async function ConsoleLayout({ children }: LayoutProps<"/admin">) {
  const session = await getAdminSession();
  if (!session) redirect(SIGN_IN_PATH);

  return (
    <AdminShell user={session} signOut={<SignOutButton />}>
      {children}
    </AdminShell>
  );
}
