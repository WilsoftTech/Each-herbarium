import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { Statement } from "@/components/sections/statement";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { KeyFacts } from "@/components/ui/key-facts";
import { MediaCard } from "@/components/ui/media-card";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { siteConfig } from "@/config/site";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("about");
}

export default async function AboutPage() {
  const page = await loadManagedPage("about");
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "About EACH", href: "/about" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        image={page.image ?? undefined}
      />

      <Statement
        id="purpose"
        eyebrow="Our purpose"
        text="Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations."
        action={{ label: "Mission and values", href: "/about/mission" }}
      />

      <Section aria-labelledby="facts-title">
        <Reveal>
          <Container className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="facts-title"
                eyebrow="At a glance"
                title="What we can say today"
                description="EACH is at an early stage. These details are confirmed; the rest of our story will be published once it is approved."
              />
            </div>
            <div data-reveal className="lg:col-span-7">
              <KeyFacts
                facts={[
                  { term: "Name", value: siteConfig.name },
                  { term: "Short name", value: siteConfig.shortName },
                  {
                    term: "Focus",
                    value: "Plant conservation, herbarium development and botanical knowledge",
                  },
                  { term: "Where we begin", value: "Uganda" },
                  { term: "Region", value: siteConfig.region },
                  {
                    term: "Independent partner",
                    value: "Bitwiire Herbarium Cafe (a separate organisation)",
                  },
                  {
                    term: "Legal status",
                    value: <PendingContent item="organisation" variant="badge" />,
                  },
                  { term: "Founded", value: <PendingContent item="history" variant="badge" /> },
                  {
                    term: "Photography",
                    value: (
                      <span className="flex flex-col items-start gap-2">
                        Openly licensed stand-in images, credited where they appear
                        <PendingContent item="photography" variant="badge" />
                      </span>
                    ),
                  },
                ]}
              />
              <PendingContent item="history" className="mt-10" />
            </div>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="explore-title">
        <Reveal>
          <Container>
            <SectionHeading id="explore-title" eyebrow="More about us" title="Explore EACH" />
            <Grid columns={3} className="mt-14">
              <MediaCard
                href="/about/mission"
                eyebrow="Purpose"
                title="Mission and values"
                description="Why EACH exists and the principles behind its work."
                image={media.heroBwindiMist}
                aspect="landscape"
              />
              <MediaCard
                href="/about/leadership"
                eyebrow="People"
                title="Leadership"
                description="The people who guide EACH."
                image={media.budongoTree}
                aspect="landscape"
              />
              <MediaCard
                href="/about/partners"
                eyebrow="Collaboration"
                title="Partners"
                description="The organisations EACH works alongside."
                image={media.semulikiVegetation}
                aspect="landscape"
              />
            </Grid>
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
