import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isUsable, mediaSelect, toMediaAsset } from "@/features/media";
import { contentTags } from "@/lib/cache-tags";
import { getDb } from "@/services/db";
import { teamMemberSchema, type TeamMember } from "./schema";

/** Published team members with consent, grouped order: leadership, board, advisers. */
export async function listTeamMembers(): Promise<TeamMember[]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTags.team, contentTags.media);

  const rows = await getDb().teamMember.findMany({
    where: { status: "PUBLISHED", consentConfirmed: true },
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    include: { photo: { select: mediaSelect } },
    take: 100,
  });
  return rows.map((row) =>
    teamMemberSchema.parse({
      slug: row.slug,
      status: row.placeholder ? "placeholder" : "published",
      group: row.group.toLowerCase(),
      name: row.name,
      roleTitle: row.roleTitle,
      bio: row.bio,
      photo: isUsable(row.photo) ? toMediaAsset(row.photo) : null,
    }),
  );
}
