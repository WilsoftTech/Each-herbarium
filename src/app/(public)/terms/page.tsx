import type { Metadata } from "next";
import { PendingContent } from "@/components/ui/pending-content";
import { loadManagedPage, metadataForPage, PolicyPage } from "@/features/pages";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("terms");
}

// Draft for legal review (`legalPolicies`).
// The words are managed in the CMS (Pages).
export default async function TermsPage() {
  const page = await loadManagedPage("terms");

  return <PolicyPage page={page} aside={<PendingContent item="legalPolicies" />} />;
}
