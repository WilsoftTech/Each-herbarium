import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { listIndexablePages, pageRegistry, isManagedPageSlug } from "@/features/pages";
import { listProgrammes } from "@/features/programmes";
import { listProjects } from "@/features/projects";
import { listResources } from "@/features/resources";
import { listTeamMembers } from "@/features/team";

const indexable = (item: { status: string; noindex?: boolean }) =>
  item.status !== "placeholder" && !item.noindex;

/**
 * Published, indexable content only. Drafts, items in review, archived items,
 * placeholders and anything marked "hide from search engines" never appear.
 * Every list is a cached query tagged by collection, so publishing or
 * unpublishing refreshes the sitemap with the pages themselves.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, programmes, projects, resources, team] = await Promise.all([
    listIndexablePages(),
    listProgrammes(),
    listProjects(),
    listResources(),
    listTeamMembers(),
  ]);
  const url = (path: string) => `${env.siteUrl}${path === "/" ? "/" : path}`;
  // The leadership page is noindex until a profile is published (its own metadata).
  const hasLeadership = team.some((member) => member.status === "published");

  return [
    ...pages
      .filter(({ slug }) => isManagedPageSlug(slug))
      .filter(({ slug }) => slug !== "about-leadership" || hasLeadership)
      .map(({ slug, updatedAt }) => ({
        url: url(pageRegistry[slug as keyof typeof pageRegistry].route),
        lastModified: updatedAt,
      })),
    ...programmes.filter(indexable).map((programme) => ({ url: url(programme.href) })),
    ...projects.filter(indexable).map((project) => ({ url: url(`/projects/${project.slug}`) })),
    ...resources.filter(indexable).map((resource) => ({ url: url(`/resources/${resource.slug}`) })),
  ];
}
