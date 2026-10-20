import { PartnershipsView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("partnerships");
}

export default async function PartnershipsPage() {
  return <PartnershipsView landing={await loadLandingPage("partnerships")} />;
}
