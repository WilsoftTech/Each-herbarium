import type { ReactNode } from "react";
import Link from "next/link";
import { adminNavigation } from "@/config/admin-navigation";
import { can, roleLabel, type Role } from "@/services/permissions";
import { AdminNavLink } from "./admin-nav-link";

type AdminShellProps = {
  user: { name: string; email: string; role: Role };
  /** Sign-out control (a form bound to the sign-out action). */
  signOut: ReactNode;
  children: ReactNode;
};

/**
 * Layout of the admin console: a sidebar with the sections the user's role
 * can open, and the page. Clarity over decoration: no motion beyond colour
 * transitions. Links are filtered for convenience only; every page and action
 * authorises on the server.
 */
export function AdminShell({ user, signOut, children }: AdminShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background lg:flex-row">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-sm bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <Link href="/admin" className="rounded-sm font-display text-lg font-semibold">
            EACH admin
          </Link>
          <Link
            href="/"
            className="rounded-sm text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            View site
          </Link>
        </div>
        <nav aria-label="Admin" className="px-3 pb-4">
          <div className="flex gap-6 overflow-x-auto lg:block lg:space-y-6 lg:overflow-visible">
            {adminNavigation.map((group) => {
              const items = group.items.filter((item) => can(user.role, item.permission));
              if (!items.length) return null;
              return (
                <div key={group.label} className="shrink-0">
                  <p className="px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {group.label}
                  </p>
                  <ul className="flex gap-1 lg:block lg:space-y-0.5">
                    {items.map((item) => (
                      <li key={item.href} className="shrink-0">
                        <AdminNavLink href={item.href}>{item.label}</AdminNavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-border px-5 py-4 text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground">
            {roleLabel[user.role]} · {user.email}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/admin/account"
              className="rounded-sm text-primary underline-offset-4 hover:underline"
            >
              Your account
            </Link>
            {signOut}
          </div>
        </div>
      </aside>
      <main
        id="admin-main"
        tabIndex={-1}
        className="min-w-0 flex-1 px-5 py-8 outline-none lg:px-10 lg:py-10"
      >
        {children}
      </main>
    </div>
  );
}
