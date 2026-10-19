"use client"; // Error boundaries must be Client Components (Next.js requirement).

import "./globals.css";

type GlobalErrorProps = { error: unknown; retry: () => void };

/** Last-resort error page when the root layout itself fails. Renders its own document. */
export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-svh items-center font-sans">
        <title>Something went wrong | EACH</title>
        <main className="mx-auto w-full max-w-7xl px-6 py-section md:px-10">
          <p className="text-eyebrow font-medium text-primary uppercase">
            East African Community Herbariums
          </p>
          <h1 className="mt-6 font-display text-display-lg">Something went wrong</h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            The website could not be shown. Please try again.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => retry()}
              className="h-13 rounded-sm bg-primary px-7 font-medium text-primary-foreground"
            >
              Try again
            </button>
            {/* A full page load, since client navigation may be what failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex h-13 items-center rounded-sm border border-foreground/40 px-7 font-medium"
            >
              Return to the homepage
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
