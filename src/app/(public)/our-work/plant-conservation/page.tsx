import { Reveal } from "@/components/motion/reveal";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { Hero } from "@/components/sections/hero";
import { NumberedList } from "@/components/sections/numbered-list";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { SplitFeature } from "@/components/sections/split-feature";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { nextProgramme, programmeBySlug } from "@/content/programmes";
import { listProjectsForProgramme, ProjectCards } from "@/features/projects";
import { pageMetadata } from "@/lib/metadata";

const programme = programmeBySlug("plant-conservation");

export const metadata = pageMetadata({
  title: "Plant conservation",
  description:
    "Why East Africa's native plants need protecting, and how plants are conserved in the wild, in collections and in herbaria.",
  path: programme.href,
  image: programme.image,
});

// How plant conservation works in general; not a description of EACH's activities.
const approaches = [
  {
    title: "Know what grows where",
    body: "Surveys and identified specimens establish which species are present and how common they are.",
  },
  {
    title: "Understand the threats",
    body: "Land clearance, over-harvesting, invasive species and a changing climate affect plants differently. Assessments show which species are most at risk.",
  },
  {
    title: "Protect plants where they grow",
    body: "Conserving habitats keeps plants in the ecosystems, and alongside the pollinators and communities, they depend on.",
  },
  {
    title: "Safeguard them in collections",
    body: "Seed banks, living collections and herbaria keep a record, and sometimes a reserve, when wild populations are under pressure.",
  },
] as const;

export default async function PlantConservationPage() {
  const projects = await listProjectsForProgramme(programme.slug);
  const next = nextProgramme(programme.slug);

  return (
    <>
      <Hero
        size="tall"
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Our work", href: "/our-work" }]}
            current={{ label: programme.title, href: programme.href }}
          />
        }
        eyebrow="Our work"
        title={programme.title}
        description={programme.summary}
        image={programme.image}
        focus="70% 40%"
        nextSectionId="why"
      />

      <Section id="why" aria-labelledby="why-title">
        <SplitFeature
          eyebrow="Why it matters"
          title="A remarkable flora, under pressure"
          titleId="why-title"
          image={media.rwenzoriVegetation}
          aspect="landscape"
        >
          <p>{programme.intro}</p>
          <p>
            The afroalpine plants of the Rwenzori, the hardwoods of Uganda&apos;s forests and the
            grasses of its savannas each depend on conditions that are changing.
          </p>
        </SplitFeature>
      </Section>

      <Section surface="muted" aria-labelledby="approach-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="approach-title"
              eyebrow="How plants are conserved"
              title="Four parts of conserving a plant"
              description="Conservationists combine these approaches. EACH's own activities within them will be described once confirmed."
            />
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={approaches} columns={2} />
          <PendingContent item="programmeDetails" className="mt-14" />
        </Container>
      </Section>

      <FullBleedImage
        image={media.rwenzoriGroundselValley}
        eyebrow="Rwenzori Mountains"
        statement="Giant groundsels like these grow only on the high mountains of East Africa."
      />

      <Section aria-labelledby="related-title">
        <Reveal>
          <Container>
            <SectionHeading id="related-title" eyebrow="Projects" title="Related projects" />
            <ProjectCards projects={projects} className="mt-14" />
          </Container>
        </Reveal>
      </Section>

      <SequenceNav
        label="Next programme"
        title={next.title}
        href={next.href}
        description={next.summary}
      />
    </>
  );
}
