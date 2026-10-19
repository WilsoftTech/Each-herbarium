import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { SplitFeature } from "@/components/sections/split-feature";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { media } from "@/config/media";
import { listProjects, ProjectLocation } from "@/features/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Case studies of EACH's conservation projects across East Africa. The first projects are being prepared.",
  path: "/projects",
  image: media.kidepoEuphorbia,
});

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Projects", href: "/projects" }} />}
        eyebrow="Projects & Impact"
        title="Conservation projects"
        lead={
          <p>
            Each project will be told as a case study: the landscape, the plants, the people
            involved and what changed. The case studies below are placeholders that show the format;
            they do not describe EACH projects.
          </p>
        }
        aside={<PendingContent item="projects" />}
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
