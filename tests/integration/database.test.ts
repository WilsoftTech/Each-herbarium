import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { getDb } from "@/services/db";
import { testSchemaUrl } from "../test-database";
import { createUser } from "./helpers";
import { seedProgrammes } from "../../prisma/seed/programmes";
import { seedPages } from "../../prisma/seed/pages";

/** Runs raw SQL and returns the database error message, or null on success. */
async function sqlError(sql: string): Promise<string | null> {
  try {
    await getDb().$executeRawUnsafe(sql);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

describe("migration integrity", () => {
  it("the migrations produce exactly the schema in schema.prisma (no drift)", () => {
    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    // --exit-code: 0 when the diff is empty, 2 when it is not.
    const output = execFileSync(
      npx,
      [
        "prisma",
        "migrate",
        "diff",
        "--from-config-datasource",
        "--to-schema",
        "prisma/schema.prisma",
        "--exit-code",
      ],
      {
        env: { ...process.env, DATABASE_URL_UNPOOLED: testSchemaUrl() },
        encoding: "utf8",
        shell: process.platform === "win32",
      },
    );
    expect(output).toMatch(/No difference detected/i);
  });

  it("seeding again changes nothing (create-only)", async () => {
    const db = getDb();
    const count = async () => ({
      media: await db.mediaAsset.count({ where: { storage: "STATIC" } }),
      programmes: await db.programme.count({
        where: { slug: { in: seedProgrammes.map(({ slug }) => slug) } },
      }),
      articles: await db.article.count({ where: { placeholder: true } }),
      pages: await db.page.count({ where: { slug: { in: seedPages.map(({ slug }) => slug) } } }),
    });
    const before = await count();
    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    execFileSync(npx, ["tsx", "prisma/seed.ts"], {
      env: process.env,
      stdio: "pipe",
      shell: process.platform === "win32",
    });
    expect(await count()).toEqual(before);
    expect(before).toEqual({ media: 16, programmes: 4, articles: 3, pages: 3 });
  }, 180_000);
});

describe("database constraints", () => {
  it("rejects malformed slugs", async () => {
    expect(
      await sqlError(
        `UPDATE "partners" SET "slug" = 'Not A Slug' WHERE "slug" = 'bitwiire-herbarium-cafe'`,
      ),
    ).toMatch(/partners_slug_format/);
  });

  it("rejects published rows without a publication time", async () => {
    expect(
      await sqlError(`UPDATE "programmes" SET "published_at" = NULL WHERE "status" = 'PUBLISHED'`),
    ).toMatch(/programmes_published_at/);
  });

  it("rejects unknown roles and partner relationships", async () => {
    const user = await createUser("editor");
    expect(await sqlError(`UPDATE "users" SET "role" = 'owner' WHERE "id" = '${user.id}'`)).toMatch(
      /users_role_valid/,
    );
    expect(await sqlError(`UPDATE "partners" SET "relationship" = 'owned-by-each'`)).toMatch(
      /partners_relationship_valid/,
    );
  });

  it("never publishes a team member without consent", async () => {
    expect(
      await sqlError(
        `INSERT INTO "team_members" ("id","slug","status","name","role_title","published_at","updated_at","consent_confirmed")
         VALUES ('t1','no-consent','PUBLISHED','Someone','Role',now(),now(),false)`,
      ),
    ).toMatch(/team_members_consent_to_publish/);
  });

  it("keeps exactly one settings row", async () => {
    expect(
      await sqlError(`INSERT INTO "site_settings" ("id","updated_at") VALUES (2, now())`),
    ).toMatch(/site_settings_singleton/);
  });

  it("keeps the audit trail append-only", async () => {
    const event = await getDb().auditEvent.findFirstOrThrow();
    expect(
      await sqlError(`UPDATE "audit_events" SET "summary" = 'changed' WHERE "id" = '${event.id}'`),
    ).toMatch(/append-only/);
    expect(await sqlError(`DELETE FROM "audit_events" WHERE "id" = '${event.id}'`)).toMatch(
      /append-only/,
    );
  });

  it("refuses to delete media that content still uses", async () => {
    const used = await getDb().programme.findFirstOrThrow({ select: { imageId: true } });
    expect(await sqlError(`DELETE FROM "media_assets" WHERE "id" = '${used.imageId}'`)).toMatch(
      /foreign key|violates/i,
    );
  });
});
