import { GetInvolvedView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("get-involved");
}

export default async function GetInvolvedPage() {
  return <GetInvolvedView landing={await loadLandingPage("get-involved")} />;
}
