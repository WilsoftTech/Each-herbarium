import Image from "next/image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

type FullBleedImageProps = {
  image: MediaAsset;
  /** Optional statement set over the photograph. */
  eyebrow?: string;
  statement?: string;
  height?: "tall" | "medium";
  className?: string;
};

/**
 * Full-width photographic interlude between sections. The photograph drifts
 * against the scroll; an optional statement sits on a shade measured for
 * legibility. Always on the dark surface so text tokens stay light.
 */
export function FullBleedImage({
  image,
  eyebrow,
  statement,
  height = "tall",
  className,
}: FullBleedImageProps) {
  return (
    <figure data-surface="dark" className={cn("relative isolate overflow-hidden", className)}>
      <Parallax
        className={cn(
          "relative flex items-end",
          height === "tall" ? "min-h-[80svh]" : "min-h-[60svh]",
        )}
      >
        <div data-parallax className="absolute inset-x-0 -inset-y-[12%] -z-10">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
        </div>
        {statement ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-t from-background/90 via-background/45 to-background/10"
            />
            <Reveal className="w-full">
              <Container className="pt-section pb-24">
                {eyebrow ? (
                  <Eyebrow data-reveal className="text-foreground">
                    {eyebrow}
                  </Eyebrow>
                ) : null}
                <p
                  data-reveal
                  className="mt-6 max-w-4xl font-display text-display-md font-light text-balance"
                >
                  {statement}
                </p>
              </Container>
            </Reveal>
          </>
        ) : null}
      </Parallax>
      <figcaption className="absolute right-0 bottom-0 left-0">
        <Container className="flex flex-wrap justify-end gap-x-4 pb-5 text-right text-xs text-foreground/85">
          <span>{image.caption}</span>
          <PhotoCredit image={image} className="text-foreground/85" />
        </Container>
      </figcaption>
    </figure>
  );
}
