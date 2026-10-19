import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-24">
      <Container>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          404
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
          Page not found
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block font-medium text-primary underline underline-offset-4"
        >
          Return to the homepage
        </Link>
      </Container>
    </main>
  );
}
