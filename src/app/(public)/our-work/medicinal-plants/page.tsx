import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { SpecimenSheet } from "@/components/sections/specimen-sheet";
import { SplitFeature } from "@/components/sections/split-feature";
import { BotanicalIllustration } from "@/components/ui/botanical-illustration";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
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
import { referenceSpecimens } from "@/content/specimens";

const slug = "medicinal-plants";

/** The programme's CMS record and its designed page sections (designed-content.ts). */
async function loadProgramme() {
  const designed = await getDesignedProgramme(slug);
  if (!designed) notFound();
  return designed;
}

export async function generateMetadata() {
  return programmeMetadata((await loadProgramme()).programme);
}

const voucher = referenceSpecimens[0];

export default async function MedicinalPlantsPage() {
  const [designed, following] = await Promise.all([loadProgramme(), nextProgramme(slug)]);
  const { programme, content } = designed;
  const next = following ?? programme;

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Our work", href: "/our-work" }]}
            current={{ label: programme.title, href: programme.href }}
          />
        }
        eyebrow="Our work"
        title={content.header.title}
        lead={<p>{programme.intro}</p>}
        aside={
          // A safety statement: fixed in code so it cannot be removed through the CMS.
          <Notice title="This is not medical advice">
            <p>
              Nothing on this site recommends using any plant to treat a condition. Some plants are
              toxic. Speak to a qualified health professional about any health concern.
            </p>
          </Notice>
        }
        backdrop={
          <div className="absolute top-8 right-[-4rem] hidden w-72 text-primary/15 lg:block">
            <BotanicalIllustration variant="leaf" />
          </div>
        }
      />

      <Section surface="muted" aria-labelledby="example-title">
        <SplitFeature
          eyebrow={content.example.eyebrow}
          title={content.example.title}
          titleId="example-title"
          image={programme.image}
          aspect="landscape"
        >
          <RichParagraphs source={content.example.text} className="space-y-5" />
        </SplitFeature>
      </Section>

      <Section aria-labelledby="approach-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="approach-title"
                eyebrow={content.approach.eyebrow}
                title={content.approach.title}
              />
              {content.approach.marker ? (
                <PendingContent
                  item="medicinalReview"
                  variant="badge"
                  className="self-start md:self-end"
                />
              ) : null}
            </div>
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={content.approach.items} columns={2} />
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="context-title">
        <Reveal>
          <Container className="grid gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <SectionHeading
                id="context-title"
                eyebrow={content.context.eyebrow}
                title={content.context.title}
                description={content.context.description}
              />
              <div data-reveal className="mt-6 leading-8 text-pretty text-muted-foreground">
                <RichParagraphs source={content.context.text} className="space-y-5" />
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-8">
              <SpecimenSheet specimen={voucher} />
            </div>
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
