import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { media } from "@/config/media";
import { pendingContent } from "@/content/pending";
import { programmes } from "@/content/programmes";
import { listPartners } from "@/features/partners";
import { listProjects, projectSchema } from "@/features/projects";
import { listResources, resourceSchema } from "@/features/resources";
import { mediaAssetSchema } from "@/validation/content";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.tsx?$/.test(name) ? [path] : [];
  });
}

const source = sourceFiles("src")
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

describe("media registry", () => {
  it("satisfies the media contract and has a licence README entry for every file", () => {
    const readme = readFileSync("public/images/README.md", "utf8");
    for (const [key, asset] of Object.entries(media)) {
      expect(mediaAssetSchema.safeParse(asset).success, key).toBe(true);
      expect(readme, asset.src).toContain(asset.src.replace("/images/", ""));
    }
  });
});

describe("content contracts", () => {
  it("projects and resources validate, with unique slugs", async () => {
    const projects = await listProjects();
    const resources = await listResources();
    for (const project of projects) expect(projectSchema.parse(project)).toEqual(project);
    for (const resource of resources) expect(resourceSchema.parse(resource)).toEqual(resource);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(resources.map((r) => r.slug)).size).toBe(resources.length);
  });

  it("placeholders invent no institutional facts", async () => {
    for (const project of await listProjects()) {
      if (project.status !== "placeholder") continue;
      expect(project.title).toMatch(/^Placeholder/);
      expect(project.summary).toContain("does not describe an EACH project");
      expect(project.location).toBeNull();
      expect(project.period).toBeNull();
      expect(project.partners).toEqual([]);
      expect(project.story).toEqual([]);
    }
    for (const resource of await listResources()) {
      if (resource.status !== "placeholder") continue;
      expect(resource.title).toMatch(/^Placeholder/);
      expect(resource.published).toBeNull();
      expect(resource.authors).toEqual([]);
      expect(resource.body).toEqual([]);
    }
  });

  it("lists Bitwiire Herbarium Cafe only as an independent partner", async () => {
    const partners = await listPartners();
    const bitwiire = partners.find((partner) => partner.slug === "bitwiire-herbarium-cafe");
    expect(bitwiire?.relationship).toBe("independent-partner");
    expect(bitwiire?.description).toMatch(/neither owns the other/);
  });

  it("gives every programme a page under /our-work", () => {
    for (const programme of programmes) {
      expect(programme.href).toBe(`/our-work/${programme.slug}`);
    }
  });
});

describe("pending content register", () => {
  const keys = Object.keys(pendingContent);
  const doc = readFileSync("docs/content/awaiting-approval.md", "utf8");

  it("is documented in docs/content/awaiting-approval.md", () => {
    for (const key of keys) expect(doc, key).toContain(`\`${key}\``);
  });

  it("has no unused entries: every key is shown somewhere on the site", () => {
    for (const key of keys) expect(source, key).toMatch(new RegExp(`item="${key}"`));
  });
});
