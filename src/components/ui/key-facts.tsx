import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KeyFact = { term: string; value: ReactNode };

type KeyFactsProps = {
  facts: readonly KeyFact[];
  /** Columns from the `sm` breakpoint up. */
  columns?: 1 | 2 | 3 | 4;
  className?: string;
};

const columnClass = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/** Labelled facts as a description list: project details, organisation details, specimen labels. */
export function KeyFacts({ facts, columns = 2, className }: KeyFactsProps) {
  return (
    <dl className={cn("grid grid-cols-1 gap-px overflow-hidden", columnClass[columns], className)}>
      {facts.map((fact) => (
        <div key={fact.term} className="border-t border-border pt-4 pb-6 sm:pr-6">
          <dt className="text-eyebrow font-medium text-muted-foreground uppercase">{fact.term}</dt>
          <dd className="mt-3 leading-7 text-pretty">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
