import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";

type SequenceNavProps = {
  /** For example "Next programme". */
  label: string;
  title: string;
  href: string;
  description?: string;
};

/** Large link to the next page in a series, closing a page and continuing the journey. */
export function SequenceNav({ label, title, href, description }: SequenceNavProps) {
  return (
    <nav aria-label={label} className="border-t border-border">
      <Container>
        <Link
          href={href}
          className="group/next flex flex-col gap-6 rounded-sm py-section-sm md:flex-row md:items-end md:justify-between"
        >
          <span>
            <span className="block text-eyebrow font-medium text-primary uppercase">{label}</span>
            <span className="mt-5 block font-display text-display-lg font-light text-balance decoration-1 underline-offset-[0.15em] group-hover/next:underline">
              {title}
            </span>
            {description ? (
              <span className="mt-5 block max-w-xl leading-7 text-muted-foreground">
                {description}
              </span>
            ) : null}
          </span>
          <span
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-(--motion-duration-base) group-hover/next:border-foreground group-hover/next:bg-foreground group-hover/next:text-background md:size-20"
          >
            <ArrowRightIcon className="size-6 transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/next:translate-x-1" />
          </span>
        </Link>
      </Container>
    </nav>
  );
}
