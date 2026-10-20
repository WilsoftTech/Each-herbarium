import { BitwiireView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("bitwiire-herbarium-cafe");
}

export default async function BitwiirePage() {
  return <BitwiireView landing={await loadLandingPage("bitwiire-herbarium-cafe")} />;
}
