import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteChrome } from "@/features/settings";

/**
 * Every public route must be produced completely at build time (validated by
 * `next build`). Unknown project or resource slugs are then rendered before
 * any response is sent, so `notFound()` returns a real 404 instead of a
 * streamed shell with a 200 status.
 */
export const ensureStatic = "navigation";

// The single `main` landmark for every public page; the skip link targets it.
// Navigation labels and footer wording come from the CMS (Settings).
export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const chrome = await getSiteChrome();
  return (
    <>
      <SiteHeader navigation={chrome.navigation} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <SiteFooter navigation={chrome.navigation} content={chrome.footer} />
    </>
  );
}
