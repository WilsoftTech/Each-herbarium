import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { SplitFeature } from "@/components/sections/split-feature";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { listProjects, ProjectLocation } from "@/features/projects";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("projects");
}

export default async function ProjectsPage() {
  const page = await loadManagedPage("projects");
  const projects = await listProjects();
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
            <p data-reveal className="max-w-2xl text-lead text-pretty text-muted-foreground">
              Results will be reported on the{" "}
              <Link href="/impact" className="rounded-sm text-primary underline underline-offset-4">
                impact page
              </Link>{" "}
              once they have been verified.
            </p>
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
