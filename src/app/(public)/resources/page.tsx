import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { DownloadList, listDownloads, listResources, ResourceList } from "@/features/resources";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Resources",
  description:
    "Publications, guides and stories from EACH. The first resources are being prepared.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const [resources, downloads] = await Promise.all([listResources(), listDownloads()]);
  const showsPlaceholders = [...resources, ...downloads].some(
    (item) => item.status === "placeholder",
  );

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Resources", href: "/resources" }} />}
        eyebrow="Herbarium & Research"
        title="Resources"
        lead={
          <p>
            Publications, guides and stories from EACH&apos;s work.
            {showsPlaceholders
              ? " The entries below are placeholders that show how resources will be presented."
              : null}
          </p>
        }
        aside={showsPlaceholders || !resources.length ? <PendingContent item="resources" /> : null}
      />

      <Section aria-label="All resources" className="pt-0">
        <Reveal>
          <Container>
            <ResourceList resources={resources} headingLevel="h2" />
          </Container>
        </Reveal>
      </Section>

      {downloads.length ? (
        <Section surface="muted" aria-labelledby="downloads-title">
          <Reveal>
            <Container>
              <SectionHeading id="downloads-title" eyebrow="Documents" title="Downloads" />
              <DownloadList downloads={downloads} className="mt-12" />
            </Container>
          </Reveal>
        </Section>
      ) : null}
    </>
  );
}
