import { DownloadIcon } from "@/components/ui/icons";
import { PendingContent } from "@/components/ui/pending-content";
import { cn } from "@/lib/utils";
import type { Download } from "../schema";
import { formatFileSize, formatResourceDate } from "./resource-list";

type DownloadListProps = {
  downloads: readonly Download[];
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Standalone documents, in the same index style as the resource list. Each row downloads its file. */
export function DownloadList({
  downloads,
  headingLevel: Heading = "h3",
  className,
}: DownloadListProps) {
  return (
    <ol className={cn("border-b border-border", className)}>
      {downloads.map((download) => (
        <li key={download.slug} data-reveal className="border-t border-border">
          <article className="group/row relative grid gap-4 py-8 md:grid-cols-12 md:gap-8">
            <div className="flex flex-wrap items-center gap-3 text-sm md:col-span-3 md:flex-col md:items-start">
              <span className="text-eyebrow font-medium text-primary uppercase">Download</span>
              <span className="text-muted-foreground">
                {formatResourceDate(download.published)}
              </span>
              {download.status === "placeholder" ? (
                <PendingContent item="resources" variant="badge" />
              ) : null}
            </div>
            <div className="md:col-span-8">
              <Heading className="font-display text-heading text-balance">
                <a
                  href={download.document.src}
                  download
                  className="rounded-sm decoration-1 underline-offset-[0.2em] group-hover/row:underline after:absolute after:inset-0 after:content-['']"
                >
                  {download.title}
                  <span className="sr-only">
                    {" "}
                    (PDF, {formatFileSize(download.document.byteSize)})
                  </span>
                </a>
              </Heading>
              <p className="mt-3 max-w-2xl leading-7 text-pretty text-muted-foreground">
                {download.summary}
              </p>
              <p aria-hidden="true" className="mt-3 text-sm text-muted-foreground">
                PDF · {formatFileSize(download.document.byteSize)}
              </p>
            </div>
            <DownloadIcon className="hidden size-5 self-center justify-self-end text-primary md:col-span-1 md:block" />
          </article>
        </li>
      ))}
    </ol>
  );
}
