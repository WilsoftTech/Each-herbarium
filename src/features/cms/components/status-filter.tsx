import Link from "next/link";
import { cn } from "@/lib/utils";
import { listHref, type ListParams } from "../list-params";
import { contentStatuses, statusLabel, type ContentStatus } from "../workflow";

type StatusFilterProps = {
  basePath: string;
  params: ListParams;
  /** Rows per status, for the counts shown on each filter. */
  counts: Partial<Record<ContentStatus, number>>;
};

/** Filter a content list by workflow status. */
export function StatusFilter({ basePath, params, counts }: StatusFilterProps) {
  const total = Object.values(counts).reduce((sum, count) => sum + (count ?? 0), 0);
  const options: { status?: ContentStatus; label: string; count: number }[] = [
    { label: "All", count: total },
    ...contentStatuses.map((status) => ({
      status,
      label: statusLabel[status],
      count: counts[status] ?? 0,
    })),
  ];

  return (
    <nav aria-label="Filter by status" className="mb-6">
      <ul className="flex flex-wrap gap-2 text-sm">
        {options.map((option) => {
          const current = option.status === params.status;
          return (
            <li key={option.label}>
              <Link
                href={listHref(basePath, { ...params, status: option.status }, 1)}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-sm border px-3 py-1.5",
                  current
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {option.label}
                <span className="tabular-nums">{option.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
