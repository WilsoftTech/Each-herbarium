import Image from "next/image";
import Link from "next/link";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { ArrowRightIcon } from "./icons";
import { PhotoCredit } from "./photo-credit";

type MediaCardProps = {
  href: string;
  title: string;
  description?: string;
  eyebrow?: string;
  image: MediaAsset;
  /** `sizes` hint for the responsive image. */
  sizes?: string;
  aspect?: "portrait" | "landscape";
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Photographic card linking to a page. The whole card is clickable through the
 * title link's stretched pseudo-element, while the credit links stay usable.
 */
export function MediaCard({
  href,
  title,
  description,
  eyebrow,
  image,
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  aspect = "portrait",
  headingLevel: Heading = "h3",
  className,
}: MediaCardProps) {
  return (
    <article className={cn("group/card relative flex flex-col", className)} data-reveal>
      <div
        className={cn(
          "relative overflow-hidden rounded-sm bg-muted",
          aspect === "portrait" ? "aspect-4/5" : "aspect-3/2",
        )}
        data-reveal-media
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-(--motion-duration-cinematic) ease-cinematic group-hover/card:scale-105"
        />
      </div>
      <div className="mt-6 flex flex-1 flex-col">
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <Heading className="font-display text-heading">
          <Link
            href={href}
            className="rounded-sm decoration-1 underline-offset-[0.2em] group-hover/card:underline after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </Heading>
        {description ? (
          <p className="mt-3 leading-7 text-pretty text-muted-foreground">{description}</p>
        ) : null}
        <span
          aria-hidden="true"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          Explore
          <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/card:translate-x-1" />
        </span>
        <PhotoCredit image={image} className="relative z-10 mt-4" />
      </div>
    </article>
  );
}
