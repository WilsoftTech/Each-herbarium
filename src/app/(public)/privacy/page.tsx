import type { Metadata } from "next";
import { loadManagedPage, metadataForPage, PolicyPage } from "@/features/pages";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("privacy");
}

// Client-approved policy text is managed in the CMS (Pages).
export default async function PrivacyPage() {
  const page = await loadManagedPage("privacy");

  return <PolicyPage page={page} />;
}
