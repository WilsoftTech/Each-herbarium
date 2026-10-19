import "server-only";
import { resourceEntries } from "./data";
import { resourceSchema, type Resource } from "./schema";

// Validated once, the way M04 will validate rows read from the database.
const resources: readonly Resource[] = resourceSchema.array().parse(resourceEntries);

/** All resources, newest first; undated entries last. */
export async function listResources(): Promise<readonly Resource[]> {
  return [...resources].sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));
}

export async function getResource(slug: string): Promise<Resource | undefined> {
  return resources.find((resource) => resource.slug === slug);
}
