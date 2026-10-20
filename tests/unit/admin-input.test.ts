import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { changePasswordSchema, signInSchema } from "@/features/auth/schema";
import { mediaMetadataSchema } from "@/features/media/admin/admin";
import { pageInputSchema } from "@/features/pages/admin/admin";
import { partnerInputSchema } from "@/features/partners/admin/admin";
import { projectInputSchema } from "@/features/projects/admin/input";
import { articleInputSchema } from "@/features/resources/admin/admin";
import { teamMemberInputSchema } from "@/features/team/admin/admin";
import { slugSchema } from "@/validation/content";
import { findDestructiveStatements } from "../../scripts/check-migrations";

const validProject = {
  title: "Mabira forest restoration",
  slug: "mabira-forest-restoration",
  summary: "Restoring native trees.",
  ecosystem: "Tropical forest",
  location: null,
  period: null,
  placeholder: false,
  sortOrder: 0,
  imageId: "img_1",
  galleryIds: [],
  programmeIds: [],
  partnerIds: [],
  landscapeHeading: "Forest",
  landscapeBody: ["A forest."],
  story: [],
};

describe("slugs", () => {
  it.each(["a", "plant-conservation", "m04-2026"])("accepts %s", (slug) => {
    expect(slugSchema.safeParse(slug).success).toBe(true);
  });
  it.each([
    "",
    "Upper",
    "two--hyphens",
    "-lead",
    "trail-",
    "with space",
    "../etc",
    "a".repeat(121),
    "__none__",
  ])("rejects %j", (slug) => {
    expect(slugSchema.safeParse(slug).success).toBe(false);
  });
});

describe("admin input schemas", () => {
  it("accepts a valid project and rejects invalid ones", () => {
    expect(projectInputSchema.safeParse(validProject).success).toBe(true);
    for (const patch of [
      { title: "" },
      { slug: "Bad Slug" },
      { imageId: "" },
      { sortOrder: Number.NaN },
      { landscapeBody: [] },
      { galleryIds: Array.from({ length: 13 }, (_, index) => `img_${index}`) },
      { story: [{ heading: "", body: ["x"] }] },
    ]) {
      expect(
        projectInputSchema.safeParse({ ...validProject, ...patch }).success,
        JSON.stringify(patch),
      ).toBe(false);
    }
  });

  it("partners: internal paths and https websites only", () => {
    const partner = {
      name: "Partner",
      slug: "partner",
      description: "An independent partner.",
      href: null,
      websiteUrl: null,
      sortOrder: 0,
      placeholder: false,
    };
    expect(partnerInputSchema.safeParse(partner).success).toBe(true);
    expect(partnerInputSchema.safeParse({ ...partner, href: "https://evil.example" }).success).toBe(
      false,
    );
    expect(
      partnerInputSchema.safeParse({ ...partner, websiteUrl: "javascript:alert(1)" }).success,
    ).toBe(false);
    expect(
      partnerInputSchema.safeParse({ ...partner, websiteUrl: "http://plain.example" }).success,
    ).toBe(false);
  });

  it("team members need a known group", () => {
    const member = {
      name: "A Person",
      slug: "a-person",
      roleTitle: "Director",
      group: "LEADERSHIP",
      bio: [],
      photoId: null,
      consentConfirmed: false,
      sortOrder: 0,
      placeholder: false,
    };
    expect(teamMemberInputSchema.safeParse(member).success).toBe(true);
    expect(teamMemberInputSchema.safeParse({ ...member, group: "OWNER" }).success).toBe(false);
  });

  it("articles need a type and a real date", () => {
    const article = {
      type: "STORY",
      title: "A story",
      slug: "a-story",
      summary: "Summary.",
      publishedOn: "2026-10-20",
      authors: [],
      body: [],
      imageId: null,
      documentId: null,
      placeholder: false,
    };
    expect(articleInputSchema.safeParse(article).success).toBe(true);
    expect(articleInputSchema.safeParse({ ...article, publishedOn: "20/10/2026" }).success).toBe(
      false,
    );
    expect(articleInputSchema.safeParse({ ...article, type: "NEWS" }).success).toBe(false);
  });

  it("pages need a search description of at least 30 characters", () => {
    const page = {
      title: "Privacy",
      description: "Too short",
      eyebrow: "Policies",
      lead: "",
      body: "Text",
    };
    expect(pageInputSchema.safeParse(page).success).toBe(false);
    expect(pageInputSchema.safeParse({ ...page, description: "x".repeat(30) }).success).toBe(true);
  });

  it("images need alt text and a caption; documents do not", () => {
    const base = {
      creditAuthor: "EACH",
      license: "All rights reserved",
      licenseUrl: null,
      sourceUrl: null,
    };
    expect(
      mediaMetadataSchema.safeParse({ ...base, kind: "IMAGE", alt: "short", caption: "" }).success,
    ).toBe(false);
    expect(
      mediaMetadataSchema.safeParse({
        ...base,
        kind: "IMAGE",
        alt: "A tall forest tree with a buttressed trunk",
        caption: "Budongo Forest",
      }).success,
    ).toBe(true);
    expect(
      mediaMetadataSchema.safeParse({ ...base, kind: "DOCUMENT", alt: "", caption: "" }).success,
    ).toBe(true);
    expect(
      mediaMetadataSchema.safeParse({
        ...base,
        kind: "DOCUMENT",
        alt: "",
        caption: "",
        sourceUrl: "ftp://x",
      }).success,
    ).toBe(false);
  });

  it("sign-in and password rules", () => {
    expect(signInSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
    const change = {
      currentPassword: "old password 1",
      newPassword: "a new long passphrase",
      confirmPassword: "a new long passphrase",
    };
    expect(changePasswordSchema.safeParse(change).success).toBe(true);
    expect(
      changePasswordSchema.safeParse({ ...change, confirmPassword: "different" }).success,
    ).toBe(false);
    expect(
      changePasswordSchema.safeParse({ ...change, newPassword: "short", confirmPassword: "short" })
        .success,
    ).toBe(false);
  });
});

describe("migration safeguard", () => {
  it("finds no unapproved destructive statements in the committed migrations", () => {
    expect(findDestructiveStatements(path.join("prisma", "migrations"))).toEqual([]);
  });

  it("flags destructive statements unless the migration is approved", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "each-migrations-"));
    mkdirSync(path.join(directory, "001_drop"));
    writeFileSync(
      path.join(directory, "001_drop", "migration.sql"),
      'ALTER TABLE "x" DROP COLUMN "y";',
    );
    mkdirSync(path.join(directory, "002_comment"));
    writeFileSync(
      path.join(directory, "002_comment", "migration.sql"),
      "-- DROP TABLE mentioned in a comment only\nSELECT 1;",
    );
    mkdirSync(path.join(directory, "003_approved"));
    writeFileSync(path.join(directory, "003_approved", "migration.sql"), 'DROP TABLE "old";');
    writeFileSync(
      path.join(directory, "003_approved", "APPROVED_DESTRUCTIVE.md"),
      "Approved by EACH.",
    );

    expect(findDestructiveStatements(directory)).toEqual([
      { migration: "001_drop", statement: "DROP COLUMN" },
    ]);
  });
});
