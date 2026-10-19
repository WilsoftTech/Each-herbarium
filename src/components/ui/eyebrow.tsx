import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Small uppercase label that introduces a heading. */
export function Eyebrow({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("text-eyebrow font-medium text-primary uppercase", className)} {...props} />
  );
}
