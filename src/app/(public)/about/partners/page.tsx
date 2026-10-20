import { PartnersView, partnersData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("about-partners");
}

export default async function PartnersPage() {
  const [landing, data] = await Promise.all([loadLandingPage("about-partners"), partnersData()]);
  return <PartnersView landing={landing} {...data} />;
}
