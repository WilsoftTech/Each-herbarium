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
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "../schema";

type ProjectDetailProps = {
  project: Project;
  /** The next case study, for the closing link. Omitted in previews. */
  next?: Pick<Project, "slug" | "title" | "summary">;
};

/** The case-study page body. Rendered by the public route and by the admin preview. */
export function ProjectDetail({ project, next }: ProjectDetailProps) {
  const [landscapeImage, interludeImage] = project.gallery;
  const pending = <PendingContent item="projects" variant="badge" />;

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
              <SectionHeading id="overview-title" eyebrow="Case study" title="At a glance" />
              {project.status === "placeholder" ? (
                <PendingContent item="projects" className="mt-10" />
              ) : null}
            </div>
            <div data-reveal className="lg:col-span-7 lg:col-start-6">
              <KeyFacts
                facts={[
                  { term: "Landscape", value: project.ecosystem },
                  { term: "Location", value: project.location ?? pending },
                  { term: "Period", value: project.period ?? pending },
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
                      pending
                    ),
                  },
                  {
                    term: "Partners",
                    value: project.partners.length ? project.partners.join(", ") : pending,
                  },
                  {
                    term: "Outcomes",
                    value: <PendingContent item="impactFigures" variant="badge" />,
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
              <SectionHeading id="story-title" eyebrow="The project" title="What happened" />
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
                <PendingContent item="projects" />
              )}
            </div>
          </Container>
        </Reveal>
      </Section>

      {next ? (
        <SequenceNav
          label="Next case study"
          title={next.title}
          href={`/projects/${next.slug}`}
          description={next.summary}
        />
      ) : null}
    </>
  );
}
