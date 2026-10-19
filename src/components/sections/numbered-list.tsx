import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type NumberedItem = { title: string; body: ReactNode };

type NumberedListProps = {
  items: readonly NumberedItem[];
  columns?: 1 | 2 | 3;
  /** Heading level of each item, following the surrounding section heading. */
  itemHeading?: "h3" | "h4";
  className?: string;
};

const columnClass = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
} as const;

/**
 * Ordered editorial list with large numerals: principles, process steps,
 * themes. The items stagger in on scroll.
 */
export function NumberedList({
  items,
  columns = 2,
  itemHeading: Heading = "h3",
  className,
}: NumberedListProps) {
  return (
    <Reveal>
      <ol className={cn("grid gap-x-12 gap-y-12", columnClass[columns], className)}>
        {items.map((item, index) => (
          <li key={item.title} data-reveal className="border-t border-border pt-6">
            <span aria-hidden="true" className="font-display text-sm text-primary tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Heading className="mt-4 font-display text-heading text-balance">{item.title}</Heading>
            <div className="mt-3 leading-7 text-pretty text-muted-foreground">{item.body}</div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
