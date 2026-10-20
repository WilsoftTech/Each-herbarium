import "server-only";
import { z } from "zod";
import {
  formData,
  pageCount,
  pageWindow,
  type ListParams,
  type WorkflowCollection,
} from "@/features/cms";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import { slugSchema } from "@/validation/content";
import { partnerSchema } from "../schema";

type Db = PrismaClient | Prisma.TransactionClient;

export const partnerInputSchema = z.object({
  name: z.string().min(1, "Enter the organisation's name.").max(200),
  slug: slugSchema,
  description: z.string().min(1, "Enter a verified description.").max(1000),
  href: z
    .string()
    .regex(/^\/[a-z0-9/-]*$/, "Use a path on this site, such as /bitwiire-herbarium-cafe.")
    .nullable(),
  websiteUrl: z.url({ protocol: /^https$/, error: "Use a full https:// address." }).nullable(),
  sortOrder: z.number("Enter a whole number.").int().min(0).max(10_000),
  placeholder: z.boolean(),
});

export type PartnerInput = z.infer<typeof partnerInputSchema>;

export function readPartnerForm(form: FormData) {
  const { text, optionalText, checkbox, integer } = formData;
  return {
    name: text(form, "name"),
    slug: text(form, "slug"),
    description: text(form, "description"),
    href: optionalText(form, "href"),
    websiteUrl: optionalText(form, "websiteUrl"),
    sortOrder: integer(form, "sortOrder"),
    placeholder: checkbox(form, "placeholder"),
  };
}

export const partnerWorkflow: WorkflowCollection = {
  collection: "partners",
  label: "Partner",
  async find(db, id) {
    const row = await db.partner.findUnique({
      where: { id },
      select: { id: true, slug: true, status: true, version: true, name: true },
    });
    return (
      row && {
        id: row.id,
        slug: row.slug,
        status: row.status,
        version: row.version,
        label: row.name,
      }
    );
  },
  updateStatus(db, id, version, change) {
    return db.partner.updateMany({
      where: { id, version },
      data: { ...change, version: { increment: 1 } },
    });
  },
  remove(db, id) {
    return db.partner.delete({ where: { id } });
  },
  async checkPublishable(db, id) {
    const row = await db.partner.findUnique({ where: { id } });
    if (!row) return "This partner no longer exists.";
    const result = partnerSchema.safeParse({
      ...row,
      status: row.placeholder ? "placeholder" : "published",
    });
    return result.success ? null : "Some details do not meet the publishing rules.";
  },
};

export async function listPartnersForAdmin(params: ListParams) {
  const search: Prisma.PartnerWhereInput = params.q
    ? {
        OR: [
          { name: { contains: params.q, mode: "insensitive" } },
          { slug: { contains: params.q.toLowerCase() } },
        ],
      }
    : {};
  const where: Prisma.PartnerWhereInput = { ...search, status: params.status };
  const db = getDb();
  const [rows, total, grouped] = await Promise.all([
    db.partner.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      ...pageWindow(params.page),
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        placeholder: true,
        updatedAt: true,
      },
    }),
    db.partner.count({ where }),
    db.partner.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
  ]);
  return {
    rows: rows.map(({ name, ...row }) => ({ ...row, title: name })),
    pageCount: pageCount(total),
    counts: Object.fromEntries(grouped.map((group) => [group.status, group._count._all])),
  };
}

export function getPartnerForAdmin(id: string, db: Db = getDb()) {
  return db.partner.findUnique({ where: { id } });
}

export type PartnerForAdmin = NonNullable<Awaited<ReturnType<typeof getPartnerForAdmin>>>;
