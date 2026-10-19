import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { hasMenu, legalNavigation, primaryNavigation, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { BrandMark } from "./brand-mark";

const sections = (primaryNavigation as readonly NavItem[]).filter(hasMenu);

/**
 * Global footer: a closing statement with the main actions, identity, a full
 * sitemap from the navigation config (works without JavaScript) and the
 * policy links.
 */
export function SiteFooter() {
  return (
    <footer data-surface="dark" className="border-t border-border">
      <div className="border-b border-border">
        <Container className="py-section-sm">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <p className="font-display text-display-lg font-light text-balance lg:col-span-8">
              Preserving East Africa&apos;s Plant Heritage.
            </p>
            <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
              <Button asChild variant="contrast" size="lg">
                <Link href="/get-involved">
                  Get involved
                  <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/button:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-section-sm">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandMark />
            <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
              {siteConfig.description}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">
              <Link
                href="/bitwiire-herbarium-cafe"
                className="rounded-sm text-foreground underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Bitwiire Herbarium Cafe
              </Link>{" "}
              is an independent partner of EACH.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8"
          >
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="text-eyebrow font-medium text-primary uppercase">
                  <Link href={section.href} className="rounded-sm hover:underline">
                    {section.label}
                  </Link>
                </h2>
                <ul className="mt-5 space-y-3 text-sm">
                  {section.groups
                    .flatMap((group) => group.links)
                    .filter((link) => link.href !== section.href)
                    .map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Policies">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNavigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-sm transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-1 lg:items-end">
            <p>{siteConfig.name}</p>
            <p>
              Photography is credited alongside each image. Some content is awaiting approval and is
              marked on the page.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
