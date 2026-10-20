import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Hero } from "@/components/sections/hero";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SpecimenSheet } from "@/components/sections/specimen-sheet";
import { SplitFeature } from "@/components/sections/split-feature";
import { BotanicalIllustration } from "@/components/ui/botanical-illustration";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { ArrowRightIcon } from "@/components/ui/icons";
import { KeyFacts } from "@/components/ui/key-facts";
import { MediaCard } from "@/components/ui/media-card";
import { Notice } from "@/components/ui/notice";
import { PendingContent } from "@/components/ui/pending-content";
import { RichParagraphs } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { referenceSpecimens } from "@/content/specimens";
import { listProgrammes } from "@/features/programmes";
import { listProjects, ProjectCards, ProjectLocation } from "@/features/projects";
import { DownloadList, listDownloads, listResources, ResourceList } from "@/features/resources";
import { cn } from "@/lib/utils";
import type { LandingPage } from "../../schema";
import { MarkedHeading, NextLink } from "./parts";

const markerClass = "self-start md:self-end";

/** Published programmes and projects, for the our-work page. */
export async function ourWorkData() {
  const [programmes, projects] = await Promise.all([listProgrammes(), listProjects()]);
  return { programmes, projects };
}

export function OurWorkView({
  landing,
  programmes,
  projects,
}: { landing: LandingPage<"our-work"> } & Awaited<ReturnType<typeof ourWorkData>>) {
  const { page, content } = landing;

  return (
    <>
      <Hero
        size="tall"
        breadcrumbs={<Breadcrumbs current={{ label: "Our work", href: "/our-work" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.lead}
        image={page.image ?? media.rwenzoriGroundselValley}
        focus="50% 60%"
        nextSectionId="programmes"
      />

      <Section id="programmes" aria-labelledby="programmes-title">
        <Reveal>
          <Container>
            <MarkedHeading
              id="programmes-title"
              heading={content.programmes}
              marker={
                content.programmes.marker ? (
                  <PendingContent item="programmeDetails" variant="badge" className={markerClass} />
                ) : null
              }
            />
            <Grid columns={2} className="mt-16">
              {programmes.map((programme, index) => (
                <MediaCard
                  key={programme.slug}
                  href={programme.href}
                  eyebrow={String(index + 1).padStart(2, "0")}
                  title={programme.title}
                  description={programme.summary}
                  image={programme.image}
                  aspect="landscape"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              ))}
            </Grid>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="projects-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="projects-title"
              eyebrow={content.projects.eyebrow}
              title={content.projects.title}
              description={content.projects.description}
            />
            <ProjectCards projects={projects} className="mt-16" />
          </Container>
        </Reveal>
      </Section>

      <NextLink next={content.next} />
    </>
  );
}

export function HerbariumView({ landing }: { landing: LandingPage<"herbarium"> }) {
  const { page, content } = landing;
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "The herbarium", href: "/herbarium" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={
          // Describes a website feature that does not exist yet, so it changes with the code.
          <Notice title="No online specimen catalogue yet">
            <p>
              EACH does not yet offer a searchable specimen database. The status of its collection
              will be published here once confirmed.
            </p>
            {content.status.text ? null : <PendingContent item="herbariumStatus" variant="badge" />}
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
                  eyebrow={content.specimens.eyebrow}
                  title={content.specimens.title}
                  description={content.specimens.description}
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
              eyebrow={content.process.eyebrow}
              title={content.process.title}
              description={content.process.description}
            />
          </Container>
        </Reveal>
        <Container className="relative mt-16">
          <NumberedList items={content.process.items} columns={3} />
        </Container>
      </Section>

      <Section aria-labelledby="uses-title">
        <Reveal>
          <Container className="grid gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <SectionHeading
                id="uses-title"
                eyebrow={content.uses.eyebrow}
                title={content.uses.title}
              />
              <ul data-reveal className="mt-10 border-b border-border">
                {content.uses.items.map((use) => (
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
              eyebrow={content.status.eyebrow}
              title={content.status.title}
            />
          </div>
          <div className="lg:col-span-7">
            {content.status.text ? (
              <RichParagraphs
                source={content.status.text}
                className="space-y-5 text-lead text-pretty text-muted-foreground"
              />
            ) : (
              <PendingContent item="herbariumStatus" />
            )}
          </div>
        </Container>
      </Section>

      <NextLink next={content.next} />
    </>
  );
}

/** Published publications, for the research page. */
export async function researchData() {
  return {
    publications: (await listResources()).filter((item) => item.type === "publication"),
  };
}

export function ResearchView({
  landing,
  publications,
}: { landing: LandingPage<"research"> } & Awaited<ReturnType<typeof researchData>>) {
  const { page, content } = landing;

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Research", href: "/research" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        aside={
          <KeyFacts
            columns={1}
            facts={[
              {
                term: "Research partners",
                value: content.facts.partners || (
                  <PendingContent item="researchThemes" variant="badge" />
                ),
              },
              {
                term: "Publications",
                value: content.facts.publications || (
                  <PendingContent item="resources" variant="badge" />
                ),
              },
            ]}
          />
        }
      />

      <Section aria-labelledby="themes-title" className="pt-0">
        <Reveal>
          <Container>
            <MarkedHeading
              id="themes-title"
              heading={content.themes}
              className="border-t border-foreground pt-10"
              marker={
                content.themes.marker ? (
                  <PendingContent item="researchThemes" variant="badge" className={markerClass} />
                ) : null
              }
            />
            <ol className="mt-12">
              {content.themes.items.map((theme, index) => (
                <li
                  key={theme.title}
                  data-reveal
                  className="grid gap-4 border-t border-border py-8 md:grid-cols-12 md:gap-8"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-display-md font-light text-primary tabular-nums md:col-span-2"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-display-md font-light text-balance md:col-span-5">
                    {theme.title}
                  </h3>
                  <p className="text-lead text-pretty text-muted-foreground md:col-span-5">
                    {theme.body}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="publications-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="publications-title"
                eyebrow={content.publications.eyebrow}
                title={content.publications.title}
                description={content.publications.description}
              />
              <Link
                href="/resources"
                data-reveal
                className="group/link inline-flex shrink-0 items-center gap-2 rounded-sm font-medium text-primary"
              >
                <span className="underline-offset-4 group-hover/link:underline">
                  {content.publications.linkLabel}
                </span>
                <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/link:translate-x-1" />
              </Link>
            </div>
            <ResourceList resources={publications} className="mt-12" />
          </Container>
        </Reveal>
      </Section>

      <Section aria-labelledby="collaborate-title" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="collaborate-title"
              eyebrow={content.collaborate.eyebrow}
              title={content.collaborate.title}
              description={content.collaborate.description}
            />
          </div>
          <div className="lg:col-span-7">
            {content.collaborate.text ? (
              <RichParagraphs
                source={content.collaborate.text}
                className="space-y-5 text-lead text-pretty text-muted-foreground"
              />
            ) : (
              <PendingContent item="researchThemes" />
            )}
          </div>
        </Container>
      </Section>

      <NextLink next={content.next} />
    </>
  );
}

export function ImpactView({ landing }: { landing: LandingPage<"impact"> }) {
  const { page, content } = landing;
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
            <MarkedHeading
              id="measures-title"
              heading={content.measures}
              marker={
                content.measures.marker ? (
                  <PendingContent item="impactFigures" variant="badge" className={markerClass} />
                ) : null
              }
            />
            {/* No figure is shown until it is verified, with its source and method. */}
            <dl className="mt-16 grid gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-2 lg:grid-cols-3">
              {content.measures.items.map((measure) => (
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
              eyebrow={content.reporting.eyebrow}
              title={content.reporting.title}
            />
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={content.reporting.items} columns={3} />
          {content.reporting.text ? (
            <RichParagraphs
              source={content.reporting.text}
              className="mt-14 max-w-3xl space-y-5 text-lead text-pretty text-muted-foreground"
            />
          ) : (
            <PendingContent item="impactFigures" className="mt-14" />
          )}
        </Container>
      </Section>

      <NextLink next={content.next} />
    </>
  );
}

/** Published projects, for the projects page. */
export async function projectsData() {
  return { projects: await listProjects() };
}

export function ProjectsView({
  landing,
  projects,
}: { landing: LandingPage<"projects"> } & Awaited<ReturnType<typeof projectsData>>) {
  const { page, content } = landing;
  const showsPlaceholders = projects.some((project) => project.status === "placeholder");

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Projects", href: "/projects" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={
          <p>
            {page.lead}
            {showsPlaceholders
              ? " The case studies below are placeholders that show the format; they do not describe EACH projects."
              : null}
          </p>
        }
        aside={showsPlaceholders || !projects.length ? <PendingContent item="projects" /> : null}
      />

      {projects.map((project, index) => (
        <Section
          key={project.slug}
          surface={index % 2 ? "muted" : "light"}
          aria-labelledby={`project-${project.slug}`}
          spacing="compact"
        >
          <SplitFeature
            eyebrow={<ProjectLocation project={project} />}
            title={project.title}
            titleId={`project-${project.slug}`}
            image={project.image}
            aspect="landscape"
            reverse={index % 2 === 1}
            action={{ label: "View case study", href: `/projects/${project.slug}` }}
          >
            <p>{project.summary}</p>
            {project.status === "placeholder" ? (
              <PendingContent item="projects" variant="badge" />
            ) : null}
          </SplitFeature>
        </Section>
      ))}

      <Section aria-label="Impact" spacing="compact">
        <Reveal>
          <Container>
            <div data-reveal className="max-w-2xl text-lead text-pretty text-muted-foreground">
              <RichParagraphs source={content.closing.text} className="space-y-5" />
            </div>
          </Container>
        </Reveal>
      </Section>
    </>
  );
}

/** Published articles and downloads, for the resources page. */
export async function resourcesData() {
  const [resources, downloads] = await Promise.all([listResources(), listDownloads()]);
  return { resources, downloads };
}

export function ResourcesView({
  landing,
  resources,
  downloads,
}: { landing: LandingPage<"resources"> } & Awaited<ReturnType<typeof resourcesData>>) {
  const { page, content } = landing;
  const showsPlaceholders = [...resources, ...downloads].some(
    (item) => item.status === "placeholder",
  );

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Resources", href: "/resources" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={
          <p>
            {page.lead}
            {showsPlaceholders
              ? " The entries below are placeholders that show how resources will be presented."
              : null}
          </p>
        }
        aside={showsPlaceholders || !resources.length ? <PendingContent item="resources" /> : null}
      />

      <Section aria-label="All resources" className="pt-0">
        <Reveal>
          <Container>
            <ResourceList resources={resources} headingLevel="h2" />
          </Container>
        </Reveal>
      </Section>

      {downloads.length ? (
        <Section surface="muted" aria-labelledby="downloads-title">
          <Reveal>
            <Container>
              <SectionHeading
                id="downloads-title"
                eyebrow={content.downloads.eyebrow}
                title={content.downloads.title}
              />
              <DownloadList downloads={downloads} className="mt-12" />
            </Container>
          </Reveal>
        </Section>
      ) : null}
    </>
  );
}
