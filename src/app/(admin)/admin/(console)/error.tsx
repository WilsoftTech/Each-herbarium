"use client"; // Error boundaries must be Client Components (Next.js requirement).

import Link from "next/link";
import { useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";

type ErrorProps = { error: unknown; retry: () => void };

/**
 * Shown inside the admin shell when an admin page fails to load (for example
 * the database is unreachable). No details reach the browser; the server log
 * has them. Nothing was changed: saves report their own errors in the form.
 */
export default function AdminError({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <AdminPageHeader
        title="This page could not be loaded"
        description="The content service may be temporarily unavailable. Nothing was changed."
      />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/admin">Back to the dashboard</Link>
        </Button>
      </div>
    </>
  );
}
