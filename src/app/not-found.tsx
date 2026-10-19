import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
};

// Renders the public header and footer so visitors can keep navigating. Sections
// linked from the navigation return this page until they are built in M03.
export default function NotFound() {
  return (
    <>
      <SiteHeader notFound />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center py-section outline-none">
        <Container>
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-6 font-display text-display-lg">Page not found</h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            The page you are looking for does not exist or has moved.
          </p>
          <Button asChild className="mt-10" size="lg">
            <Link href="/">
              Return to the homepage
              <ArrowRightIcon className="transition-transform group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
