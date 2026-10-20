import { z } from "zod";
import { contentStatusSchema, mediaAssetSchema, slugSchema } from "@/validation/content";

export const teamGroupSchema = z.enum(["leadership", "board", "adviser"]);
export type TeamGroup = z.infer<typeof teamGroupSchema>;

export const teamGroupLabel: Record<TeamGroup, string> = {
  leadership: "Leadership team",
  board: "Board",
  adviser: "Advisers",
};

/** A published team member. Only people who agreed to appear are ever published. */
export const teamMemberSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  group: teamGroupSchema,
  name: z.string().min(1),
  roleTitle: z.string().min(1),
  bio: z.array(z.string().min(1)),
  photo: mediaAssetSchema.nullable(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
