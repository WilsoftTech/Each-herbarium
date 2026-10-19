import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Grid } from "@/components/ui/grid";
import { ArrowRightIcon } from "@/components/ui/icons";
import { MediaCard } from "@/components/ui/media-card";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";

// Internal preview of the M02 design system. Not linked from the navigation
// and excluded from search indexing.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colours = [
  { token: "background", swatch: "bg-background", text: "text-foreground" },
  { token: "foreground", swatch: "bg-foreground", text: "text-background" },
  { token: "primary", swatch: "bg-primary", text: "text-primary-foreground" },
  { token: "accent", swatch: "bg-accent", text: "text-accent-foreground" },
  { token: "muted", swatch: "bg-muted", text: "text-muted-foreground" },
  { token: "card", swatch: "bg-card", text: "text-card-foreground" },
] as const;

const typeScale = [
  { token: "text-display-xl", className: "font-display text-display-xl font-light" },
  { token: "text-display-lg", className: "font-display text-display-lg" },
  { token: "text-display-md", className: "font-display text-display-md" },
  { token: "text-heading", className: "font-display text-heading" },
  { token: "text-lead", className: "text-lead text-muted-foreground" },
  { token: "text-base", className: "text-base leading-7" },
] as const;

function ButtonRow() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button>Primary</Button>
      <Button variant="contrast">
        Contrast
        <ArrowRightIcon className="transition-transform group-hover/button:translate-x-1" />
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button asChild variant="link">
        <Link href="/">Link to home</Link>
      </Button>
      <Button size="sm" variant="outline">
        Small
      </Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

function SurfacePalette() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {colours.map((colour) => (
        <li
          key={colour.token}
          className={`flex aspect-square flex-col justify-end rounded-sm border border-border p-4 ${colour.swatch} ${colour.text}`}
        >
          <span className="text-sm font-medium">{colour.token}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <Section spacing="compact">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="EACH · M02"
            title="Design system"
            description="Tokens, typography and primitives for the EACH website. Every element on this page uses semantic tokens, so the same components adapt to light and dark surfaces."
          />
        </Container>
      </Section>

      <Section spacing="compact" className="border-t border-border" aria-labelledby="colour-light">
        <Container className="space-y-8">
          <h2 id="colour-light" className="font-display text-heading">
            Colour: light surface
          </h2>
          <SurfacePalette />
        </Container>
      </Section>

      <Section spacing="compact" surface="dark" aria-labelledby="colour-dark">
        <Container className="space-y-8">
          <h2 id="colour-dark" className="font-display text-heading">
            Colour: dark surface
          </h2>
          <SurfacePalette />
        </Container>
      </Section>

      <Section spacing="compact" aria-labelledby="type">
        <Container className="space-y-10">
          <h2 id="type" className="font-display text-heading">
            Typography
          </h2>
          <Eyebrow>Eyebrow · text-eyebrow</Eyebrow>
          {typeScale.map((style) => (
            <div key={style.token} className="border-t border-border pt-6">
              <p className="mb-3 font-mono text-xs text-muted-foreground">{style.token}</p>
              <p className={style.className}>Preserving East Africa&apos;s plant heritage</p>
            </div>
          ))}
        </Container>
      </Section>

      <Section spacing="compact" surface="muted" aria-labelledby="buttons-light">
        <Container className="space-y-8">
          <h2 id="buttons-light" className="font-display text-heading">
            Buttons: light surface
          </h2>
          <ButtonRow />
        </Container>
      </Section>

      <Section spacing="compact" surface="dark" aria-labelledby="buttons-dark">
        <Container className="space-y-8">
          <h2 id="buttons-dark" className="font-display text-heading">
            Buttons: dark surface
          </h2>
          <ButtonRow />
        </Container>
      </Section>

      <Section aria-labelledby="cards-title">
        <Reveal>
          <Container>
            <SectionHeading
              id="cards-title"
              eyebrow="Section heading, grid and media cards"
              title="Scroll-revealed content"
              description="Cards rise in with a stagger and their photographs are uncovered with a clip reveal. With reduced motion everything is shown immediately."
            />
            <Grid columns={3} className="mt-16">
              <MediaCard
                href="/herbarium"
                eyebrow="Herbarium"
                title="Specimen card"
                description="Portrait card with a licensed photograph and its credit."
                image={media.herbariumSheet}
              />
              <MediaCard
                href="/our-work"
                eyebrow="Our Work"
                title="Landscape card"
                description="The same card in landscape format."
                image={media.rwenzoriVegetation}
                aspect="landscape"
              />
              <MediaCard
                href="/get-involved"
                eyebrow="Get Involved"
                title="Hover to see the image ease in"
                image={media.semulikiVegetation}
                aspect="landscape"
              />
            </Grid>
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
