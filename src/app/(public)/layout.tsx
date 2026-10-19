import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Every public route must be produced completely at build time (validated by
 * `next build`). Unknown project or resource slugs are then rendered before
 * any response is sent, so `notFound()` returns a real 404 instead of a
 * streamed shell with a 200 status.
 */
export const ensureStatic = "navigation";

// The single `main` landmark for every public page; the skip link targets it.
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
