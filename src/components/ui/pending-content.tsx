import type { ReactNode } from "react";
import { pendingContent, type PendingKey } from "@/content/pending";
import { cn } from "@/lib/utils";
import { PendingIcon } from "./icons";

type PendingContentProps = {
  /** The register entry this placeholder stands for (`src/content/pending.ts`). */
  item: PendingKey;
  /** `block`: a labelled panel. `badge`: a compact label beside placeholder or draft content. */
  variant?: "block" | "badge";
  /** Optional extra context shown inside the block. */
  children?: ReactNode;
  className?: string;
};

const labels = {
  missing: { block: "Awaiting content from EACH", badge: "Placeholder" },
  draft: { block: "Draft for EACH review", badge: "Draft" },
} as const;

/**
 * Visible marker for content EACH has not supplied or approved, so a
 * placeholder is never mistaken for institutional fact. `data-pending` lets
 * tests and reviewers find every marker on a page.
 */
export function PendingContent({
  item,
  variant = "block",
  children,
  className,
}: PendingContentProps) {
  const entry = pendingContent[item];
  const label = labels[entry.kind];

  if (variant === "badge") {
    return (
      <span
        data-pending={item}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-dashed border-foreground/40 px-2.5 py-1 text-xs leading-none font-medium text-foreground",
          className,
        )}
      >
        <PendingIcon className="size-3.5" />
        {label.badge}
        <span className="sr-only">
          : {entry.title} ({label.block})
        </span>
      </span>
    );
  }

  return (
    <div
      role="note"
      data-pending={item}
      className={cn(
        "rounded-sm border border-dashed border-foreground/35 bg-card/90 p-6 md:p-8",
        className,
      )}
    >
      <p className="flex items-center gap-2 text-eyebrow font-medium text-foreground uppercase">
        <PendingIcon />
        {label.block}
      </p>
      <p className="mt-4 font-display text-heading text-balance">{entry.title}</p>
      <p className="mt-3 max-w-2xl leading-7 text-pretty text-muted-foreground">{entry.needed}</p>
      {children ? <div className="mt-4 leading-7 text-muted-foreground">{children}</div> : null}
    </div>
  );
}
