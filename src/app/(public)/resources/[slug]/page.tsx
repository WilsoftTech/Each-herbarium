import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail, getResource, listResources } from "@/features/resources";
import { pageMetadata, staticParams } from "@/lib/metadata";

// Published articles are prerendered; one published after the build renders
// on its first request and is then cached until its content changes.
export async function generateStaticParams() {
  return staticParams((await listResources()).map((resource) => ({ slug: resource.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) notFound();

  return pageMetadata({
    title: resource.title,
    description: resource.summary,
    path: `/resources/${resource.slug}`,
    image: resource.image ?? undefined,
    noindex: resource.status === "placeholder",
  });
}

export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) notFound();

  return <ArticleDetail resource={resource} />;
}
