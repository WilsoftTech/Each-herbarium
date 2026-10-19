import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { listResources, ResourceList } from "@/features/resources";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Resources",
  description:
    "Publications, guides and stories from EACH. The first resources are being prepared.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await listResources();

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Resources", href: "/resources" }} />}
        eyebrow="Herbarium & Research"
        title="Resources"
        lead={
          <p>
            Publications, guides and stories from EACH&apos;s work. The entries below are
            placeholders that show how resources will be presented.
          </p>
        }
        aside={<PendingContent item="resources" />}
      />

      <Section aria-label="All resources" className="pt-0">
        <Reveal>
          <Container>
            <ResourceList resources={resources} headingLevel="h2" />
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
