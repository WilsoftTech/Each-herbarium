import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { Statement } from "@/components/sections/statement";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { ArrowRightIcon } from "@/components/ui/icons";
import { KeyFacts } from "@/components/ui/key-facts";
import { MediaCard } from "@/components/ui/media-card";
import { PendingContent } from "@/components/ui/pending-content";
import { RichParagraphs } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { listPartners, PartnerList } from "@/features/partners";
import { listTeamMembers, teamGroupLabel, teamGroupSchema, TeamList } from "@/features/team";
import type { LandingPage } from "../../schema";
import { MarkedHeading, NextLink, withImages } from "./parts";

const aboutTrail = [{ label: "About EACH", href: "/about" }];

export function AboutView({ landing }: { landing: LandingPage<"about"> }) {
  const { page, content, images } = landing;
  const { facts } = content;
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "About EACH", href: "/about" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        image={page.image ?? undefined}
      />

      <Statement
        id="purpose"
        eyebrow={content.purpose.eyebrow}
        text={content.purpose.text}
        action={content.purpose.action}
      />

      <Section aria-labelledby="facts-title">
        <Reveal>
          <Container className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="facts-title"
                eyebrow={facts.eyebrow}
                title={facts.title}
                description={facts.description}
              />
            </div>
            <div data-reveal className="lg:col-span-7">
              <KeyFacts
                facts={[
                  // The protected brand (AGENTS.md §4): never edited in the CMS.
                  { term: "Name", value: siteConfig.name },
                  { term: "Short name", value: siteConfig.shortName },
                  { term: "Focus", value: facts.focus },
                  { term: "Where we begin", value: facts.start },
                  { term: "Region", value: facts.region },
                  { term: "Independent partner", value: facts.partner },
                  {
                    term: "Legal status",
                    value: facts.legalStatus || (
                      <PendingContent item="organisation" variant="badge" />
                    ),
                  },
                  {
                    term: "Founded",
                    value: facts.founded || <PendingContent item="history" variant="badge" />,
                  },
                  {
                    term: "Photography",
                    value: facts.photographyMarker ? (
                      <span className="flex flex-col items-start gap-2">
                        {facts.photography}
                        <PendingContent item="photography" variant="badge" />
                      </span>
                    ) : (
                      facts.photography
                    ),
                  },
                ]}
              />
              {facts.history ? (
                <RichParagraphs
                  source={facts.history}
                  className="mt-10 space-y-5 text-lead text-pretty text-muted-foreground"
                />
              ) : (
                <PendingContent item="history" className="mt-10" />
              )}
            </div>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="explore-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="explore-title"
              eyebrow={content.explore.eyebrow}
              title={content.explore.title}
            />
            <Grid columns={3} className="mt-14">
              {withImages(content.explore.cards, images).map((card) => (
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

export function MissionView({ landing }: { landing: LandingPage<"about-mission"> }) {
  const { page, content, images } = landing;
  const photograph = images[content.photograph.imageId];
  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={aboutTrail}
            current={{ label: "Mission and values", href: "/about/mission" }}
          />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={content.statement.marker ? <PendingContent item="missionStatement" /> : undefined}
      />

      {photograph ? <FullBleedImage image={photograph} height="medium" /> : null}

      <Section aria-labelledby="principles-title">
        <Reveal>
          <Container>
            <MarkedHeading
              id="principles-title"
              heading={content.principles}
              marker={
                content.principles.marker ? (
                  <PendingContent
                    item="values"
                    variant="badge"
                    className="self-start md:self-end"
                  />
                ) : null
              }
            />
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={content.principles.items} columns={3} />
        </Container>
      </Section>

      <NextLink next={content.next} />
    </>
  );
}

/** Published team members, for the leadership page. */
export async function leadershipData() {
  return { members: await listTeamMembers() };
}

export function LeadershipView({
  landing,
  members,
}: { landing: LandingPage<"about-leadership"> } & Awaited<ReturnType<typeof leadershipData>>) {
  const { page, content } = landing;
  const groups = teamGroupSchema.options
    .map((group) => ({ group, members: members.filter((member) => member.group === group) }))
    .filter((entry) => entry.members.length);

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={aboutTrail}
            current={{ label: "Leadership", href: "/about/leadership" }}
          />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
      />

      {groups.map(({ group, members: groupMembers }) => (
        <Section key={group} aria-labelledby={`team-${group}-title`}>
          <Reveal>
            <Container>
              <SectionHeading id={`team-${group}-title`} title={teamGroupLabel[group]} />
              <div className="mt-12">
                <TeamList members={groupMembers} />
              </div>
            </Container>
          </Reveal>
        </Section>
      ))}

      {groups.length ? null : (
        <Section surface="muted" aria-labelledby="leadership-pending-title">
          <Reveal>
            <Container className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHeading
                  id="leadership-pending-title"
                  eyebrow={content.upcoming.eyebrow}
                  title={content.upcoming.title}
                />
                <ul data-reveal className="mt-8 space-y-4 text-lead text-muted-foreground">
                  {content.upcoming.items.map((item) => (
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
      )}

      <NextLink next={content.next} />
    </>
  );
}

/** Published partners, for the partners page. */
export async function partnersData() {
  return { partners: await listPartners() };
}

export function PartnersView({
  landing,
  partners,
}: { landing: LandingPage<"about-partners"> } & Awaited<ReturnType<typeof partnersData>>) {
  const { page, content } = landing;

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={aboutTrail}
            current={{ label: "Partners", href: "/about/partners" }}
          />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
      />

      <Section aria-labelledby="confirmed-title" className="pt-0">
        <Reveal>
          <Container>
            <SectionHeading
              id="confirmed-title"
              eyebrow={content.partners.eyebrow}
              title={content.partners.title}
            />
            <div className="mt-12">
              <PartnerList partners={partners} />
            </div>
            {content.partners.marker ? <PendingContent item="partners" className="mt-12" /> : null}
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="partner-cta-title">
        <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            id="partner-cta-title"
            eyebrow={content.invitation.eyebrow}
            title={content.invitation.title}
            description={content.invitation.description}
          />
          <Button asChild size="lg" className="self-start md:self-end">
            <Link href={content.invitation.action.href}>
              {content.invitation.action.label}
              <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
