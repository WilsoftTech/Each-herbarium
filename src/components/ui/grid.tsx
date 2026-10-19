import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type GridProps = ComponentPropsWithoutRef<"div"> & {
  /** Columns at the widest breakpoint. Collapses to one column on small screens. */
  columns?: 2 | 3 | 4;
};

const columnClass = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/** Responsive content grid with the standard gutter. */
export function Grid({ columns = 3, className, ...props }: GridProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-x-8 gap-y-14", columnClass[columns], className)}
      {...props}
    />
  );
}
