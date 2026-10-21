import { GetInvolvedView, formsData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("get-involved");
}

export default async function GetInvolvedPage() {
  const [landing, forms] = await Promise.all([loadLandingPage("get-involved"), formsData()]);
  return <GetInvolvedView landing={landing} {...forms} />;
}
