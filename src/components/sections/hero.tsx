import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { HeroMotion } from "@/components/motion/hero-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { MediaAsset } from "@/config/media";

type HeroAction = { label: string; href: string };

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: MediaAsset;
  primaryAction: HeroAction;
  secondaryAction: HeroAction;
  /** Id of the section that follows, for the scroll cue. */
  nextSectionId?: string;
};

/**
 * Full-viewport photographic hero. The headline is revealed word by word
 * behind masks and the photograph settles from a slight zoom, both in CSS so
 * the final state renders without JavaScript. `HeroMotion` adds scroll
 * parallax. The bottom fades into the dark surface of the next section.
 */
export function Hero({
  eyebrow,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
  nextSectionId,
}: HeroProps) {
  const words = title.split(" ");

  return (
    <section data-surface="dark" aria-labelledby="hero-title" className="relative isolate">
      <HeroMotion className="relative flex min-h-svh flex-col justify-end overflow-hidden">
        <div data-hero-media className="absolute inset-0 -z-10">
          <div className="absolute inset-0 animate-settle">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="100vw"
              quality={70}
              className="object-cover object-[50%_35%]"
            />
          </div>
        </div>
        {/* Legibility (contrast measured in docs/architecture/design-tokens.md): overall
            shade, a top band for the header, a left wash for the copy. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/60 to-background/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-background/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-background/75 via-background/25 to-transparent"
        />
        {/* Small screens: the copy spans the full width, beyond the left wash. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/35 md:hidden" />
        <div
          aria-hidden="true"
          data-hero-shade
          className="absolute inset-0 -z-10 bg-background opacity-0"
        />

        <Container data-hero-content className="pt-header pb-32 md:pb-36">
          <Eyebrow className="animate-fade-rise text-foreground [animation-delay:100ms]">
            {eyebrow}
          </Eyebrow>
          <h1
            id="hero-title"
            className="mt-6 max-w-5xl font-display text-display-xl font-light text-balance"
          >
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <span
                    className="inline-block animate-mask-rise"
                    style={{ animationDelay: `${200 + index * 80}ms` }}
                  >
                    {word}
                  </span>
                </span>
                {index < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>
          <p className="mt-8 max-w-2xl animate-fade-rise text-lead text-pretty text-foreground/90 [animation-delay:700ms]">
            {description}
          </p>
          <div className="mt-10 flex animate-fade-rise flex-wrap gap-4 [animation-delay:850ms]">
            <Button asChild variant="contrast" size="lg">
              <Link href={primaryAction.href}>
                {primaryAction.label}
                <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/button:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          </div>
        </Container>

        <Container className="absolute inset-x-0 bottom-0 flex animate-fade-rise items-end justify-between gap-6 pb-8 [animation-delay:1100ms]">
          {nextSectionId ? (
            <a
              href={`#${nextSectionId}`}
              className="group/cue inline-flex items-center gap-4 rounded-sm text-eyebrow font-medium uppercase"
            >
              <span className="relative block h-12 w-px overflow-hidden bg-foreground/30">
                <span className="absolute inset-0 animate-scroll-cue bg-foreground" />
              </span>
              Scroll <span className="sr-only">to the next section</span>
            </a>
          ) : (
            <span />
          )}
          <div className="text-right">
            <p className="text-xs text-foreground/80">{image.caption}</p>
            <PhotoCredit image={image} className="text-foreground/80" />
          </div>
        </Container>
      </HeroMotion>
    </section>
  );
}
