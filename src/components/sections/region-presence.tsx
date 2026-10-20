import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { KeyFacts, type KeyFact } from "@/components/ui/key-facts";
import { Section } from "@/components/ui/section";

const rings = [40, 80, 120, 160, 200, 240];
const ticks = Array.from({ length: 72 }, (_, index) => index * 5);

/** Survey-style rings around a fixed point: decorative, not a map of sites. */
function SurveyGraphic() {
  return (
    <svg
      viewBox="0 0 520 520"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-full text-foreground"
    >
      {rings.map((radius, index) => (
        <circle
          key={radius}
          cx="260"
          cy="260"
          r={radius}
          stroke="currentColor"
          strokeOpacity={0.12 + index * 0.02}
          strokeDasharray={index % 2 ? "2 6" : undefined}
        />
      ))}
      {ticks.map((angle) => (
        <line
          key={angle}
          x1="260"
          y1="8"
          x2="260"
          y2={angle % 45 === 0 ? 26 : 16}
          stroke="currentColor"
          strokeOpacity={angle % 45 === 0 ? 0.5 : 0.2}
          transform={`rotate(${angle} 260 260)`}
        />
      ))}
      <path d="M260 120V400M120 260H400" stroke="currentColor" strokeOpacity="0.25" />
      <circle cx="260" cy="260" r="7" className="fill-primary" />
      <circle cx="260" cy="260" r="18" className="stroke-primary" strokeOpacity="0.6" />
      <text
        x="282"
        y="246"
        className="fill-current font-sans text-[13px] tracking-[0.2em] uppercase"
      >
        Uganda
      </text>
      <text x="282" y="266" className="fill-current font-mono text-[11px]" fillOpacity="0.7">
        1.37° N 32.29° E
      </text>
    </svg>
  );
}

/**
 * Where EACH works, beside a decorative survey graphic. The words and facts
 * come from the homepage content; facts not yet confirmed carry placeholder
 * markers supplied by the caller.
 */
export function RegionPresence({
  headingId = "presence-title",
  eyebrow,
  title,
  text,
  facts,
}: {
  headingId?: string;
  eyebrow: string;
  title: string;
  text: string;
  facts: readonly KeyFact[];
}) {
  return (
    <Section surface="dark" aria-labelledby={headingId} className="overflow-hidden">
      <Reveal>
        <Container className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow data-reveal>{eyebrow}</Eyebrow>
            <h2
              id={headingId}
              data-reveal
              className="mt-5 font-display text-display-md font-normal text-balance"
            >
              {title}
            </h2>
            <p data-reveal className="mt-6 text-lead text-pretty text-muted-foreground">
              {text}
            </p>
            <KeyFacts className="mt-10" facts={facts} />
          </div>
          <div data-reveal className="mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8">
            <SurveyGraphic />
          </div>
        </Container>
      </Reveal>
    </Section>
  );
}
