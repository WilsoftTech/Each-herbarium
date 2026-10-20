import { AboutView, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("about");
}

export default async function AboutPage() {
  return <AboutView landing={await loadLandingPage("about")} />;
}
