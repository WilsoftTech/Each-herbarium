import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  bespokeProgrammeSlugs,
  getProgramme,
  listProgrammes,
  nextProgramme,
} from "@/features/programmes";
import { listProjectsForProgramme, ProjectCards } from "@/features/projects";
import { pageMetadata, staticParams } from "@/lib/metadata";

/**
 * Generic page for a programme added in the CMS. The four founding
 * programmes have their own designed routes, which take precedence over this
 * dynamic segment.
 */
const isGeneric = (slug: string) => !(bespokeProgrammeSlugs as readonly string[]).includes(slug);

export async function generateStaticParams() {
  const programmes = (await listProgrammes()).filter(({ slug }) => isGeneric(slug));
  return staticParams(programmes.map(({ slug }) => ({ slug })));
}

async function loadProgramme(slug: string) {
  const programme = isGeneric(slug) ? await getProgramme(slug) : undefined;
  if (!programme) notFound();
  return programme;
}

export async function generateMetadata({
  params,
}: PageProps<"/our-work/[slug]">): Promise<Metadata> {
  const programme = await loadProgramme((await params).slug);
  return pageMetadata({
    title: programme.title,
    description: programme.summary,
    path: programme.href,
    image: programme.image,
    noindex: programme.status === "placeholder",
  });
}

export default async function ProgrammePage({ params }: PageProps<"/our-work/[slug]">) {
  const programme = await loadProgramme((await params).slug);
  const [projects, next] = await Promise.all([
    listProjectsForProgramme(programme.slug),
    nextProgramme(programme.slug),
  ]);

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Our work", href: "/our-work" }]}
            current={{ label: programme.title, href: programme.href }}
          />
        }
        eyebrow="Programme"
        title={programme.title}
        lead={<p>{programme.intro}</p>}
        image={programme.image}
      />

      <Section aria-labelledby="programme-projects-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="programme-projects-title"
              eyebrow="Projects"
              title="Work in this programme"
            />
            {projects.length ? (
              <ProjectCards projects={projects} className="mt-14" />
            ) : (
              <PendingContent item="projects" className="mt-12 max-w-[68ch]" />
            )}
          </Container>
        </Reveal>
      </Section>

      {next && next.slug !== programme.slug ? (
        <SequenceNav
          label="Next programme"
          title={next.title}
          href={next.href}
          description={next.summary}
        />
      ) : null}
    </>
  );
}
