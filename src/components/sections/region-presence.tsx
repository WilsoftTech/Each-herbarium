import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { KeyFacts } from "@/components/ui/key-facts";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";

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
 * Where EACH works. States only what is confirmed (EACH begins in Uganda);
 * sites and any wider regional presence are shown as outstanding content.
 */
export function RegionPresence({ headingId = "presence-title" }: { headingId?: string }) {
  return (
    <Section surface="dark" aria-labelledby={headingId} className="overflow-hidden">
      <Reveal>
        <Container className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow data-reveal>Regional presence</Eyebrow>
            <h2
              id={headingId}
              data-reveal
              className="mt-5 font-display text-display-md font-normal text-balance"
            >
              Rooted in Uganda, looking across East Africa
            </h2>
            <p data-reveal className="mt-6 text-lead text-pretty text-muted-foreground">
              {siteConfig.name} begins its work in Uganda. The places where EACH works, and any
              expansion across the region, will be shown here once confirmed.
            </p>
            <KeyFacts
              className="mt-10"
              facts={[
                { term: "Where we begin", value: "Uganda" },
                { term: "Region", value: siteConfig.region },
                {
                  term: "Sites and districts",
                  value: <PendingContent item="regionalPresence" variant="badge" />,
                },
                {
                  term: "Wider region",
                  value: <PendingContent item="regionalPresence" variant="badge" />,
                },
              ]}
            />
          </div>
          <div data-reveal className="mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8">
            <SurveyGraphic />
          </div>
        </Container>
      </Reveal>
    </Section>
  );
}
