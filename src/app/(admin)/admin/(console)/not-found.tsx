import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-ui";

/**
 * Shown for unknown admin addresses and for pages the signed-in role may not
 * use (requireAdmin responds 404, so a page's existence is not confirmed to a
 * role that cannot use it). Rendered inside the admin shell.
 */
export default function AdminNotFound() {
  return (
    <>
      <AdminPageHeader
        title="Page not found"
        description="This page does not exist, or your role does not give access to it."
      />
      <p className="text-sm">
        If you need access, ask an administrator to review your role.{" "}
        <Link href="/admin" className="rounded-sm text-primary underline-offset-4 hover:underline">
          Back to the dashboard
        </Link>
      </p>
    </>
  );
}
