import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { BotanicalIllustration } from "@/components/ui/botanical-illustration";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { KeyFacts } from "@/components/ui/key-facts";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Bitwiire Herbarium Cafe",
  description:
    "Bitwiire Herbarium Cafe is an independent partner of EACH. The two are separate organisations.",
  path: "/bitwiire-herbarium-cafe",
});

/**
 * Bitwiire is an independent partner, so the page uses the warm partner
 * surface and original illustrations rather than EACH's palette and
 * photography, and describes Bitwiire only in confirmed terms.
 */
export default function BitwiirePage() {
  const pending = <PendingContent item="bitwiireProfile" variant="badge" />;

  return (
    <>
      <PageHeader
        surface="warm"
        breadcrumbs={
          <Breadcrumbs
            trail={[
              { label: "About EACH", href: "/about" },
              { label: "Partners", href: "/about/partners" },
            ]}
            current={{ label: "Bitwiire Herbarium Cafe", href: "/bitwiire-herbarium-cafe" }}
          />
        }
        eyebrow="Independent partner"
        title="Bitwiire Herbarium Cafe"
        lead={
          <p>
            An independent partner of EACH. Bitwiire Herbarium Cafe and EACH are separate
            organisations: neither owns or runs the other.
          </p>
        }
        aside={
          <KeyFacts
            columns={1}
            facts={[
              { term: "Relationship to EACH", value: "Independent partner" },
              { term: "Location", value: pending },
              { term: "Opening hours", value: pending },
            ]}
          />
        }
        backdrop={
          <>
            <div className="absolute -top-6 right-[8%] hidden w-56 rotate-12 text-primary/20 lg:block">
              <BotanicalIllustration variant="fern" />
            </div>
            <div className="absolute right-[-3rem] bottom-[-6rem] w-48 -rotate-12 text-accent/20 md:w-64">
              <BotanicalIllustration variant="leaf" />
            </div>
          </>
        }
      />

      <Section surface="warm" aria-labelledby="own-words-title" className="border-t border-border">
        <Reveal>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="own-words-title"
                eyebrow="In its own words"
                title="About Bitwiire"
                description="This page will introduce Bitwiire Herbarium Cafe in its own words once Bitwiire has approved a description, along with how to visit."
              />
            </div>
            <div data-reveal className="lg:col-span-6 lg:col-start-7">
              <PendingContent item="bitwiireProfile" />
            </div>
          </Container>
        </Reveal>
      </Section>

      <Section aria-labelledby="independence-title" spacing="compact">
        <Reveal>
          <Container className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="independence-title"
                eyebrow="EACH and Bitwiire"
                title="Two independent organisations"
              />
            </div>
            <div
              data-reveal
              className="space-y-5 text-lead text-pretty text-muted-foreground lg:col-span-7"
            >
              <p>
                EACH is an independent conservation, herbarium and botanical knowledge initiative.
                Bitwiire Herbarium Cafe is a separate organisation. Each is responsible for its own
                work, and neither speaks for the other.
              </p>
            </div>
          </Container>
        </Reveal>
      </Section>

      <SequenceNav
        label="About EACH"
        title="All partners"
        href="/about/partners"
        description="The organisations EACH works alongside."
      />
    </>
  );
}
