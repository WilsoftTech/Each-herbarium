import Link from "next/link";
import type { ReactNode } from "react";

type PreviewFrameProps = {
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  editHref: string;
  /** The preview shows a published item's pending changes, not what is live. */
  pendingChanges?: boolean;
  children: ReactNode;
};

const describe = {
  DRAFT: "a draft",
  IN_REVIEW: "in review",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

/**
 * Wraps an admin preview of public content with a banner that cannot be
 * mistaken for the live site. Previews are rendered per request behind
 * requireAdmin() and never cached or indexed.
 */
export function PreviewFrame({ status, editHref, pendingChanges, children }: PreviewFrameProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div
        role="note"
        className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-foreground px-5 py-3 text-sm text-background"
      >
        {pendingChanges ? (
          <p>
            <strong className="font-semibold">Preview of pending changes.</strong> The website still
            shows the published version until a reviewer approves these changes.
          </p>
        ) : (
          <p>
            <strong className="font-semibold">Preview.</strong> This item is {describe[status]}
            {status === "PUBLISHED" ? "." : " and is not visible on the website."}
          </p>
        )}
        <Link href={editHref} className="rounded-sm underline underline-offset-4">
          Back to the editor
        </Link>
      </div>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
    </div>
  );
}
