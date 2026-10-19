"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

export type StoryStep = {
  id: string;
  name: string;
  title: string;
  body: readonly string[];
  image: MediaAsset;
};

type StoryScrollerProps = {
  steps: readonly StoryStep[];
  stepHeading?: "h3" | "h4";
};

/**
 * Pinned scroll story (large screens): the photograph panel stays in view
 * with CSS `position: sticky` while the chapters scroll past, and crossfades
 * to the chapter at the centre of the viewport. Native scrolling is never
 * taken over. Small screens show each photograph inline with its chapter.
 */
export function StoryScroller({ steps, stepHeading: Heading = "h3" }: StoryScrollerProps) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const element of stepRefs.current) if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [steps.length]);

  const current = steps[active] ?? steps[0];

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-16">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-header flex h-[calc(100svh-var(--spacing-header))] flex-col py-10">
          {/* Decorative duplicate of the chapter photographs; credit below stays accessible. */}
          <div aria-hidden="true" className="relative flex-1 overflow-hidden rounded-sm bg-muted">
            {steps.map((step, index) => (
              <Image
                key={step.id}
                src={step.image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 1px"
                className={cn(
                  "object-cover transition-[opacity,scale] duration-(--motion-duration-cinematic) ease-cinematic",
                  index === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                )}
              />
            ))}
            <div
              data-surface="dark"
              className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-transparent bg-linear-to-t from-background/75 to-transparent p-6 pt-20 text-foreground"
            >
              <span className="font-display text-5xl font-light tabular-nums">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="text-eyebrow font-medium uppercase">{current?.name}</span>
            </div>
          </div>
          {current ? (
            <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span>{current.image.caption}</span>
              <PhotoCredit image={current.image} />
            </div>
          ) : null}
        </div>
      </div>

      <ol className="lg:col-span-5 lg:col-start-8">
        {steps.map((step, index) => (
          <li
            key={step.id}
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
            data-step={index}
            data-active={index === active || undefined}
            className="group/step flex flex-col justify-center border-t border-border py-12 first:border-t-0 lg:min-h-[85svh] lg:border-t-0"
          >
            <figure className="mb-8 lg:hidden">
              <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-muted">
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs text-muted-foreground">
                <span>{step.image.caption}</span>
                <PhotoCredit image={step.image} />
              </figcaption>
            </figure>
            <p className="flex items-center gap-4 text-eyebrow font-medium text-primary uppercase">
              <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span
                aria-hidden="true"
                className="h-px w-10 origin-left bg-primary transition-transform duration-(--motion-duration-slow) ease-cinematic lg:scale-x-50 lg:group-data-active/step:scale-x-100"
              />
              {step.name}
            </p>
            <Heading className="mt-6 font-display text-display-md font-light text-balance">
              {step.title}
            </Heading>
            <div className="mt-6 space-y-4 text-lead text-pretty text-muted-foreground">
              {step.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
