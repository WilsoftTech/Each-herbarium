import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { EditUserForm, getUser } from "@/features/users";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Edit user" };

export default async function EditUserPage({ params }: PageProps<"/admin/users/[id]">) {
  const session = await requireAdmin("users:manage");
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  return (
    <>
      <AdminPageHeader
        title={user.name}
        description={user.email}
        back={{ label: "Users", href: "/admin/users" }}
      />
      <div className="max-w-2xl">
        <EditUserForm user={user} isSelf={user.id === session.userId} />
      </div>
    </>
  );
}
