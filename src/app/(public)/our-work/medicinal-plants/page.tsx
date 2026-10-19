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
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { nextProgramme, programmeBySlug } from "@/content/programmes";
import { referenceSpecimens } from "@/content/specimens";
import { pageMetadata } from "@/lib/metadata";

const programme = programmeBySlug("medicinal-plants");

export const metadata = pageMetadata({
  title: "Medicinal plants",
  description:
    "How EACH approaches East Africa's medicinal plants: accurate identification, cultural context, consent and conservation. Not medical advice.",
  path: programme.href,
  image: programme.image,
});

// Draft approach for expert review (pending: `medicinalReview`).
const approach = [
  {
    title: "Identify the plant precisely",
    body: "Common names vary between languages and places. A scientific name, backed by a herbarium voucher specimen, makes clear which plant is meant.",
  },
  {
    title: "Record use in its context",
    body: "A traditional use is documented as what a community does and knows, with who, where and how. It is not presented as a proven treatment.",
  },
  {
    title: "Ask before recording",
    body: "Knowledge of medicinal plants is recorded only with the consent of the people who hold it, and credited to them.",
  },
  {
    title: "Keep wild plants for the future",
    body: "Harvesting bark, roots or whole plants can threaten wild populations, so conservation status is part of every record.",
  },
] as const;

const voucher = referenceSpecimens[0];

export default function MedicinalPlantsPage() {
  const next = nextProgramme(programme.slug);

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
        title="Medicinal plants, in their scientific and cultural context"
        lead={<p>{programme.intro}</p>}
        aside={
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
          eyebrow="An example"
          title="Uganda greenheart"
          titleId="example-title"
          image={programme.image}
          aspect="landscape"
        >
          <p>
            <i>Warburgia ugandensis</i> is a tree of East African forests and woodlands. Its bark
            and leaves are widely used in traditional medicine in the region, which is one reason
            the tree is harvested from the wild.
          </p>
          <p>
            Recording a plant like this responsibly means naming it precisely, documenting how and
            by whom it is used, and noting the pressure that harvesting places on it.
          </p>
        </SplitFeature>
      </Section>

      <Section aria-labelledby="approach-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="approach-title"
                eyebrow="Our approach"
                title="Responsible plant knowledge"
              />
              <PendingContent
                item="medicinalReview"
                variant="badge"
                className="self-start md:self-end"
              />
            </div>
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={approach} columns={2} />
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="context-title">
        <Reveal>
          <Container className="grid gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <SectionHeading
                id="context-title"
                eyebrow="Scientific context"
                title="Why a specimen matters"
                description="A voucher specimen is a pressed, labelled sample of the exact plant that was studied or described. Anyone can return to it to check the identification."
              />
              <p data-reveal className="mt-6 leading-8 text-pretty text-muted-foreground">
                Conservation status matters too. <i>Prunus africana</i> (African cherry), whose bark
                is harvested for international trade, is listed in Appendix II of CITES, the
                convention that regulates international trade in threatened species.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-8">
              <SpecimenSheet specimen={voucher} />
            </div>
          </Container>
        </Reveal>
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
