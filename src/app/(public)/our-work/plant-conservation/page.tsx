import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { Hero } from "@/components/sections/hero";
import { NumberedList } from "@/components/sections/numbered-list";
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

const slug = "plant-conservation";

/** The programme's CMS record and its designed page sections (designed-content.ts). */
async function loadProgramme() {
  const designed = await getDesignedProgramme(slug);
  if (!designed) notFound();
  return designed;
}

export async function generateMetadata() {
  return programmeMetadata((await loadProgramme()).programme);
}

export default async function PlantConservationPage() {
  const [designed, projects, following] = await Promise.all([
    loadProgramme(),
    listProjectsForProgramme(slug),
    nextProgramme(slug),
  ]);
  const { programme, content, images } = designed;
  const next = following ?? programme;
  const photograph = images[content.photograph.imageId];

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
        focus="70% 40%"
        nextSectionId="why"
      />

      <Section id="why" aria-labelledby="why-title">
        <SplitFeature
          eyebrow={content.why.eyebrow}
          title={content.why.title}
          titleId="why-title"
          image={images[content.why.imageId] ?? programme.image}
          aspect="landscape"
        >
          <p>{programme.intro}</p>
          <RichParagraphs source={content.why.text} className="space-y-5" />
        </SplitFeature>
      </Section>

      <Section surface="muted" aria-labelledby="approach-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="approach-title"
              eyebrow={content.approach.eyebrow}
              title={content.approach.title}
              description={content.approach.description}
            />
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={content.approach.items} columns={2} />
          {content.approach.details ? (
            <RichParagraphs
              source={content.approach.details}
              className="mt-14 max-w-3xl space-y-5 text-lead text-pretty text-muted-foreground"
            />
          ) : (
            <PendingContent item="programmeDetails" className="mt-14" />
          )}
        </Container>
      </Section>

      {photograph ? (
        <FullBleedImage
          image={photograph}
          eyebrow={content.photograph.eyebrow}
          statement={content.photograph.statement}
        />
      ) : null}

      <Section aria-labelledby="related-title">
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
