import { MissionView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("about-mission");
}

export default async function MissionPage() {
  return <MissionView landing={await loadLandingPage("about-mission")} />;
}
