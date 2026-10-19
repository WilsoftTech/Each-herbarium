import { Reveal } from "@/components/motion/reveal";
import { Hero } from "@/components/sections/hero";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { MediaCard } from "@/components/ui/media-card";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { hasMenu, primaryNavigation, type NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";

// Homepage foundation: the cinematic hero and a first section built from the
// M02 primitives. The full homepage story is delivered in M03.
const focusAreas = (primaryNavigation as readonly NavItem[])
  .filter((item) => ["herbarium", "our-work", "research-learning"].includes(item.id))
  .filter(hasMenu);

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <Hero
        eyebrow={siteConfig.name}
        title="Preserving East Africa's Plant Heritage."
        description="Connecting plants, people, science and indigenous knowledge to protect biodiversity for future generations."
        image={media.heroBwindiMist}
        primaryAction={{ label: "Explore the herbarium", href: "/herbarium" }}
        secondaryAction={{ label: "Get involved", href: "/get-involved" }}
        nextSectionId="focus"
      />

      <Section id="focus" surface="dark" aria-labelledby="focus-title" className="-mt-px">
        <Reveal>
          <Container>
            <SectionHeading
              id="focus-title"
              eyebrow="Our focus"
              title="Where plants, people and knowledge meet"
              description={siteConfig.description}
            />
            <Grid columns={3} className="mt-16">
              {focusAreas.map((item) => (
                <MediaCard
                  key={item.id}
                  href={item.href}
                  eyebrow={item.label}
                  title={item.feature?.title ?? item.label}
                  description={item.summary}
                  image={item.feature?.image ?? media.heroBwindiMist}
                />
              ))}
            </Grid>
          </Container>
        </Reveal>
      </Section>
    </main>
  );
}
