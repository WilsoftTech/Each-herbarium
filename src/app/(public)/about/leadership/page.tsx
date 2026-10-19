import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Leadership",
  description: "The people who lead and govern EACH. Profiles will be published once confirmed.",
  path: "/about/leadership",
  noindex: true,
});

const willInclude = [
  "Leadership team: names, roles and short biographies",
  "Board, trustees or advisers, if EACH has them",
  "Scientific and community advisers",
  "How EACH is governed and accountable",
] as const;

export default function LeadershipPage() {
  const trail = [{ label: "About EACH", href: "/about" }];

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs trail={trail} current={{ label: "Leadership", href: "/about/leadership" }} />
        }
        eyebrow="Leadership"
        title="The people behind EACH"
        lead={
          <p>
            Profiles of EACH&apos;s leadership will be published here once they are confirmed and
            each person has agreed to appear.
          </p>
        }
      />

      <Section surface="muted" aria-labelledby="leadership-pending-title">
        <Reveal>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="leadership-pending-title"
                eyebrow="Coming soon"
                title="What this page will show"
              />
              <ul data-reveal className="mt-8 space-y-4 text-lead text-muted-foreground">
                {willInclude.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden="true" className="mt-3 h-px w-6 shrink-0 bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="lg:col-span-6 lg:col-start-7">
              <PendingContent item="leadership" />
            </div>
          </Container>
        </Reveal>
      </Section>

      <SequenceNav
        label="Next in About EACH"
        title="Partners"
        href="/about/partners"
        description="The organisations EACH works alongside."
      />
    </>
  );
}
