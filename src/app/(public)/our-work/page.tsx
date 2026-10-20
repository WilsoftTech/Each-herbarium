import { Reveal } from "@/components/motion/reveal";
import { Hero } from "@/components/sections/hero";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { MediaCard } from "@/components/ui/media-card";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { listProgrammes } from "@/features/programmes";
import { listProjects, ProjectCards } from "@/features/projects";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("our-work");
}

export default async function OurWorkPage() {
  const page = await loadManagedPage("our-work");
  const [programmes, projects] = await Promise.all([listProgrammes(), listProjects()]);

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
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="programmes-title"
                eyebrow="Programmes"
                title="Four connected programmes"
                description="Conservation protects plants and the places they grow. Knowledge work makes sure what people know about plants is recorded accurately and respectfully."
              />
              <PendingContent
                item="programmeDetails"
                variant="badge"
                className="self-start md:self-end"
              />
            </div>
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
              eyebrow="In the field"
              title="Projects"
              description="Case studies of EACH's projects will be listed here. The current entries are placeholders."
            />
            <ProjectCards projects={projects} className="mt-16" />
          </Container>
        </Reveal>
      </Section>

      <SequenceNav
        label="Also explore"
        title="The herbarium"
        href="/herbarium"
        description="Building collections that document East African plants for science, education and conservation."
      />
    </>
  );
}
