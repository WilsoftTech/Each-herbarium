import type { Metadata } from "next";
import { PendingContent } from "@/components/ui/pending-content";
import { loadManagedPage, metadataForPage, PolicyPage } from "@/features/pages";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("accessibility");
}

// Statements describe the site as built and tested (docs/audits/M03-verification.md).
// The words are managed in the CMS (Pages).
export default async function AccessibilityPage() {
  const page = await loadManagedPage("accessibility");

  return (
    <PolicyPage
      page={page}
      footer={<PendingContent item="accessibilityContact" className="mt-12 max-w-[68ch]" />}
    />
  );
}
