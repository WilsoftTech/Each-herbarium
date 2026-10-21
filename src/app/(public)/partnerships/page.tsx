import { PartnershipsView, formsData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("partnerships");
}

export default async function PartnershipsPage() {
  const [landing, forms] = await Promise.all([loadLandingPage("partnerships"), formsData()]);
  return <PartnershipsView landing={landing} {...forms} />;
}
