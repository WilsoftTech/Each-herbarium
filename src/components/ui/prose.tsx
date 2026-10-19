import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Long-form reading column (policies, statements, articles) with typographic defaults for its children. */
export function Prose({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-base leading-8 text-pretty",
        "[&_h2]:mt-14 [&_h2]:scroll-mt-28 [&_h2]:font-display [&_h2]:text-heading [&_h2]:text-balance",
        "[&_h3]:mt-10 [&_h3]:font-medium",
        "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&>:first-child]:mt-0",
        className,
      )}
      {...props}
    />
  );
}
