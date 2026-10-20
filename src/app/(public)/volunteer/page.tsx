import { VolunteerView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("volunteer");
}

export default async function VolunteerPage() {
  return <VolunteerView landing={await loadLandingPage("volunteer")} />;
}
