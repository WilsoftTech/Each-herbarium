import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { Hero } from "@/components/sections/hero";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { SplitFeature } from "@/components/sections/split-feature";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { RichParagraphs } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getDesignedProgramme,
  nextProgramme,
  ProgrammeDetails,
  programmeMetadata,
} from "@/features/programmes";
import { listProjectsForProgramme, ProjectCards } from "@/features/projects";

const slug = "environmental-conservation";

/** The programme's CMS record and its designed page sections (designed-content.ts). */
async function loadProgramme() {
  const designed = await getDesignedProgramme(slug);
  if (!designed) notFound();
  return designed;
}

export async function generateMetadata() {
  return programmeMetadata((await loadProgramme()).programme);
}

export default async function EnvironmentalConservationPage() {
  const { programme, content, images } = await loadProgramme();
  const projects = await listProjectsForProgramme(programme.slug);
  const next = (await nextProgramme(programme.slug)) ?? programme;
  const forestImage = images[content.forests.imageId];
  const photograph = images[content.photograph.imageId];
  const mosaicImage = images[content.mosaics.imageId];

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
                eyebrow={content.ecosystems.eyebrow}
                title={content.ecosystems.title}
                description={programme.intro}
              />
            </div>
            <dl data-reveal className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-6">
              {content.ecosystems.items.map((service) => (
                <div key={service.title} className="border-t border-border pt-5">
                  <dt className="font-display text-heading">{service.title}</dt>
                  <dd className="mt-2 leading-7 text-muted-foreground">{service.body}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Reveal>
      </Section>

      {forestImage ? (
        <Section surface="muted" aria-labelledby="forest-title">
          <SplitFeature
            eyebrow={content.forests.eyebrow}
            title={content.forests.title}
            titleId="forest-title"
            image={forestImage}
            aspect="landscape"
          >
            <RichParagraphs source={content.forests.text} className="space-y-5" />
          </SplitFeature>
        </Section>
      ) : null}

      {photograph ? (
        <FullBleedImage
          image={photograph}
          eyebrow={content.photograph.eyebrow}
          statement={content.photograph.statement}
        />
      ) : null}

      <Section aria-labelledby="edges-title">
        {mosaicImage ? (
          <SplitFeature
            eyebrow={content.mosaics.eyebrow}
            title={content.mosaics.title}
            titleId="edges-title"
            image={mosaicImage}
            aspect="landscape"
            reverse
          >
            <RichParagraphs source={content.mosaics.text} className="space-y-5" />
          </SplitFeature>
        ) : null}
        <Container className="mt-section-sm">
          {content.mosaics.details ? (
            <RichParagraphs
              source={content.mosaics.details}
              className="max-w-3xl space-y-5 text-lead text-pretty text-muted-foreground"
            />
          ) : (
            <PendingContent item="programmeDetails" />
          )}
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="related-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="related-title"
              eyebrow={content.related.eyebrow}
              title={content.related.title}
            />
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
