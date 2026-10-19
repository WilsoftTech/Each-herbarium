import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

/** Horizontally centred, width-constrained wrapper with the site's page gutters. */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={["mx-auto w-full max-w-7xl px-6 md:px-10", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
