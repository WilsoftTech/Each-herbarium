import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PendingContent } from "@/components/ui/pending-content";
import { getPage, PolicyPage } from "@/features/pages";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("accessibility");
  if (!page) notFound();
  return pageMetadata({ title: page.title, description: page.description, path: "/accessibility" });
}

// Statements describe the site as built and tested (docs/audits/M03-verification.md).
// The words are managed in the CMS (Pages).
export default async function AccessibilityPage() {
  const page = await getPage("accessibility");
  if (!page) notFound();

  return (
    <PolicyPage
      page={page}
      footer={<PendingContent item="accessibilityContact" className="mt-12 max-w-[68ch]" />}
    />
  );
}
