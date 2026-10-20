import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { ActionPanels } from "@/components/sections/action-panels";
import { FullBleedImage } from "@/components/sections/full-bleed-image";
import { Hero } from "@/components/sections/hero";
import { ProgramExplorer, type ExplorerItem } from "@/components/sections/program-explorer";
import { RegionPresence } from "@/components/sections/region-presence";
import { SplitFeature } from "@/components/sections/split-feature";
import { Statement } from "@/components/sections/statement";
import { StoryScroller } from "@/components/sections/story-scroller";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ecosystems } from "@/content/ecosystems";
import { BitwiireFeature } from "@/features/partners";
import { ProjectCards, type Project } from "@/features/projects";
import { ResourceList, type Resource } from "@/features/resources";
import { visibleSections, type HomeSectionKey } from "../home-content";
import type { HomePage } from "../schema";

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

type HomePageViewProps = {
  home: HomePage;
  /** Published programmes plus the herbarium, for the explorer. */
  programmes: readonly ExplorerItem[];
  /** Featured published projects (or the first few when none are featured). */
  projects: readonly Project[];
  /** Featured published articles (or the newest when none are featured). */
  resources: readonly Resource[];
};

/** Featured items, or the first `count` when none are marked featured. */
export function pickFeatured<T extends { featured: boolean }>(items: readonly T[], count = 3): T[] {
  const featured = items.filter((item) => item.featured);
  return (featured.length ? featured : items).slice(0, count);
}

/**
 * The homepage composition (M03). The section components, their design and
 * the hero stay in code; words, images, link destinations, section order and
 * visibility come from the CMS (pages.content for "home"). Shared by the
 * public route and the admin preview, so a preview matches the live page.
 */
export function HomePageView({ home, programmes, projects, resources }: HomePageViewProps) {
  const { page, content, images } = home;

  const sections: Record<HomeSectionKey, () => ReactNode> = {
    introduction: () => (
      <div className="-mt-px">
        <Statement
          id="introduction"
          eyebrow={content.introduction.eyebrow}
          text={content.introduction.text}
          detail={content.introduction.detail || undefined}
          action={content.introduction.action}
        />
      </div>
    ),
    programmes: () => (
      <Section id="programmes" aria-labelledby="programmes-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="programmes-title"
                eyebrow={content.programmes.eyebrow}
                title={content.programmes.title}
                description={content.programmes.description || undefined}
              />
              <div data-reveal className="shrink-0">
                <SectionLink href="/our-work">{content.programmes.linkLabel}</SectionLink>
              </div>
            </div>
            <div className="mt-16" data-reveal>
              <ProgramExplorer items={programmes} />
            </div>
          </Container>
        </Reveal>
      </Section>
    ),
    heritage: () => (
      <>
        <Section surface="muted" aria-labelledby="heritage-title" className="pb-0">
          <Reveal>
            <Container>
              <SectionHeading
                id="heritage-title"
                eyebrow={content.heritage.eyebrow}
                title={content.heritage.title}
                description={content.heritage.description || undefined}
              />
            </Container>
          </Reveal>
          <Container className="mt-8 pb-section-sm">
            <StoryScroller steps={ecosystems} />
          </Container>
        </Section>
        {images.heritage ? (
          <FullBleedImage
            image={images.heritage}
            eyebrow={content.heritage.statementEyebrow}
            statement={content.heritage.statement}
          />
        ) : null}
      </>
    ),
    projects: () => (
      <Section aria-labelledby="projects-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="projects-title"
                eyebrow={content.projects.eyebrow}
                title={content.projects.title}
                description={content.projects.description || undefined}
              />
              <div data-reveal className="shrink-0">
                <SectionLink href="/projects">{content.projects.linkLabel}</SectionLink>
              </div>
            </div>
            <ProjectCards projects={projects} className="mt-16" />
          </Container>
        </Reveal>
      </Section>
    ),
    presence: () => <RegionPresence />,
    research: () =>
      images.research ? (
        <Section aria-labelledby="research-title">
          <SplitFeature
            eyebrow={content.research.eyebrow}
            title={content.research.title}
            titleId="research-title"
            image={images.research}
            action={content.research.action}
          >
            {content.research.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SplitFeature>
        </Section>
      ) : null,
    community: () =>
      images.community ? (
        <Section surface="muted" aria-labelledby="community-title">
          <SplitFeature
            eyebrow={content.community.eyebrow}
            title={content.community.title}
            titleId="community-title"
            image={images.community}
            aspect="landscape"
            reverse
            action={content.community.action}
          >
            {content.community.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </SplitFeature>
        </Section>
      ) : null,
    bitwiire: () => <BitwiireFeature />,
    involved: () => {
      const panels = content.involved.panels.flatMap((panel, index) => {
        const image = images.panels[index];
        return image
          ? [
              {
                eyebrow: panel.eyebrow,
                title: panel.title,
                description: panel.description,
                href: panel.action.href,
                cta: panel.action.label,
                image,
              },
            ]
          : [];
      });
      return (
        <Section surface="dark" aria-labelledby="involved-title">
          <Reveal>
            <Container>
              <SectionHeading
                id="involved-title"
                eyebrow={content.involved.eyebrow}
                title={content.involved.title}
              />
              <ActionPanels className="mt-16" panels={panels} />
            </Container>
          </Reveal>
        </Section>
      );
    },
    stories: () => (
      <Section aria-labelledby="stories-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="stories-title"
                eyebrow={content.stories.eyebrow}
                title={content.stories.title}
              />
              <div data-reveal className="shrink-0">
                <SectionLink href="/resources">{content.stories.linkLabel}</SectionLink>
              </div>
            </div>
            <ResourceList resources={resources} className="mt-14" />
          </Container>
        </Reveal>
      </Section>
    ),
  };

  return (
    <>
      <Hero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.lead}
        image={page.image}
        primaryAction={content.hero.primaryAction}
        secondaryAction={content.hero.secondaryAction}
        nextSectionId="introduction"
      />
      {visibleSections(content.layout).map((key) => (
        <Fragment key={key}>{sections[key]()}</Fragment>
      ))}
    </>
  );
}
