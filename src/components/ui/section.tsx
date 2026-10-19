import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /**
   * Colour scheme. `dark` and `warm` switch the token set via `data-surface`;
   * `warm` is reserved for the independent partner, Bitwiire Herbarium Cafe.
   */
  surface?: "light" | "muted" | "dark" | "warm";
  spacing?: "default" | "compact" | "none";
};

const spacingClass = {
  default: "py-section",
  compact: "py-section-sm",
  none: "",
} as const;

/** Page section with the vertical rhythm and surface tokens. Pair with `Container`. */
export function Section({
  surface = "light",
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      data-surface={surface === "dark" || surface === "warm" ? surface : undefined}
      className={cn(
        "relative",
        surface === "muted" && "bg-muted",
        spacingClass[spacing],
        className,
      )}
      {...props}
    />
  );
}
