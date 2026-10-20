import type { ReactNode } from "react";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { SectionHeading } from "@/components/ui/section-heading";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

/** The "next page" link at the foot of a landing page, from its `next` section. */
export function NextLink({
  next,
}: {
  next: { label: string; title: string; href: string; description: string };
}) {
  return (
    <SequenceNav
      label={next.label}
      title={next.title}
      href={next.href}
      description={next.description}
    />
  );
}

/** A section heading with an optional placeholder marker aligned to its end. */
export function MarkedHeading({
  id,
  heading,
  marker,
  className,
}: {
  id: string;
  heading: { eyebrow: string; title: string; description?: string };
  /** A PendingContent badge, or null once EACH has approved the content. */
  marker: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-between gap-6 md:flex-row md:items-end", className)}>
      <SectionHeading
        id={id}
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
      />
      {marker}
    </div>
  );
}

/**
 * Cards whose image is usable. A card whose image is missing or lacks alt
 * text is left out rather than breaking the page (publishing refuses it).
 */
export function withImages<T extends { imageId: string }>(
  items: readonly T[],
  images: Record<string, MediaAsset>,
): (T & { image: MediaAsset })[] {
  return items.flatMap((item) => {
    const image = images[item.imageId];
    return image ? [{ ...item, image }] : [];
  });
}
