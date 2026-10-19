import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

type SplitFeatureProps = {
  eyebrow?: ReactNode;
  title: string;
  titleAs?: "h2" | "h3";
  titleId?: string;
  /** Body copy and any extra content (lists, facts, notices). */
  children?: ReactNode;
  image: MediaAsset;
  /** Put the image on the right on large screens. */
  reverse?: boolean;
  aspect?: "portrait" | "landscape" | "square";
  action?: { label: string; href: string };
  className?: string;
};

const aspectClass = {
  portrait: "aspect-4/5",
  landscape: "aspect-4/3",
  square: "aspect-square",
} as const;

/**
 * Editorial image-and-text composition. The photograph is uncovered by a mask
 * as it enters and drifts slightly on scroll; the copy rises in. Pair with a
 * `Section` for surface and spacing.
 */
export function SplitFeature({
  eyebrow,
  title,
  titleAs: Heading = "h2",
  titleId,
  children,
  image,
  reverse = false,
  aspect = "portrait",
  action,
  className,
}: SplitFeatureProps) {
  return (
    <Reveal className={className}>
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <figure className={cn("lg:col-span-6", reverse && "lg:order-2 lg:col-start-7")}>
          <Parallax>
            <div
              data-reveal-media
              className={cn("relative overflow-hidden rounded-sm bg-muted", aspectClass[aspect])}
            >
              <div data-parallax className="absolute inset-x-0 -inset-y-[12%]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
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

        <div className={cn("lg:col-span-5", reverse ? "lg:order-1" : "lg:col-start-8")}>
          {eyebrow ? (
            <Eyebrow data-reveal className="mb-5">
              {eyebrow}
            </Eyebrow>
          ) : null}
          <Heading
            id={titleId}
            data-reveal
            className="font-display text-display-md font-normal text-balance"
          >
            {title}
          </Heading>
          {children ? (
            <div data-reveal className="mt-6 space-y-5 leading-8 text-pretty text-muted-foreground">
              {children}
            </div>
          ) : null}
          {action ? (
            <Link
              href={action.href}
              data-reveal
              className="group/link mt-8 inline-flex items-center gap-2 rounded-sm font-medium text-primary"
            >
              <span className="underline-offset-4 group-hover/link:underline">{action.label}</span>
              <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/link:translate-x-1" />
            </Link>
          ) : null}
        </div>
      </Container>
    </Reveal>
  );
}
