import Link from "next/link";
import { env } from "@/config/env";
import { breadcrumbJsonLd, type Crumb } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "./icons";
import { JsonLd } from "./json-ld";

type BreadcrumbsProps = {
  /** Ancestors of the current page, starting after Home. */
  trail?: readonly Crumb[];
  /** The current page. */
  current: Crumb;
  className?: string;
};

/** Breadcrumb trail with matching `BreadcrumbList` structured data. Home is added automatically. */
export function Breadcrumbs({ trail = [], current, className }: BreadcrumbsProps) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...trail, current];

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {isCurrent ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className="rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRightIcon className="size-3.5 opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbJsonLd(crumbs, env.siteUrl)} />
    </nav>
  );
}
