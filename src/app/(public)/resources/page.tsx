import { ResourcesView, resourcesData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("resources");
}

export default async function ResourcesPage() {
  const [landing, data] = await Promise.all([loadLandingPage("resources"), resourcesData()]);
  return <ResourcesView landing={landing} {...data} />;
}
