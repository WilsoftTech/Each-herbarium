import { Reveal } from "@/components/motion/reveal";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Statement } from "@/components/sections/statement";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { nextProgramme, programmeBySlug } from "@/content/programmes";
import { pageMetadata } from "@/lib/metadata";

const programme = programmeBySlug("indigenous-knowledge");

export const metadata = pageMetadata({
  title: "Indigenous knowledge",
  description:
    "Recording East African communities' knowledge of plants with consent, credit and community control.",
  path: programme.href,
  image: programme.image,
});

// Draft principles for EACH and its community partners to agree (pending: `communityProtocols`).
const principles = [
  {
    title: "Consent comes first",
    body: "Knowledge is recorded only with the free, prior and informed consent of the people who hold it, and they can withdraw it.",
  },
  {
    title: "Credit the custodians",
    body: "Communities and individuals are named as the source of what they share, in the way they choose.",
  },
  {
    title: "Communities decide what is shared",
    body: "Some knowledge is not for publication. Communities decide what may be made public, and what stays private.",
  },
  {
    title: "Benefits are shared",
    body: "When plant knowledge leads to research or other benefits, the people it came from share in them. The Nagoya Protocol under the Convention on Biological Diversity sets out this principle.",
  },
] as const;

export default function IndigenousKnowledgePage() {
  const next = nextProgramme(programme.slug);

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
        title="Knowledge that belongs to its custodians"
        lead={<p>{programme.intro}</p>}
        image={programme.image}
      />

      <Statement
        id="living-knowledge"
        eyebrow="Living knowledge"
        surface="light"
        text="A plant's name in a local language often carries knowledge about where it grows, when it flowers and how it is used."
        detail="That knowledge is passed between generations and changes as landscapes change. Recording it well keeps it in the hands of the people who hold it."
      />

      <Section surface="muted" aria-labelledby="principles-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="principles-title"
                eyebrow="Principles"
                title="How knowledge should be recorded"
              />
              <PendingContent
                item="communityProtocols"
                variant="badge"
                className="self-start md:self-end"
              />
            </div>
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={principles} columns={2} />
          <PendingContent item="communityProtocols" className="mt-14" />
        </Container>
      </Section>

      <SequenceNav
        label="Next programme"
        title={next.title}
        href={next.href}
        description={next.summary}
      />
    </>
  );
}
