"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { Container } from "@/components/ui/container";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";

/**
 * Routes that open with the full-bleed `Hero`, where the header starts
 * transparent. Keep in sync with the pages that render `Hero` (e2e:
 * tests/e2e/header.spec.ts).
 */
const HERO_ROUTES: ReadonlySet<string> = new Set([
  "/",
  "/our-work",
  "/our-work/plant-conservation",
  "/our-work/environmental-conservation",
]);
/** Project case studies (`/projects/[slug]`) also open with a hero. */
const HERO_PREFIXES = ["/projects/"] as const;

function opensWithHero(pathname: string): boolean {
  return HERO_ROUTES.has(pathname) || HERO_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

type SiteHeaderProps = {
  /**
   * Set on the 404 page. That page is prerendered once and served for every
   * unknown URL, so it must not highlight a section from the browser URL
   * (the server and client markup would differ).
   */
  notFound?: boolean;
};

/**
 * Fixed global header. Transparent with light text over a hero, then solid
 * once the page scrolls or a mega menu opens. Other routes get a spacer so
 * their content starts below the header.
 */
export function SiteHeader({ notFound = false }: SiteHeaderProps) {
  const browserPathname = usePathname();
  const pathname = notFound ? "" : browserPathname;
  const scrolled = useScrolled();
  // The pathname the mega menu was opened on, so a route change resets it.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const onMenuOpenChange = useCallback(
    (open: boolean) => setMenuOpenOn(open ? pathname : null),
    [pathname],
  );

  const overHero = opensWithHero(pathname);
  const solid = !overHero || scrolled || menuOpenOn === pathname;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="fixed top-3 left-3 z-70 -translate-y-24 rounded-sm bg-foreground px-4 py-3 text-sm font-medium text-background transition-transform focus-visible:translate-y-0"
        >
          Skip to main content
        </a>
        <header
          data-appearance={solid ? "solid" : "transparent"}
          data-surface={solid ? undefined : "dark"}
          className={cn(
            "fixed inset-x-0 top-0 z-50 h-header border-b text-foreground transition-[background-color,border-color,color,box-shadow] duration-(--motion-duration-slow) ease-cinematic",
            solid
              ? "border-border bg-background shadow-[0_1px_24px_-12px_rgb(0_0_0/0.25)]"
              : "border-transparent bg-transparent",
          )}
        >
          <Container className="flex h-full max-w-[96rem] items-center justify-between gap-6">
            <BrandMark />
            <DesktopNav pathname={pathname} onOpenChange={onMenuOpenChange} />
            <MobileNav pathname={pathname} />
          </Container>
        </header>
        {overHero ? null : <div aria-hidden="true" className="h-header shrink-0" />}
      </MotionConfig>
    </LazyMotion>
  );
}
