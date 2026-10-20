import { ResearchView, researchData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("research");
}

export default async function ResearchPage() {
  const [landing, data] = await Promise.all([loadLandingPage("research"), researchData()]);
  return <ResearchView landing={landing} {...data} />;
}
