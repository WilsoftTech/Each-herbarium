import "server-only";
import { pageWindow } from "@/features/cms";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import type { EnquiryKind } from "../schema";

export type EnquiryFilter = { kind?: EnquiryKind; attention?: boolean };

/** Enquiries whose staff notification did not go out. */
const needsAttention: Prisma.InquiryWhereInput = {
  notificationStatus: { in: ["FAILED", "NOT_CONFIGURED", "PENDING"] },
  status: { not: "CLOSED" },
};

/** Newest first. Callers must have checked `enquiries:manage`. */
export async function listEnquiries(page: number, filter: EnquiryFilter = {}) {
  const where: Prisma.InquiryWhereInput = {
    ...(filter.kind ? { kind: filter.kind } : {}),
    ...(filter.attention ? needsAttention : {}),
  };
  const db = getDb();
  const [items, total, attention] = await Promise.all([
    db.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        kind: true,
        status: true,
        topic: true,
        name: true,
        createdAt: true,
        notificationStatus: true,
      },
      ...pageWindow(page),
    }),
    db.inquiry.count({ where }),
    db.inquiry.count({ where: needsAttention }),
  ]);
  return { items, total, attention };
}

export async function getEnquiry(id: string) {
  return getDb().inquiry.findUnique({ where: { id } });
}
