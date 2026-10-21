import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ActionPanels } from "@/components/sections/action-panels";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { BotanicalIllustration } from "@/components/ui/botanical-illustration";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { KeyFacts } from "@/components/ui/key-facts";
import { MediaCard } from "@/components/ui/media-card";
import { Notice } from "@/components/ui/notice";
import { PendingContent } from "@/components/ui/pending-content";
import { RichParagraphs } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSiteSettings } from "@/features/settings";
import type { LandingPage } from "../../schema";
import { MarkedHeading, NextLink, withImages } from "./parts";

const involvedTrail = [{ label: "Get involved", href: "/get-involved" }];
const markerClass = "self-start md:self-end";
const textClass = "space-y-5 text-lead text-pretty text-muted-foreground";
const linkClass = "text-primary underline underline-offset-4";

export function GetInvolvedView({ landing }: { landing: LandingPage<"get-involved"> }) {
  const { page, content, images } = landing;
  return (
    <>
      <PageHeader
        surface="dark"
        breadcrumbs={<Breadcrumbs current={{ label: "Get involved", href: "/get-involved" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={
          // Describes website forms that arrive with the code (M05).
          <Notice title="Online forms are not available yet">
            <p>Sign-up and enquiry forms will be added soon. Each page explains what to expect.</p>
          </Notice>
        }
      />

      <Section surface="dark" aria-label="Ways to take part" className="pt-0">
        <Reveal>
          <Container>
            <ActionPanels headingLevel="h2" panels={withImages(content.ways.panels, images)} />
          </Container>
        </Reveal>
      </Section>
    </>
  );
}

export function VolunteerView({ landing }: { landing: LandingPage<"volunteer"> }) {
  const { page, content } = landing;
  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs trail={involvedTrail} current={{ label: "Volunteer", href: "/volunteer" }} />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        image={page.image ?? undefined}
      />

      <Section aria-labelledby="areas-title">
        <Reveal>
          <Container>
            <MarkedHeading
              id="areas-title"
              heading={content.areas}
              marker={
                content.areas.marker ? (
                  <PendingContent item="volunteerRoles" variant="badge" className={markerClass} />
                ) : null
              }
            />
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={content.areas.items} columns={2} />
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="next-title" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="next-title"
              eyebrow={content.steps.eyebrow}
              title={content.steps.title}
            />
          </div>
          <div className="space-y-6 lg:col-span-7">
            <Notice title="The volunteer form is not available yet">
              <p>
                An online form will be added soon. Until then, see the{" "}
                <Link href="/contact" className={linkClass}>
                  contact page
                </Link>
                .
              </p>
            </Notice>
            {content.steps.text ? (
              <RichParagraphs source={content.steps.text} className={textClass} />
            ) : (
              <PendingContent item="volunteerRoles" />
            )}
          </div>
        </Container>
      </Section>

      <NextLink next={content.next} />
    </>
  );
}

export function PartnershipsView({ landing }: { landing: LandingPage<"partnerships"> }) {
  const { page, content } = landing;
  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={involvedTrail}
            current={{ label: "Partnerships", href: "/partnerships" }}
          />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        image={page.image ?? undefined}
      />

      <Section aria-labelledby="types-title">
        <Reveal>
          <Container>
            <MarkedHeading
              id="types-title"
              heading={content.types}
              marker={
                content.types.marker ? (
                  <PendingContent item="partnershipModel" variant="badge" className={markerClass} />
                ) : null
              }
            />
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={content.types.items} columns={2} />
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="approach-title" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="approach-title"
              eyebrow={content.steps.eyebrow}
              title={content.steps.title}
            />
          </div>
          <div className="space-y-6 lg:col-span-7">
            <Notice title="The partnership enquiry form is not available yet">
              <p>
                An online form will be added soon. Until then, see the{" "}
                <Link href="/contact" className={linkClass}>
                  contact page
                </Link>
                , or read about our{" "}
                <Link href="/about/partners" className={linkClass}>
                  current partners
                </Link>
                .
              </p>
            </Notice>
            {content.steps.text ? (
              <RichParagraphs source={content.steps.text} className={textClass} />
            ) : (
              <PendingContent item="partnershipModel" />
            )}
          </div>
        </Container>
      </Section>

      <NextLink next={content.next} />
    </>
  );
}

/**
 * Bitwiire is an independent partner, so the page uses the warm partner
 * surface and original illustrations rather than EACH's palette and
 * photography, and describes Bitwiire only in confirmed terms. The statement
 * that the two organisations are independent is fixed in code (AGENTS.md §1).
 */
export function BitwiireView({ landing }: { landing: LandingPage<"bitwiire-herbarium-cafe"> }) {
  const { page, content } = landing;
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
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={
          <KeyFacts
            columns={1}
            facts={[
              { term: "Relationship to EACH", value: "Independent partner" },
              {
                term: "Location",
                value: content.facts.location || (
                  <PendingContent item="regionalPresence" variant="badge" />
                ),
              },
              { term: "Opening hours", value: content.facts.hours || pending },
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
                eyebrow={content.profile.eyebrow}
                title={content.profile.title}
                description={content.profile.description}
              />
            </div>
            <div data-reveal className="lg:col-span-6 lg:col-start-7">
              {content.profile.text ? (
                <RichParagraphs source={content.profile.text} className={textClass} />
              ) : (
                <PendingContent item="bitwiireProfile" />
              )}
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

      <NextLink next={content.next} />
    </>
  );
}

/** Contact details from the site settings, for the contact page. */
export async function contactData() {
  return { settings: await getSiteSettings() };
}

export function ContactView({
  landing,
  settings,
}: { landing: LandingPage<"contact"> } & Awaited<ReturnType<typeof contactData>>) {
  const { page, content, images } = landing;
  const pending = <PendingContent item="contactDetails" variant="badge" />;
  const complete = Boolean(
    settings.contactEmail && settings.phone && settings.postalAddress && settings.officeHours,
  );

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs trail={involvedTrail} current={{ label: "Contact", href: "/contact" }} />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={
          // Describes the website form that arrives with the code (M05).
          <Notice title="The contact form is not available yet">
            <p>An online contact form will be added soon.</p>
          </Notice>
        }
      />

      <Section aria-labelledby="details-title" className="pt-0">
        <Reveal>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                id="details-title"
                eyebrow={content.details.eyebrow}
                title={content.details.title}
              />
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
              eyebrow={content.related.eyebrow}
              title={content.related.title}
            />
            <Grid columns={3} className="mt-14">
              {withImages(content.related.cards, images).map((card) => (
                <MediaCard
                  key={card.href}
                  href={card.href}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  description={card.description}
                  image={card.image}
                  aspect="landscape"
                />
              ))}
            </Grid>
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
