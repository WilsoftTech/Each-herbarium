import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DownloadIcon } from "@/components/ui/icons";
import { KeyFacts } from "@/components/ui/key-facts";
import { PendingContent } from "@/components/ui/pending-content";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import { resourceTypeLabel, type Resource } from "../schema";
import { formatFileSize, formatResourceDate } from "./resource-list";

/** The article page body. Rendered by the public route and by the admin preview. */
export function ArticleDetail({ resource }: { resource: Resource }) {
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
          {resource.document ? (
            <div className="mx-auto mt-12 max-w-[68ch]">
              <Button asChild variant="outline">
                <a href={resource.document.src} download>
                  <DownloadIcon />
                  Download PDF ({formatFileSize(resource.document.byteSize)})
                </a>
              </Button>
            </div>
          ) : null}
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
