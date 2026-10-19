"use client"; // Error boundaries must be Client Components (Next.js requirement).

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

type ErrorProps = { error: unknown; retry: () => void };

/** Shown inside the site header and footer when a public page fails to render. */
export default function PublicError({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section aria-labelledby="error-title" className="flex flex-1 items-center py-section">
      <Container>
        <Eyebrow>Error</Eyebrow>
        <h1 id="error-title" className="mt-6 font-display text-display-lg">
          Something went wrong
        </h1>
        <p className="mt-6 max-w-xl text-lead text-muted-foreground">
          This page could not be shown. Please try again, or return to the homepage.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button size="lg" onClick={() => retry()}>
            Try again
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Return to the homepage</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
