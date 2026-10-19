import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Heading level. Pages own their single `h1`, so sections default to `h2`. */
  as?: "h1" | "h2" | "h3";
  /** Give the heading an id to label its section with `aria-labelledby`. */
  id?: string;
  align?: "start" | "center";
  className?: string;
};

/** Eyebrow, display heading and optional lead paragraph. Marked as a `Reveal` target. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  id,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}
      data-reveal
    >
      {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
      <Heading id={id} className="font-display text-display-md font-normal text-balance">
        {title}
      </Heading>
      {description ? (
        <p className="mt-6 text-lead text-pretty text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
