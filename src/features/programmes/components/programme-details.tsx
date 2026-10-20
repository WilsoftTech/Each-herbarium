import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Programme } from "../schema";

/**
 * The programme's own objectives and detailed text from the CMS. Renders
 * nothing until EACH has written either, so the designed page is unchanged
 * meanwhile.
 */
export function ProgrammeDetails({ programme }: { programme: Programme }) {
  if (!programme.objectives.length && !programme.body.trim()) return null;

  return (
    <Section aria-labelledby="programme-details-title">
      <Reveal>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              id="programme-details-title"
              eyebrow={programme.category || "Programme"}
              title={`About ${programme.title.toLowerCase()}`}
            />
          </div>
          <div data-reveal className="space-y-10 lg:col-span-7 lg:col-start-6">
            {programme.objectives.length ? (
              <div>
                <h3 className="font-display text-heading">Objectives</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-muted-foreground">
                  {programme.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {programme.body.trim() ? <RichText source={programme.body} /> : null}
          </div>
        </Container>
      </Reveal>
    </Section>
  );
}
