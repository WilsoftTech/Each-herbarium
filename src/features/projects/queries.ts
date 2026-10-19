import "server-only";
import { projectEntries } from "./data";
import { projectSchema, type Project } from "./schema";

// Validated once, the way M04 will validate rows read from the database.
const projects: readonly Project[] = projectSchema.array().parse(projectEntries);

/** All projects, in display order. */
export async function listProjects(): Promise<readonly Project[]> {
  return projects;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((project) => project.slug === slug);
}

/** Projects linked to a programme, for the programme pages. */
export async function listProjectsForProgramme(programme: string): Promise<readonly Project[]> {
  return projects.filter((project) => project.programmes.some((slug) => slug === programme));
}
