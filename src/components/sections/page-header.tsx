import Image from "next/image";
import type { ReactNode } from "react";
import { Parallax } from "@/components/motion/parallax";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PhotoCredit } from "@/components/ui/photo-credit";
import { Section } from "@/components/ui/section";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  breadcrumbs?: ReactNode;
  /** Right-hand column on large screens: key facts, a notice or actions. */
  aside?: ReactNode;
  /** Optional wide photograph under the heading, uncovered with a mask and drifting on scroll. */
  image?: MediaAsset;
  surface?: "light" | "muted" | "dark" | "warm";
  /** Decorative layer behind the heading, such as a botanical illustration. */
  backdrop?: ReactNode;
  className?: string;
};

/**
 * Typographic opening for inner pages: breadcrumb, eyebrow, the page's single
 * `h1` and a lead. Entrances are CSS, because the header is visible on
 * first paint (see ADR 0003, M02 notes). Pages that need an immersive photographic opening use
 * `Hero` instead.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  aside,
  image,
  surface = "light",
  backdrop,
  className,
}: PageHeaderProps) {
  return (
    <Section
      surface={surface}
      spacing="none"
      aria-labelledby="page-title"
      className={cn("overflow-hidden pt-12 pb-section-sm md:pt-16", className)}
    >
      {backdrop ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {backdrop}
        </div>
      ) : null}
      <div className="relative">
        <Container>
          {breadcrumbs ? <div className="animate-fade-rise">{breadcrumbs}</div> : null}
          <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:items-end">
            <div className={aside ? "lg:col-span-8" : "lg:col-span-10"}>
              <Eyebrow className="animate-fade-rise">{eyebrow}</Eyebrow>
              <h1
                id="page-title"
                className="mt-6 animate-fade-rise font-display text-display-lg font-light text-balance [animation-delay:120ms]"
              >
                {title}
              </h1>
              {lead ? (
                <div className="mt-8 max-w-3xl animate-fade-rise text-lead text-pretty text-muted-foreground [animation-delay:240ms]">
                  {lead}
                </div>
              ) : null}
            </div>
            {aside ? (
              <div className="animate-fade-rise [animation-delay:360ms] lg:col-span-4">{aside}</div>
            ) : null}
          </div>
        </Container>
        {image ? (
          <Container className="mt-16 md:mt-20">
            <figure>
              <Parallax>
                <div className="relative aspect-4/3 animate-clip-reveal overflow-hidden rounded-sm bg-muted [animation-delay:300ms] sm:aspect-21/9">
                  <div data-parallax className="absolute inset-x-0 -inset-y-[12%]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      preload
                      sizes="(min-width: 80rem) 78rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </Parallax>
              <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs text-muted-foreground">
                <span>{image.caption}</span>
                <PhotoCredit image={image} />
              </figcaption>
            </figure>
          </Container>
        ) : null}
      </div>
    </Section>
  );
}
