import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { BotanicalIllustration } from "@/components/ui/botanical-illustration";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";

/**
 * Introduces Bitwiire Herbarium Cafe on its own warm surface, distinct from
 * EACH's palette, and states plainly that the two are independent.
 */
export function BitwiireFeature({ headingId = "bitwiire-title" }: { headingId?: string }) {
  return (
    <Section surface="warm" aria-labelledby={headingId} className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-16 hidden w-64 text-primary/25 md:block md:w-80 lg:right-12"
      >
        <BotanicalIllustration variant="fern" />
      </div>
      <Reveal className="relative">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow data-reveal>Independent partner</Eyebrow>
            <h2
              id={headingId}
              data-reveal
              className="mt-5 font-display text-display-lg font-light text-balance"
            >
              Bitwiire Herbarium Cafe
            </h2>
            <p data-reveal className="mt-8 max-w-2xl text-lead text-pretty text-muted-foreground">
              Bitwiire Herbarium Cafe is an independent partner of EACH. The two are separate
              organisations: neither owns or runs the other.
            </p>
            <div data-reveal className="mt-10">
              <Button asChild size="lg">
                <Link href="/bitwiire-herbarium-cafe">
                  About the partnership
                  <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/button:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          <div data-reveal className="self-end lg:col-span-5">
            <PendingContent item="bitwiireProfile" />
          </div>
        </Container>
      </Reveal>
    </Section>
  );
}
