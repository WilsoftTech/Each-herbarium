import type { Metadata } from "next";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { ChangePasswordForm } from "@/features/auth";
import { requireAdmin } from "@/services/admin-auth";
import { roleLabel } from "@/services/permissions";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const session = await requireAdmin();

  return (
    <>
      <AdminPageHeader
        title="Your account"
        description={`${session.name} · ${roleLabel[session.role]}`}
      />
      <AdminPanel
        title="Change password"
        description="Changing your password signs you out everywhere else."
        className="max-w-2xl"
      >
        <ChangePasswordForm />
      </AdminPanel>
    </>
  );
}
