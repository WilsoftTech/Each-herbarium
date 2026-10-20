import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PendingContent } from "@/components/ui/pending-content";
import { getPage, PolicyPage } from "@/features/pages";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("terms");
  if (!page) notFound();
  return pageMetadata({ title: page.title, description: page.description, path: "/terms" });
}

// Draft for legal review (`legalPolicies`).
// The words are managed in the CMS (Pages).
export default async function TermsPage() {
  const page = await getPage("terms");
  if (!page) notFound();

  return <PolicyPage page={page} aside={<PendingContent item="legalPolicies" />} />;
}
