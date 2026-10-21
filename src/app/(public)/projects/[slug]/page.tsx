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
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.summary,
    path: `/projects/${project.slug}`,
    image: project.image,
    noindex: project.noindex || project.status === "placeholder",
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), listProjects()]);
  if (!project) notFound();

  const published = all.filter((item) => item.status === "published");
  const index = published.findIndex((item) => item.slug === project.slug);
  const next =
    index >= 0 && published.length > 1 ? published[(index + 1) % published.length] : undefined;

  return <ProjectDetail project={project} next={next} />;
}
