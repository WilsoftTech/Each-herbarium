import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, listProjects, ProjectDetail } from "@/features/projects";
import { pageMetadata, staticParams } from "@/lib/metadata";

// Published projects are prerendered; one published after the build renders
// on its first request and is then cached until its content changes.
export async function generateStaticParams() {
  return staticParams((await listProjects()).map((project) => ({ slug: project.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.image,
    noindex: project.status === "placeholder",
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), listProjects()]);
  if (!project) notFound();

  const index = all.findIndex((item) => item.slug === project.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : undefined;

  return <ProjectDetail project={project} next={next} />;
}
