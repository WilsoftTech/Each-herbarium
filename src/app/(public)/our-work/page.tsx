import { OurWorkView, ourWorkData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("our-work");
}

export default async function OurWorkPage() {
  const [landing, data] = await Promise.all([loadLandingPage("our-work"), ourWorkData()]);
  return <OurWorkView landing={landing} {...data} />;
}
