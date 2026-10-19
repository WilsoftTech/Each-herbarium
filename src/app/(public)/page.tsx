import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ActionPanels } from "@/components/sections/action-panels";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { Hero } from "@/components/sections/hero";
import { ProgramExplorer } from "@/components/sections/program-explorer";
import { RegionPresence } from "@/components/sections/region-presence";
import { SplitFeature } from "@/components/sections/split-feature";
import { Statement } from "@/components/sections/statement";
import { StoryScroller } from "@/components/sections/story-scroller";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/json-ld";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { env } from "@/config/env";
import { media } from "@/config/media";
import { siteConfig } from "@/config/site";
import { ecosystems } from "@/content/ecosystems";
import { herbariumProgramme, programmes } from "@/content/programmes";
import { BitwiireFeature } from "@/features/partners";
import { listProjects, ProjectCards } from "@/features/projects";
import { listResources, ResourceList } from "@/features/resources";
import { pageMetadata } from "@/lib/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: siteConfig.name,
  absoluteTitle: true,
  description:
    "EACH is an independent initiative for plant conservation, herbarium development and botanical knowledge in East Africa, beginning in Uganda.",
  path: "/",
});

function SectionLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group/link inline-flex items-center gap-2 rounded-sm font-medium text-primary"
    >
      <span className="underline-offset-4 group-hover/link:underline">{children}</span>
      <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/link:translate-x-1" />
    </Link>
  );
}

export default async function Home() {
  const [projects, resources] = await Promise.all([listProjects(), listResources()]);

  return (
    <>
      <JsonLd data={[organizationJsonLd(env.siteUrl), websiteJsonLd(env.siteUrl)]} />

      {/* 1. Cinematic hero */}
      <Hero
        eyebrow={siteConfig.name}
        title="Preserving East Africa's Plant Heritage."
        description="Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations."
        image={media.heroBwindiMist}
        primaryAction={{ label: "Explore the herbarium", href: "/herbarium" }}
        secondaryAction={{ label: "Get involved", href: "/get-involved" }}
        nextSectionId="introduction"
      />

      {/* 2. Introduction */}
      <div className="-mt-px">
        <Statement
          id="introduction"
          eyebrow="Introducing EACH"
          text="EACH is an independent conservation, herbarium and botanical knowledge initiative for East Africa, operating first in Uganda."
          detail="It brings together plant conservation, herbarium collections, research and the knowledge held by communities, so that the region's plants are documented, understood and protected."
          action={{ label: "About EACH", href: "/about" }}
        />
      </div>

      {/* 3. Programmes */}
      <Section id="programmes" aria-labelledby="programmes-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="programmes-title"
                eyebrow="Our work"
                title="Conservation and herbarium programmes"
                description="Five connected areas of work, from protecting plants in the wild to preserving the knowledge that surrounds them."
              />
              <div data-reveal className="shrink-0">
                <SectionLink href="/our-work">All of our work</SectionLink>
              </div>
            </div>
            <div className="mt-16" data-reveal>
              <ProgramExplorer items={[...programmes, herbariumProgramme]} />
            </div>
          </Container>
        </Reveal>
      </Section>

      {/* 4. Plant heritage */}
      <Section surface="muted" aria-labelledby="heritage-title" className="pb-0">
        <Reveal>
          <Container>
            <SectionHeading
              id="heritage-title"
              eyebrow="East Africa's plant heritage"
              title="From afroalpine peaks to papyrus wetlands"
              description="East Africa's plants are shaped by altitude, water and season. Four landscapes show the range of what there is to protect."
            />
          </Container>
        </Reveal>
        <Container className="mt-8 pb-section-sm">
          <StoryScroller steps={ecosystems} />
        </Container>
      </Section>

      <FullBleedImage
        image={media.rwenzoriMountSpeke}
        eyebrow="Plant heritage"
        statement="Some of these plants grow nowhere else on Earth."
      />

      {/* 5. Featured projects */}
      <Section aria-labelledby="projects-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="projects-title"
                eyebrow="Featured conservation projects"
                title="Stories from the landscapes we protect"
                description="Project case studies will appear here. Until EACH publishes its first projects, placeholders show how they will be presented."
              />
              <div data-reveal className="shrink-0">
                <SectionLink href="/projects">All projects</SectionLink>
              </div>
            </div>
            <ProjectCards projects={projects} className="mt-16" />
          </Container>
        </Reveal>
      </Section>

      {/* 6. Regional presence */}
      <RegionPresence />

      {/* 7. Research */}
      <Section aria-labelledby="research-title">
        <SplitFeature
          eyebrow="Research and botanical knowledge"
          title="Knowledge that starts with a specimen"
          titleId="research-title"
          image={media.herbariumSheetCallistemon}
          action={{ label: "Research at EACH", href: "/research" }}
        >
          <p>
            Herbarium specimens and careful field records are the foundation of botanical research.
            They confirm what a plant is, where it grows, and how that is changing over time.
          </p>
          <p>
            EACH is building that foundation for East Africa, and sharing what it learns through
            open resources.
          </p>
        </SplitFeature>
      </Section>

      {/* 8. Community and indigenous knowledge */}
      <Section surface="muted" aria-labelledby="community-title">
        <SplitFeature
          eyebrow="Community and indigenous knowledge"
          title="Knowledge held by the people who live with these plants"
          titleId="community-title"
          image={media.lakeBunyonyi}
          aspect="landscape"
          reverse
          action={{ label: "Indigenous knowledge", href: "/our-work/indigenous-knowledge" }}
        >
          <p>
            The names, uses and stories of plants are carried by the communities who live alongside
            them. That knowledge belongs to its custodians.
          </p>
          <p>
            Recording it must start with their consent, credit them, and leave them in control of
            what is shared.
          </p>
        </SplitFeature>
      </Section>

      {/* 9. Bitwiire Herbarium Cafe */}
      <BitwiireFeature />

      {/* 10. Get involved */}
      <Section surface="dark" aria-labelledby="involved-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="involved-title"
              eyebrow="Volunteer and partner"
              title="Help protect East Africa's plant heritage"
            />
            <ActionPanels
              className="mt-16"
              panels={[
                {
                  eyebrow: "Volunteer",
                  title: "Give your time and skills",
                  description:
                    "Field work, herbarium work and education all depend on people who care about plants.",
                  href: "/volunteer",
                  cta: "Volunteering with EACH",
                  image: media.budongoTree,
                },
                {
                  eyebrow: "Partnerships",
                  title: "Work with us as an organisation",
                  description:
                    "Research institutions, community groups and conservation organisations can collaborate with EACH.",
                  href: "/partnerships",
                  cta: "Partnerships",
                  image: media.semulikiVegetation,
                },
              ]}
            />
          </Container>
        </Reveal>
      </Section>

      {/* 11. Stories and publications */}
      <Section aria-labelledby="stories-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="stories-title"
                eyebrow="Latest stories and publications"
                title="From the field and the herbarium"
              />
              <div data-reveal className="shrink-0">
                <SectionLink href="/resources">All resources</SectionLink>
              </div>
            </div>
            <ResourceList resources={resources} className="mt-14" />
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
