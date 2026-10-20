import { Reveal } from "@/components/motion/reveal";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("impact");
}

// Proposed measures (pending: `impactFigures`). No values until EACH supplies verified figures.
const measures = [
  "Plant species documented",
  "Herbarium specimens prepared",
  "Area of habitat under conservation",
  "Community knowledge holders taking part, with consent",
  "People trained",
  "Resources published",
] as const;

const reporting = [
  {
    title: "Verified before published",
    body: "Each figure is checked and shown with its source and the method used to produce it.",
  },
  {
    title: "Dated",
    body: "Every figure states the period it covers, so progress can be compared over time.",
  },
  {
    title: "Honest about limits",
    body: "Uncertainty and gaps in the data are stated, not hidden.",
  },
] as const;

export default async function ImpactPage() {
  const page = await loadManagedPage("impact");
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Impact", href: "/impact" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
      />

      <Section surface="dark" aria-labelledby="measures-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="measures-title"
                eyebrow="Proposed measures"
                title="What we intend to measure"
              />
              <PendingContent
                item="impactFigures"
                variant="badge"
                className="self-start md:self-end"
              />
            </div>
            <dl className="mt-16 grid gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-2 lg:grid-cols-3">
              {measures.map((measure) => (
                <div key={measure} data-reveal className="flex flex-col bg-background p-8">
                  <dt className="leading-7">{measure}</dt>
                  <dd className="mt-6 font-display text-display-lg font-light text-muted-foreground">
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Not yet published</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </Reveal>
      </Section>

      <Section aria-labelledby="reporting-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="reporting-title"
              eyebrow="Reporting"
              title="How results will be reported"
            />
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={reporting} columns={3} />
          <PendingContent item="impactFigures" className="mt-14" />
        </Container>
      </Section>

      <SequenceNav
        label="Projects & Impact"
        title="Conservation projects"
        href="/projects"
        description="Case studies from the field."
      />
    </>
  );
}
