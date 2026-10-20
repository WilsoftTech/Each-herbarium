import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Page title row: the page's single h1, a description and primary actions. */
export function AdminPageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { label: string; href: string };
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {back ? (
          <Link
            href={back.href}
            className="mb-3 inline-block rounded-sm text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← {back.label}
          </Link>
        ) : null}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        {description ? (
          <div className="mt-2 text-sm text-muted-foreground">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

/** A titled group of form fields or details. */
export function AdminPanel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-sm border border-border bg-card p-6", className)}>
      {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className={cn(title || description ? "mt-5" : undefined, "space-y-5")}>{children}</div>
    </section>
  );
}

const statusStyles = {
  DRAFT: "border-border bg-muted text-foreground",
  IN_REVIEW: "border-accent/50 bg-accent/10 text-foreground",
  PUBLISHED: "border-primary/50 bg-primary/10 text-foreground",
  ARCHIVED: "border-border bg-transparent text-muted-foreground",
} as const;

const statusLabels = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
} as const;

export function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

/** Small neutral label, e.g. "Placeholder". */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-dashed border-border px-2 py-0.5 text-xs whitespace-nowrap text-muted-foreground">
      {children}
    </span>
  );
}

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Kampala",
});

/** Admin timestamps, in East Africa Time. */
export function formatAdminDate(date: Date): string {
  return `${dateTime.format(date)} EAT`;
}

/** Previous/next links for a paginated list. Page numbers are 1-based. */
export function Pagination({
  page,
  pageCount,
  href,
}: {
  page: number;
  pageCount: number;
  href: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4 text-sm">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="rounded-sm text-primary underline-offset-4 hover:underline"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted-foreground">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link
          href={href(page + 1)}
          className="rounded-sm text-primary underline-offset-4 hover:underline"
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Message shown when a list has no rows. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-sm border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

/** One figure on the dashboard: a live count with a label and, optionally, where it leads. */
export function AdminStat({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <>
      <span className="block font-display text-3xl font-semibold tabular-nums">{value}</span>
      <span className="mt-1 block text-sm text-muted-foreground">{label}</span>
    </>
  );
  return (
    <div className="rounded-sm border border-border bg-card p-5">
      {href ? (
        <Link href={href} className="block rounded-sm underline-offset-4 hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
