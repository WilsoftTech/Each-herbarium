import { ProjectsView, projectsData, loadLandingPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("projects");
}

export default async function ProjectsPage() {
  const [landing, data] = await Promise.all([loadLandingPage("projects"), projectsData()]);
  return <ProjectsView landing={landing} {...data} />;
}
