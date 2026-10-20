import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, AdminPanel, formatAdminDate, Tag } from "@/components/admin/admin-ui";
import { CreateUserForm, listUsers } from "@/features/users";
import { requireAdmin } from "@/services/admin-auth";
import { roleLabel, roleSchema } from "@/services/permissions";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  await requireAdmin("users:manage");
  const users = await listUsers();

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Staff accounts and their roles. There is no public sign-up."
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="overflow-x-auto rounded-sm border border-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Staff accounts</caption>
            <thead className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Role
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const role = roleSchema.safeParse(user.role);
                return (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="rounded-sm font-medium underline-offset-4 hover:underline"
                      >
                        {user.name}
                      </Link>
                      <span className="block text-xs text-muted-foreground">{user.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap gap-2">
                        {role.success ? roleLabel[role.data] : user.role}
                        {user.active ? null : <Tag>Deactivated</Tag>}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatAdminDate(user.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AdminPanel
          title="New account"
          description="A temporary password is shown once after the account is created."
          className="xl:self-start"
        >
          <CreateUserForm />
        </AdminPanel>
      </div>
    </>
  );
}
