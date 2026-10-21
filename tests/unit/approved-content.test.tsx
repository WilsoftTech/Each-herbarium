import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import approved from "../../docs/content/approved-content.json";
import { starterProjects } from "../../prisma/seed/starter-projects";
import { learningGuides } from "../../prisma/seed/learning-guides";
import { seedLandingContent } from "../../prisma/seed/landing-content";
import { seedProgrammeContent } from "../../prisma/seed/programme-content";
import { PendingContent } from "@/components/ui/pending-content";
import { pendingContent } from "@/content/pending";
import { landingContentSchema, isLandingSlug } from "@/features/pages/landing-content";
import {
  designedProgrammeSchema,
  isDesignedProgrammeSlug,
} from "@/features/programmes/designed-content";
import { listProjects } from "@/features/projects";
import { listResources } from "@/features/resources";

describe("client-approved implementation", () => {
  it("retains only contact and location notices", () => {
    const outstanding = Object.entries(pendingContent)
      .filter(([, item]) => item.kind !== "approved")
      .map(([key]) => key);
    expect(outstanding.sort()).toEqual([
      "accessibilityContact",
      "bitwiireProfile",
      "contactDetails",
      "regionalPresence",
    ]);
    expect(renderToStaticMarkup(<PendingContent item="missionStatement" />)).toBe("");
    expect(renderToStaticMarkup(<PendingContent item="contactDetails" />)).toContain(
      'data-pending="contactDetails"',
    );
  });

  it("approved section defaults satisfy the existing declarations", () => {
    const pages = seedLandingContent((asset) => asset.src);
    const programmes = seedProgrammeContent((asset) => asset.src);
    for (const entry of approved) {
      if (entry.collection === "pages" && isLandingSlug(entry.slug))
        landingContentSchema(entry.slug).parse(pages[entry.slug]);
      if (entry.collection === "programmes" && isDesignedProgrammeSlug(entry.slug))
        designedProgrammeSchema(entry.slug).parse(programmes[entry.slug]);
    }
    expect(pages["about-mission"].statement.marker).toBe(false);
    expect(programmes["medicinal-plants"].approach.marker).toBe(false);
  });

  it("starter projects are substantive plans with no invented operating facts", async () => {
    const projects = await listProjects();
    for (const plan of starterProjects) {
      const project = projects.find((item) => item.slug === plan.slug)!;
      expect(project).toBeDefined();
      expect(project.status).toBe("published");
      expect(project.operationalStatus).toBe("planned");
      expect(project.location).toBeNull();
      expect(project.country).toBeNull();
      expect(project.startDate).toBeNull();
      expect(project.endDate).toBeNull();
      expect(project.period).toBeNull();
      expect(project.partners).toEqual([]);
      expect(project.outcomes).toEqual([]);
      expect(project.objectives.length).toBeGreaterThan(0);
      expect(project.activities.length).toBeGreaterThan(0);
      expect(project.story.length).toBeGreaterThan(0);
    }
  });

  it("publishes attributed educational website guides rather than fictional research papers", async () => {
    const resources = await listResources();
    for (const guide of learningGuides) {
      const resource = resources.find((item) => item.slug === guide.slug)!;
      expect(resource?.status).toBe("published");
      expect(resource.type).toBe("guide");
      expect(resource.body.length).toBeGreaterThan(0);
      expect(resource.references.length).toBeGreaterThan(0);
    }
  });
});
