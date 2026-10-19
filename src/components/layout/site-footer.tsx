import Link from "next/link";
import { Container } from "@/components/ui/container";
import { hasMenu, primaryNavigation, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { BrandMark } from "./brand-mark";

const sections = (primaryNavigation as readonly NavItem[]).filter(hasMenu);

/** Global footer: identity and a full sitemap from the navigation config. */
export function SiteFooter() {
  return (
    <footer data-surface="dark" className="border-t border-border">
      <Container className="py-section-sm">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandMark />
            <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
              {siteConfig.description}
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
        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>{siteConfig.name}</p>
          <p>Photography is credited alongside each image.</p>
        </div>
      </Container>
    </footer>
  );
}
