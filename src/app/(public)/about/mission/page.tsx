import { Reveal } from "@/components/motion/reveal";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("about-mission");
}

// Draft principles for EACH to confirm (pending: `values`).
const principles = [
  {
    title: "Science first",
    body: "Every plant record is accurately identified, documented and kept, so that others can check and build on it.",
  },
  {
    title: "Knowledge with consent",
    body: "Community and indigenous knowledge is recorded only with the consent of its custodians, credited to them and shared on their terms.",
  },
  {
    title: "Open by default",
    body: "What EACH learns is shared as openly as is safe, so it can serve students, researchers and conservation.",
  },
  {
    title: "Rooted in the region",
    body: "Work in East Africa is led with, and for, the people of East Africa.",
  },
  {
    title: "Careful with claims",
    body: "Traditional uses of plants are documented in context and never presented as proven medical treatments.",
  },
  {
    title: "Independent partnerships",
    body: "EACH works alongside independent partners and is clear about where each organisation's responsibility lies.",
  },
] as const;

export default async function MissionPage() {
  const page = await loadManagedPage("about-mission");
  const trail = [{ label: "About EACH", href: "/about" }];

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={trail}
            current={{ label: "Mission and values", href: "/about/mission" }}
          />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={<PendingContent item="missionStatement" />}
      />

      <FullBleedImage image={media.heroBwindiMist} height="medium" />

      <Section aria-labelledby="principles-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="principles-title"
                eyebrow="Values"
                title="The principles behind our work"
                description="Proposed principles that will guide how EACH collects, records and shares plant knowledge."
              />
              <PendingContent item="values" variant="badge" className="self-start md:self-end" />
            </div>
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={principles} columns={3} />
        </Container>
      </Section>

      <SequenceNav
        label="Next in About EACH"
        title="Leadership"
        href="/about/leadership"
        description="The people who guide EACH."
      />
    </>
  );
}
