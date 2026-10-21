import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Statement } from "@/components/sections/statement";
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

const slug = "indigenous-knowledge";

/** The programme's CMS record and its designed page sections (designed-content.ts). */
async function loadProgramme() {
  const designed = await getDesignedProgramme(slug);
  if (!designed) notFound();
  return designed;
}

export async function generateMetadata() {
  return programmeMetadata((await loadProgramme()).programme);
}

export default async function IndigenousKnowledgePage() {
  const [designed, following] = await Promise.all([loadProgramme(), nextProgramme(slug)]);
  const { programme, content } = designed;
  const next = following ?? programme;

  return (
    <>
      <PageHeader
        surface="dark"
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Our work", href: "/our-work" }]}
            current={{ label: programme.title, href: programme.href }}
          />
        }
        eyebrow="Our work"
        title={content.header.title}
        lead={<p>{programme.intro}</p>}
        image={programme.image}
      />

      <Statement
        id="living-knowledge"
        eyebrow={content.statement.eyebrow}
        surface="light"
        text={content.statement.text}
        detail={content.statement.detail}
      />

      <Section surface="muted" aria-labelledby="principles-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="principles-title"
                eyebrow={content.principles.eyebrow}
                title={content.principles.title}
              />
              {content.principles.marker ? (
                <PendingContent
                  item="communityProtocols"
                  variant="badge"
                  className="self-start md:self-end"
                />
              ) : null}
            </div>
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={content.principles.items} columns={2} />
          {content.principles.details ? (
            <RichParagraphs
              source={content.principles.details}
              className="mt-14 max-w-3xl space-y-5 text-lead text-pretty text-muted-foreground"
            />
          ) : (
            <PendingContent item="communityProtocols" className="mt-14" />
          )}
        </Container>
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
