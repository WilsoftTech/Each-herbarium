import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

export type ActionPanel = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  image: MediaAsset;
};

type ActionPanelsProps = {
  panels: readonly ActionPanel[];
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Large photographic invitations to act (volunteer, partner, contact). The
 * whole panel is the link; on hover the photograph slowly zooms and the shade
 * lifts. Credit links stay independently usable.
 */
export function ActionPanels({
  panels,
  headingLevel: Heading = "h3",
  className,
}: ActionPanelsProps) {
  return (
    <Reveal>
      <div className={cn("grid gap-4 md:grid-cols-2", className)}>
        {panels.map((panel) => (
          <article
            key={panel.href}
            data-surface="dark"
            data-reveal
            className="group/panel relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-sm p-8 md:min-h-[34rem] md:p-10"
          >
            <Image
              src={panel.image.src}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="-z-10 object-cover transition-transform duration-(--motion-duration-cinematic) ease-cinematic group-hover/panel:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/70 to-background/10 transition-opacity duration-(--motion-duration-slow) ease-cinematic group-hover/panel:opacity-90"
            />
            <p className="text-eyebrow font-medium text-primary uppercase">{panel.eyebrow}</p>
            <Heading className="mt-4 max-w-md font-display text-display-md font-light text-balance">
              <Link
                href={panel.href}
                className="rounded-sm after:absolute after:inset-0 after:content-['']"
              >
                {panel.title}
              </Link>
            </Heading>
            <p className="mt-4 max-w-md leading-7 text-pretty text-foreground/85">
              {panel.description}
            </p>
            <span
              aria-hidden="true"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium"
            >
              {panel.cta}
              <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/panel:translate-x-1" />
            </span>
            <PhotoCredit image={panel.image} className="relative z-10 mt-6 text-foreground/80" />
          </article>
        ))}
      </div>
    </Reveal>
  );
}
