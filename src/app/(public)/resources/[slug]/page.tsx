import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { KeyFacts } from "@/components/ui/key-facts";
import { PendingContent } from "@/components/ui/pending-content";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import {
  formatResourceDate,
  getResource,
  listResources,
  resourceTypeLabel,
} from "@/features/resources";
import { pageMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  return (await listResources()).map((resource) => ({ slug: resource.slug }));
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

  const placeholder = resource.status === "placeholder";

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Resources", href: "/resources" }]}
            current={{ label: resource.title, href: `/resources/${resource.slug}` }}
          />
        }
        eyebrow={resourceTypeLabel[resource.type]}
        title={resource.title}
        lead={<p>{resource.summary}</p>}
        aside={
          <KeyFacts
            columns={1}
            facts={[
              { term: "Type", value: resourceTypeLabel[resource.type] },
              { term: "Published", value: formatResourceDate(resource.published) },
              {
                term: "Authors",
                value: resource.authors.length ? (
                  resource.authors.join(", ")
                ) : (
                  <PendingContent item="resources" variant="badge" />
                ),
              },
            ]}
          />
        }
        image={resource.image ?? undefined}
      />

      <Section aria-label="Article" className="pt-0">
        <Container>
          {resource.body.length && !placeholder ? (
            <Prose className="mx-auto">
              {resource.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          ) : (
            <div className="mx-auto max-w-[68ch]">
              <PendingContent item="resources" />
            </div>
          )}
        </Container>
      </Section>

      <SequenceNav
        label="Back to resources"
        title="All resources"
        href="/resources"
        description="Publications, guides and stories."
      />
    </>
  );
}
