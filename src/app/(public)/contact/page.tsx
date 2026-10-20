import { ContactView, contactData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("contact");
}

export default async function ContactPage() {
  const [landing, data] = await Promise.all([loadLandingPage("contact"), contactData()]);
  return <ContactView landing={landing} {...data} />;
}
