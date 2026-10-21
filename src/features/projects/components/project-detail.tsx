import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { Hero } from "@/components/sections/hero";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { SplitFeature } from "@/components/sections/split-feature";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { KeyFacts } from "@/components/ui/key-facts";
import { PendingContent } from "@/components/ui/pending-content";
import { Notice } from "@/components/ui/notice";
import { RichText } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { projectStatusLabel, type Project } from "../schema";

type ProjectDetailProps = {
  project: Project;
  /** The next case study, for the closing link. Omitted in previews. */
  next?: Pick<Project, "slug" | "title" | "summary">;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const formatMonth = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));

/** The period as written by EACH, or derived from the confirmed dates. */
function periodOf(project: Project): string | null {
  if (project.period) return project.period;
  if (project.startDate && project.endDate) {
    return `${formatMonth(project.startDate)} to ${formatMonth(project.endDate)}`;
  }
  if (project.startDate) return `From ${formatMonth(project.startDate)}`;
  return null;
}

/** Objectives, activities, verified outcomes and references, as written in the CMS. */
function ProjectLists({ project }: { project: Project }) {
  const lists = [
    { title: "Objectives", items: project.objectives },
    {
      title: project.operationalStatus === "planned" ? "Planned activities" : "Activities",
      items: project.activities,
    },
    { title: "Verified outcomes", items: project.outcomes },
  ].filter((list) => list.items.length);
  if (!lists.length && !project.references.length) return null;

  return (
    <Section surface="muted" aria-labelledby="details-title">
      <Reveal>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              id="details-title"
              eyebrow="The project"
              title={
                project.operationalStatus === "planned"
                  ? "Objectives and next steps"
                  : "Aims and results"
              }
            />
          </div>
          <div data-reveal className="space-y-10 lg:col-span-7 lg:col-start-6">
            {lists.map((list) => (
              <div key={list.title}>
                <h3 className="font-display text-heading">{list.title}</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-muted-foreground">
                  {list.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {project.references.length ? (
              <div>
                <h3 className="font-display text-heading">References</h3>
                <RichText
                  className="mt-4"
                  source={project.references.map((reference) => `- ${reference}`).join("\n")}
                />
              </div>
            ) : null}
          </div>
        </Container>
      </Reveal>
    </Section>
  );
}

/** The case-study page body. Rendered by the public route and by the admin preview. */
export function ProjectDetail({ project, next }: ProjectDetailProps) {
  const [landscapeImage, interludeImage] = project.gallery;
  const planned = project.operationalStatus === "planned";
  const pending = <PendingContent item="regionalPresence" variant="badge" />;

  return (
    <>
      <Hero
        size="tall"
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Projects", href: "/projects" }]}
            current={{ label: project.title, href: `/projects/${project.slug}` }}
          />
        }
        eyebrow={project.ecosystem}
        title={project.title}
        description={project.summary}
        image={project.image}
        nextSectionId="overview"
      />

      <Section id="overview" aria-labelledby="overview-title">
        <Reveal>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                id="overview-title"
                eyebrow={planned ? "Project plan" : "Case study"}
                title="At a glance"
              />
              {project.status === "placeholder" ? (
                <Notice title="Design reference only" className="mt-10">
                  <p>This sample describes a layout, not an EACH project or achievement.</p>
                </Notice>
              ) : null}
            </div>
            <div data-reveal className="lg:col-span-7 lg:col-start-6">
              <KeyFacts
                facts={[
                  { term: "Landscape", value: project.ecosystem },
                  { term: "Location", value: project.location ?? pending },
                  { term: "Country", value: project.country ?? pending },
                  {
                    term: "Status",
                    value: project.operationalStatus
                      ? projectStatusLabel[project.operationalStatus]
                      : "Not specified",
                  },
                  { term: "Period", value: periodOf(project) ?? "Schedule not announced" },
                  {
                    term: "Programmes",
                    value: project.programmes.length ? (
                      <ul className="space-y-1">
                        {project.programmes.map((programme) => (
                          <li key={programme.slug}>
                            <Link
                              href={programme.href}
                              className="rounded-sm text-primary underline-offset-4 hover:underline"
                            >
                              {programme.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "Not assigned"
                    ),
                  },
                  {
                    term: "Partners",
                    value: project.partners.length
                      ? project.partners.join(", ")
                      : "No project partners announced",
                  },
                  {
                    term: "Outcomes",
                    value: project.outcomes.length
                      ? "Listed under Aims and results"
                      : planned
                        ? "No results: this project is planned"
                        : "No verified results published",
                  },
                ]}
              />
            </div>
          </Container>
        </Reveal>
      </Section>

      {landscapeImage ? (
        <Section surface="muted" aria-labelledby="landscape-title">
          <SplitFeature
            eyebrow="The landscape"
            title={project.landscape.heading}
            titleId="landscape-title"
            image={landscapeImage}
            aspect="portrait"
          >
            {project.landscape.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SplitFeature>
        </Section>
      ) : null}

      {interludeImage ? <FullBleedImage image={interludeImage} height="medium" /> : null}

      <Section aria-labelledby="story-title">
        <Reveal>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                id="story-title"
                eyebrow="The project"
                title={planned ? "Planned approach" : "What happened"}
              />
            </div>
            <div data-reveal className="space-y-12 lg:col-span-7 lg:col-start-6">
              {project.story.length ? (
                project.story.map((part) => (
                  <div key={part.heading}>
                    <h3 className="font-display text-heading">{part.heading}</h3>
                    <div className="mt-4 space-y-4 leading-8 text-muted-foreground">
                      {part.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="leading-8 text-muted-foreground">
                  No project activity report is presented here.
                </p>
              )}
            </div>
          </Container>
        </Reveal>
      </Section>

      <ProjectLists project={project} />

      {next ? (
        <SequenceNav
          label="Next project"
          title={next.title}
          href={`/projects/${next.slug}`}
          description={next.summary}
        />
      ) : null}
    </>
  );
}
