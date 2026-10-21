import { MediaCard } from "@/components/ui/media-card";
import { MapPinIcon } from "@/components/ui/icons";
import { PendingContent } from "@/components/ui/pending-content";
import { cn } from "@/lib/utils";
import type { Project } from "../schema";

/** Ecosystem and place, or a clear "to be confirmed" when EACH has not supplied the place. */
export function ProjectLocation({ project }: { project: Project }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>{project.ecosystem}</span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1">
        <MapPinIcon className="size-3.5" />
        {project.location ?? "Location to be confirmed"}
      </span>
    </span>
  );
}

type ProjectCardsProps = {
  projects: readonly Project[];
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Image-led published project cards in a staggered editorial row. Samples
 * are omitted; an empty collection retains its informative pending state.
 */
export function ProjectCards({ projects, headingLevel = "h3", className }: ProjectCardsProps) {
  const verified = projects.filter((project) => project.status === "published");
  if (!verified.length) {
    return (
      <div className={cn("space-y-5", className)}>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          A conservation case study needs a documented purpose, location, period and evidence of
          results. Sample records are omitted from this listing; they are not evidence of
          EACH&apos;s activities.
        </p>
        <PendingContent item="projects" />
      </div>
    );
  }
  return (
    <div className={cn("grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3", className)}>
      {verified.map((project, index) => (
        <MediaCard
          key={project.slug}
          href={`/projects/${project.slug}`}
          title={project.title}
          description={project.summary}
          image={project.image}
          headingLevel={headingLevel}
          meta={<ProjectLocation project={project} />}
          badge={
            project.operationalStatus === "planned" ? (
              "Planned"
            ) : project.status === "placeholder" ? (
              <PendingContent item="projects" variant="badge" className="border-foreground/60" />
            ) : undefined
          }
          cta={project.operationalStatus === "planned" ? "Explore project plan" : "View case study"}
          className={cn(index % 3 === 1 && "lg:mt-16", index % 3 === 2 && "lg:mt-32")}
        />
      ))}
    </div>
  );
}
