import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { Hero } from "@/components/sections/hero";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { SplitFeature } from "@/components/sections/split-feature";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import {
  getProgramme,
  nextProgramme,
  ProgrammeDetails,
  programmeMetadata,
} from "@/features/programmes";
import { listProjectsForProgramme, ProjectCards } from "@/features/projects";

const slug = "environmental-conservation";

/** The programme's CMS record (title, summary, intro, image). The rest of the page is designed copy. */
async function loadProgramme() {
  const programme = await getProgramme(slug);
  if (!programme) notFound();
  return programme;
}

export async function generateMetadata() {
  return programmeMetadata(await loadProgramme());
}

const services = [
  {
    title: "Water",
    body: "Forests and wetlands catch, store and filter the water that towns and farms rely on.",
  },
  { title: "Soil", body: "Roots and ground cover hold soil on slopes and riverbanks." },
  {
    title: "Carbon",
    body: "Forests and papyrus peat store carbon that would otherwise reach the atmosphere.",
  },
  {
    title: "Livelihoods",
    body: "Ecosystems provide materials, food, grazing and medicine for nearby communities.",
  },
] as const;

export default async function EnvironmentalConservationPage() {
  const programme = await loadProgramme();
  const projects = await listProjectsForProgramme(programme.slug);
  const next = (await nextProgramme(programme.slug)) ?? programme;

  return (
    <>
      <Hero
        size="tall"
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Our work", href: "/our-work" }]}
            current={{ label: programme.title, href: programme.href }}
          />
        }
        eyebrow="Our work"
        title={programme.title}
        description={programme.summary}
        image={programme.image}
        focus="50% 55%"
        nextSectionId="ecosystems"
      />

      <Section id="ecosystems" aria-labelledby="ecosystems-title">
        <Reveal>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                id="ecosystems-title"
                eyebrow="Ecosystems"
                title="Plants live in places"
                description={programme.intro}
              />
            </div>
            <dl data-reveal className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-6">
              {services.map((service) => (
                <div key={service.title} className="border-t border-border pt-5">
                  <dt className="font-display text-heading">{service.title}</dt>
                  <dd className="mt-2 leading-7 text-muted-foreground">{service.body}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="forest-title">
        <SplitFeature
          eyebrow="Forests"
          title="Where rivers begin"
          titleId="forest-title"
          image={media.mabiraStream}
          aspect="landscape"
        >
          <p>
            Uganda&apos;s forests, from Mabira to Budongo and Bwindi, hold much of the
            country&apos;s plant diversity. Streams that rise under their canopy feed the land
            beyond.
          </p>
        </SplitFeature>
      </Section>

      <FullBleedImage
        image={media.kidepoSavanna}
        eyebrow="Savannas and drylands"
        statement="Grasslands and drylands are rich ecosystems in their own right, shaped by season, grazing and fire."
      />

      <Section aria-labelledby="edges-title">
        <SplitFeature
          eyebrow="Mosaics"
          title="Where forest meets grassland"
          titleId="edges-title"
          image={media.semulikiVegetation}
          aspect="landscape"
          reverse
        >
          <p>
            Many East African landscapes are mosaics of forest, grassland and wetland. The edges
            between them are often especially rich in plants, and especially exposed to change.
          </p>
        </SplitFeature>
        <Container className="mt-section-sm">
          <PendingContent item="programmeDetails" />
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="related-title">
        <Reveal>
          <Container>
            <SectionHeading id="related-title" eyebrow="Projects" title="Related projects" />
            <ProjectCards projects={projects} className="mt-14" />
          </Container>
        </Reveal>
      </Section>

      <ProgrammeDetails programme={programme} />

      <SequenceNav
        label="Next programme"
        title={next.title}
        href={next.href}
        description={next.summary}
      />
    </>
  );
}
