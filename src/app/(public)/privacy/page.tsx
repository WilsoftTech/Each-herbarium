import type { Metadata } from "next";
import { PendingContent } from "@/components/ui/pending-content";
import { loadManagedPage, metadataForPage, PolicyPage } from "@/features/pages";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("privacy");
}

// Draft: describes what the site does today. Legal review pending (`legalPolicies`).
// The words are managed in the CMS (Pages).
export default async function PrivacyPage() {
  const page = await loadManagedPage("privacy");

  return <PolicyPage page={page} aside={<PendingContent item="legalPolicies" />} />;
}
