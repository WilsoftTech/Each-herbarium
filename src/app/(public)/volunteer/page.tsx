import { VolunteerView, formsData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("volunteer");
}

export default async function VolunteerPage() {
  const [landing, forms] = await Promise.all([loadLandingPage("volunteer"), formsData()]);
  return <VolunteerView landing={landing} {...forms} />;
}
