import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type NoticeProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * An important note the reader should not miss, such as "This is not medical
 * advice" or "Online forms are not available yet". For missing content, use
 * `PendingContent` instead.
 */
export function Notice({ title, children, className }: NoticeProps) {
  return (
    <div
      role="note"
      className={cn("rounded-sm border border-foreground/20 bg-card p-6", className)}
    >
      <p className="font-medium text-card-foreground">{title}</p>
      <div className="mt-2 space-y-3 text-base leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}
