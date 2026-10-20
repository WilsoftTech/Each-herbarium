import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import proposals from "../../docs/content/cms-review-proposals.json";
import { seedLandingContent } from "../../prisma/seed/landing-content";
import { seedHomeContent, seedLandingPages } from "../../prisma/seed/landing-pages";
import { seedPages } from "../../prisma/seed/pages";
import { seedProgrammeContent } from "../../prisma/seed/programme-content";
import { seedProgrammes } from "../../prisma/seed/programmes";
import { mergeReviewChanges } from "../../prisma/seed/review-content";
import { pendingContent } from "@/content/pending";
import { pageInputSchema } from "@/features/pages/admin/admin";
import { pickFeatured } from "@/features/pages/components/home-page";
import { homeContentSchema } from "@/features/pages/home-content";
import { isLandingSlug, landingContentSchema } from "@/features/pages/landing-content";
import { listProjects, ProjectCards } from "@/features/projects";
import { programmeInputSchema } from "@/features/programmes/admin/admin";
import {
  designedProgrammeSchema,
  isDesignedProgrammeSlug,
} from "@/features/programmes/designed-content";
import { listResources, ResourceList } from "@/features/resources";
import type { Prisma } from "@/generated/prisma/client";

describe("client-review proposals", () => {
  it("reconciles exactly the original 22 keys and includes every proposed word in the review", () => {
    expect([...new Set(proposals.map((item) => item.key))].sort()).toEqual(
      Object.keys(pendingContent).sort(),
    );
    expect(Object.keys(pendingContent)).toHaveLength(22);
    const review = readFileSync("docs/content/CLIENT-CONTENT-REVIEW.md", "utf8");
    for (const item of proposals) {
      expect(review).toContain(item.wording);
      expect(item.required.length).toBeGreaterThan(20);
      expect(item.evidence.length).toBeGreaterThan(20);
      expect(item.status).not.toBe("RESOLVED — VERIFIED");
    }
  });

  it("patches fit the existing CMS editor and designed-section schemas", () => {
    const imageId = (asset: { src: string }) => asset.src;
    const landing = seedLandingContent(imageId);
    const programmes = seedProgrammeContent(imageId);
    for (const proposal of proposals) {
      if (!Object.keys(proposal.changes).length) continue;
      const changes = proposal.changes as Prisma.InputJsonObject;
      if (proposal.collection === "pages") {
        const page = [...seedLandingPages, ...seedPages].find(
          (item) => item.slug === proposal.slug,
        )!;
        const content =
          proposal.slug === "home"
            ? seedHomeContent(imageId)
            : isLandingSlug(proposal.slug)
              ? landing[proposal.slug]
              : {};
        const input = mergeReviewChanges(
          {
            ...page,
            heroImage: undefined,
            heroImageId: page.heroImage?.src ?? null,
            seoTitle: page.seoTitle ?? null,
            noindex: false,
            content,
          },
          changes,
        );
        expect(pageInputSchema.safeParse(input).success, proposal.key).toBe(true);
        if (proposal.slug === "home") homeContentSchema.parse(input.content);
        else if (isLandingSlug(proposal.slug))
          landingContentSchema(proposal.slug).parse(input.content);
      } else {
        const programme = seedProgrammes.find((item) => item.slug === proposal.slug)!;
        const content = isDesignedProgrammeSlug(proposal.slug) ? programmes[proposal.slug] : {};
        const input = mergeReviewChanges(
          {
            ...programme,
            image: undefined,
            imageId: programme.image.src,
            sortOrder: 0,
            placeholder: false,
            category: "",
            objectives: [],
            body: "",
            featured: false,
            seoTitle: null,
            seoDescription: programme.seoDescription ?? null,
            noindex: false,
            content,
          },
          changes,
        );
        expect(programmeInputSchema.safeParse(input).success, proposal.key).toBe(true);
        if (isDesignedProgrammeSlug(proposal.slug))
          designedProgrammeSchema(proposal.slug).parse(input.content);
      }
    }
  });

  it("builds a separate revision without mutating live data or replacing unrelated edits", () => {
    const live = {
      title: "Client-edited title",
      content: {
        facts: { founded: "", region: "Client-edited region" },
        imageId: "existing-media",
      },
    };
    const original = structuredClone(live);
    const draft = mergeReviewChanges(live, {
      content: { facts: { history: "Proposed introduction" } },
    });
    expect(live).toEqual(original);
    expect(draft).toEqual({
      ...live,
      content: {
        ...live.content,
        facts: { ...live.content.facts, history: "Proposed introduction" },
      },
    });
  });
});

describe("public collection presentation", () => {
  it("selects real homepage records before applying the featured limit", () => {
    const sample = { featured: true, status: "placeholder" };
    const approved = { featured: false, status: "published" };
    expect(pickFeatured([sample, sample, sample, approved])).toEqual([approved]);
    expect(pickFeatured([sample])).toEqual([]);
  });
  it("omits sample projects and provides a controlled informative state", async () => {
    const samples = (await listProjects()).filter((item) => item.status === "placeholder");
    expect(samples.length).toBeGreaterThan(0);
    const html = renderToStaticMarkup(<ProjectCards projects={samples} />);
    expect(html).toContain('data-pending="projects"');
    expect(html).toContain("documented purpose");
    for (const sample of samples) expect(html).not.toContain(`/projects/${sample.slug}`);
    const approved = {
      ...samples[0]!,
      slug: "verified-project",
      status: "published" as const,
      title: "Verified project",
    };
    const mixed = renderToStaticMarkup(<ProjectCards projects={[...samples, approved]} />);
    expect(mixed).toContain("/projects/verified-project");
    expect(mixed).not.toContain(`/projects/${samples[0]!.slug}`);
  });

  it("omits sample resources while preserving approved resources", async () => {
    const samples = (await listResources()).filter((item) => item.status === "placeholder");
    expect(samples.length).toBeGreaterThan(0);
    const html = renderToStaticMarkup(<ResourceList resources={samples} />);
    expect(html).toContain('data-pending="resources"');
    expect(html).toContain("not EACH publications");
    const approved = {
      ...samples[0]!,
      slug: "verified-guide",
      status: "published" as const,
      title: "Verified guide",
    };
    const mixed = renderToStaticMarkup(<ResourceList resources={[...samples, approved]} />);
    expect(mixed).toContain("/resources/verified-guide");
    expect(mixed).not.toContain(`/resources/${samples[0]!.slug}`);
  });
});
