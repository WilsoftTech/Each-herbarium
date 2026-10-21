import type { Metadata } from "next";
import { loadManagedPage, metadataForPage, PolicyPage } from "@/features/pages";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("terms");
}

// Client-approved policy text is managed in the CMS (Pages).
export default async function TermsPage() {
  const page = await loadManagedPage("terms");

  return <PolicyPage page={page} />;
}
