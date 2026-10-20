import { Reveal } from "@/components/motion/reveal";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { SpecimenSheet } from "@/components/sections/specimen-sheet";
import { BotanicalIllustration } from "@/components/ui/botanical-illustration";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { referenceSpecimens } from "@/content/specimens";
import { cn } from "@/lib/utils";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("herbarium");
}

// Standard herbarium practice, described in general terms.
const process = [
  {
    title: "Collect",
    body: "A representative piece of the plant is gathered, with flowers or fruit where possible, under the right permits. The collector notes the place, habitat and date.",
  },
  {
    title: "Press and dry",
    body: "The plant is arranged flat between sheets of paper and dried under pressure so its shape and features are preserved.",
  },
  {
    title: "Mount",
    body: "The dried plant is fixed to a sheet of archival card, with loose seeds or fragments kept in a small packet.",
  },
  {
    title: "Label",
    body: "A label records the plant's name, where and when it was collected, by whom, and a collection number.",
  },
  {
    title: "Identify and verify",
    body: "Botanists confirm the identification, and later specialists may annotate the sheet as understanding changes.",
  },
  {
    title: "Store, care and share",
    body: "Sheets are stored in cabinets protected from pests, damp and light, and are increasingly imaged so their data can be shared.",
  },
] as const;

const uses = [
  "Identify plants by comparing them with verified specimens",
  "Map where species grow, and how that has changed over decades",
  "Support conservation assessments of threatened species",
  "Train students, field staff and new botanists",
  "Preserve a record of plant names and knowledge for the future",
] as const;

export default async function HerbariumPage() {
  const page = await loadManagedPage("herbarium");
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "The herbarium", href: "/herbarium" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={
          <Notice title="No online specimen catalogue yet">
            <p>
              EACH does not yet offer a searchable specimen database. The status of its collection
              will be published here once confirmed.
            </p>
            <PendingContent item="herbariumStatus" variant="badge" />
          </Notice>
        }
        backdrop={<div className="absolute inset-0 bg-specimen-grid opacity-60" />}
      />

      <Section aria-labelledby="sheets-title" className="bg-specimen-grid pt-0">
        <Reveal>
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionHeading
                  id="sheets-title"
                  eyebrow="Specimens"
                  title="What a specimen records"
                  description="These sheets were collected in Uganda and are imaged and shared openly by the Royal Botanic Gardens, Kew. Each label is a record that can be checked decades later."
                />
              </div>
              <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
                {referenceSpecimens.map((specimen, index) => (
                  <SpecimenSheet
                    key={specimen.id}
                    specimen={specimen}
                    preload={index === 0}
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 90vw"
                    className={cn(index === 1 && "sm:mt-16", index === 2 && "sm:mt-32")}
                  />
                ))}
              </div>
            </div>
          </Container>
        </Reveal>
      </Section>

      <Section surface="dark" aria-labelledby="process-title" className="overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-10 w-72 text-primary/20 md:w-96"
        >
          <BotanicalIllustration variant="fern" />
        </div>
        <Reveal className="relative">
          <Container>
            <SectionHeading
              id="process-title"
              eyebrow="From field to cabinet"
              title="How a specimen is made"
              description="The same careful steps are followed in herbaria around the world."
            />
          </Container>
        </Reveal>
        <Container className="relative mt-16">
          <NumberedList items={process} columns={3} />
        </Container>
      </Section>

      <Section aria-labelledby="uses-title">
        <Reveal>
          <Container className="grid gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <SectionHeading
                id="uses-title"
                eyebrow="Why herbaria matter"
                title="A record that outlives its collector"
              />
              <ul data-reveal className="mt-10 border-b border-border">
                {uses.map((use) => (
                  <li key={use} className="border-t border-border py-4 text-lead text-pretty">
                    {use}
                  </li>
                ))}
              </ul>
            </div>
            <div
              data-reveal
              className="mx-auto w-full max-w-xs text-primary/60 lg:col-span-4 lg:col-start-9"
            >
              <BotanicalIllustration variant="leaf" />
            </div>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="status-title" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="status-title"
              eyebrow="EACH's herbarium"
              title="Collection status"
            />
          </div>
          <div className="lg:col-span-7">
            <PendingContent item="herbariumStatus" />
          </div>
        </Container>
      </Section>

      <SequenceNav
        label="Herbarium & Research"
        title="Research"
        href="/research"
        description="Botanical study across East African ecosystems."
      />
    </>
  );
}
