"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Sidebar link that marks the current section with aria-current. */
export function AdminNavLink({ href, children }: { href: string; children: string }) {
  const pathname = usePathname();
  const current = href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "block rounded-sm px-3 py-2 text-sm transition-colors duration-(--motion-duration-fast)",
        current
          ? "bg-primary/10 font-medium text-foreground"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
