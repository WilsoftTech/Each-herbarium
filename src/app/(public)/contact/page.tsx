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
import { getSiteSettings } from "@/features/settings";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("contact");
}

export default async function ContactPage() {
  const page = await loadManagedPage("contact");
  const settings = await getSiteSettings();
  const pending = <PendingContent item="contactDetails" variant="badge" />;
  const complete = Boolean(
    settings.contactEmail && settings.phone && settings.postalAddress && settings.officeHours,
  );

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Get involved", href: "/get-involved" }]}
            current={{ label: "Contact", href: "/contact" }}
          />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
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
                  {
                    term: "Email",
                    value: settings.contactEmail ? (
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="rounded-sm text-primary underline underline-offset-4"
                      >
                        {settings.contactEmail}
                      </a>
                    ) : (
                      pending
                    ),
                  },
                  { term: "Telephone", value: settings.phone ?? pending },
                  {
                    term: "Address",
                    value: settings.postalAddress ? (
                      <span className="whitespace-pre-line">{settings.postalAddress}</span>
                    ) : (
                      pending
                    ),
                  },
                  ...(settings.locationText
                    ? [{ term: "Location", value: settings.locationText }]
                    : []),
                  { term: "Office hours", value: settings.officeHours ?? pending },
                ]}
              />
              {complete ? null : <PendingContent item="contactDetails" />}
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
