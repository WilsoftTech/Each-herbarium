"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

export type ExplorerItem = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  image: MediaAsset;
};

type ProgramExplorerProps = {
  items: readonly ExplorerItem[];
  /** Heading level of each item title. */
  itemHeading?: "h3" | "h4";
};

/**
 * Interactive programme navigation. Each programme is an ordinary link;
 * pointing at it or focusing it with the keyboard brings its photograph
 * forward in the panel beside the list (large screens). Every summary is
 * always visible, so nothing depends on hover, and touch simply follows the
 * link. Without JavaScript the first photograph is shown.
 */
export function ProgramExplorer({ items, itemHeading: Heading = "h3" }: ProgramExplorerProps) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <ol className="lg:col-span-6" data-explorer-list>
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <li key={item.slug} className="border-t border-border last:border-b">
              <Link
                href={item.href}
                data-active={isActive || undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(index);
                }}
                onFocus={() => setActive(index)}
                className="group/item relative flex gap-6 rounded-sm py-7 md:gap-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-(--motion-duration-slow) ease-cinematic group-data-active/item:scale-x-100"
                />
                <span
                  aria-hidden="true"
                  className="w-8 shrink-0 pt-1.5 font-display text-sm text-primary tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <Heading className="font-display text-heading text-foreground/70 transition-colors duration-(--motion-duration-base) group-hover/item:text-foreground group-data-active/item:text-foreground md:text-[2rem] md:leading-tight">
                    {item.title}
                  </Heading>
                  <p className="mt-3 max-w-md leading-7 text-pretty text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
                <ArrowRightIcon className="mt-2 size-5 shrink-0 text-primary opacity-60 transition-[opacity,translate] duration-(--motion-duration-base) ease-cinematic group-hover/item:translate-x-1 group-hover/item:opacity-100 group-data-active/item:opacity-100" />
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--spacing-header)+2rem)]">
          {/* Decorative: the list carries the content; the credit below stays accessible. */}
          <div
            aria-hidden="true"
            className="relative aspect-4/5 overflow-hidden rounded-sm bg-muted"
          >
            {items.map((item, index) => (
              <Image
                key={item.slug}
                src={item.image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 1px"
                className={cn(
                  "object-cover transition-[opacity,scale] duration-(--motion-duration-cinematic) ease-cinematic",
                  index === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
          </div>
          {current ? (
            <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span>{current.image.caption}</span>
              <PhotoCredit image={current.image} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
