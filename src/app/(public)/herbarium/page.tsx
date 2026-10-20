import { HerbariumView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("herbarium");
}

export default async function HerbariumPage() {
  return <HerbariumView landing={await loadLandingPage("herbarium")} />;
}
