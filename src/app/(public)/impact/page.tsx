import { ImpactView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("impact");
}

export default async function ImpactPage() {
  return <ImpactView landing={await loadLandingPage("impact")} />;
}
