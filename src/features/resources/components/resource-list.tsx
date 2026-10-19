import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PendingContent } from "@/components/ui/pending-content";
import { cn } from "@/lib/utils";
import { resourceTypeLabel, type Resource } from "../schema";

/** "12 March 2026", or a clear "Date to be confirmed". */
export function formatResourceDate(published: string | null): string {
  if (!published) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${published}T00:00:00Z`));
}

type ResourceListProps = {
  resources: readonly Resource[];
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Publication-style index: type and date in a narrow column, the title as the
 * link, then the summary. Each row is fully clickable.
 */
export function ResourceList({
  resources,
  headingLevel: Heading = "h3",
  className,
}: ResourceListProps) {
  return (
    <ol className={cn("border-b border-border", className)}>
      {resources.map((resource) => (
        <li key={resource.slug} data-reveal className="border-t border-border">
          <article className="group/row relative grid gap-4 py-8 md:grid-cols-12 md:gap-8">
            <div className="flex flex-wrap items-center gap-3 text-sm md:col-span-3 md:flex-col md:items-start">
              <span className="text-eyebrow font-medium text-primary uppercase">
                {resourceTypeLabel[resource.type]}
              </span>
              <span className="text-muted-foreground">
                {formatResourceDate(resource.published)}
              </span>
              {resource.status === "placeholder" ? (
                <PendingContent item="resources" variant="badge" />
              ) : null}
            </div>
            <div className="md:col-span-8">
              <Heading className="font-display text-heading text-balance">
                <Link
                  href={`/resources/${resource.slug}`}
                  className="rounded-sm decoration-1 underline-offset-[0.2em] group-hover/row:underline after:absolute after:inset-0 after:content-['']"
                >
                  {resource.title}
                </Link>
              </Heading>
              <p className="mt-3 max-w-2xl leading-7 text-pretty text-muted-foreground">
                {resource.summary}
              </p>
            </div>
            <ArrowRightIcon className="hidden size-5 self-center justify-self-end text-primary transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/row:translate-x-1 md:col-span-1 md:block" />
          </article>
        </li>
      ))}
    </ol>
  );
}
