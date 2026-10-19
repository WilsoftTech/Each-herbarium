import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { KeyFacts } from "@/components/ui/key-facts";
import { MediaCard } from "@/components/ui/media-card";
import { Notice } from "@/components/ui/notice";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "How to contact EACH. Contact details will be published once confirmed.",
  path: "/contact",
});

export default function ContactPage() {
  const pending = <PendingContent item="contactDetails" variant="badge" />;

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Get involved", href: "/get-involved" }]}
            current={{ label: "Contact", href: "/contact" }}
          />
        }
        eyebrow="Contact"
        title="Get in touch"
        lead={<p>Questions, ideas and offers of help are all welcome.</p>}
        aside={
          <Notice title="The contact form is not available yet">
            <p>An online contact form will be added soon.</p>
          </Notice>
        }
      />

      <Section aria-labelledby="details-title" className="pt-0">
        <Reveal>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading id="details-title" eyebrow="Details" title="Contact details" />
            </div>
            <div data-reveal className="space-y-10 lg:col-span-8">
              <KeyFacts
                facts={[
                  { term: "Email", value: pending },
                  { term: "Telephone", value: pending },
                  { term: "Address", value: pending },
                  { term: "Office hours", value: pending },
                ]}
              />
              <PendingContent item="contactDetails" />
            </div>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="looking-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="looking-title"
              eyebrow="Looking for something?"
              title="You may also want"
            />
            <Grid columns={3} className="mt-14">
              <MediaCard
                href="/volunteer"
                eyebrow="Get involved"
                title="Volunteer"
                description="Ways volunteers may contribute."
                image={media.budongoTree}
                aspect="landscape"
              />
              <MediaCard
                href="/partnerships"
                eyebrow="Get involved"
                title="Partnerships"
                description="Working with EACH as an organisation."
                image={media.kidepoEuphorbia}
                aspect="landscape"
              />
              <MediaCard
                href="/accessibility"
                eyebrow="Help"
                title="Accessibility"
                description="How this site is built to be usable by everyone."
                image={media.mabiraStream}
                aspect="landscape"
              />
            </Grid>
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
