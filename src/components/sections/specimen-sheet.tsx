import Image from "next/image";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { ReferenceSpecimen } from "@/content/specimens";
import { cn } from "@/lib/utils";

type SpecimenSheetProps = {
  specimen: ReferenceSpecimen;
  sizes?: string;
  preload?: boolean;
  className?: string;
};

/**
 * A herbarium sheet presented like a mounted specimen, with its label data
 * set out as a record. Used for reference specimens, which are not EACH's.
 */
export function SpecimenSheet({
  specimen,
  sizes = "(min-width: 1024px) 30vw, 90vw",
  preload = false,
  className,
}: SpecimenSheetProps) {
  const { image } = specimen;

  return (
    <figure className={cn("group/sheet", className)} data-reveal>
      <div className="bg-card p-3 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.45)] ring-1 ring-border transition-transform duration-(--motion-duration-slow) ease-cinematic group-hover/sheet:-translate-y-1 md:p-4">
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            preload={preload}
            className="object-cover"
          />
        </div>
      </div>
      <figcaption className="mt-5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-border pt-4 font-mono text-xs leading-5">
          <dt className="text-muted-foreground uppercase">Taxon</dt>
          <dd>
            <i>{specimen.taxon}</i>
            {specimen.filedAs ? (
              <>
                {" "}
                (filed as <i>{specimen.filedAs}</i>)
              </>
            ) : null}
          </dd>
          <dt className="text-muted-foreground uppercase">Locality</dt>
          <dd>{specimen.locality}</dd>
          <dt className="text-muted-foreground uppercase">Collected</dt>
          <dd>
            {specimen.collected}, {specimen.collector}
          </dd>
          <dt className="text-muted-foreground uppercase">Record</dt>
          <dd>
            <a
              href={specimen.record.href}
              className="underline underline-offset-2 hover:text-primary"
            >
              {specimen.record.label}
            </a>
          </dd>
        </dl>
        <div className="mt-3 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
          <p>Reference image, not an EACH specimen.</p>
          <PhotoCredit image={image} />
        </div>
      </figcaption>
    </figure>
  );
}
