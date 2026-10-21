import changes from "../../docs/content/approved-content.json";
import type { Prisma } from "@/generated/prisma/client";
import { mergeReviewChanges } from "./review-content";

export const approvedFooterNote =
  "Reference photographs are credited alongside each image. Starter projects are planned; official contact and location details are being confirmed.";

/** Client-approved editorial defaults. Existing rows change only via the CMS workflow. */
export function approvedChanges(
  collection: "pages" | "programmes",
  slug: string,
): Prisma.InputJsonObject {
  return (changes.find((entry) => entry.collection === collection && entry.slug === slug)
    ?.changes ?? {}) as Prisma.InputJsonObject;
}

export function approvedSections<T>(
  collection: "pages" | "programmes",
  slug: string,
  content: T,
): T {
  const patch = approvedChanges(collection, slug).content;
  return mergeReviewChanges(
    content as Prisma.InputJsonObject,
    (patch ?? {}) as Prisma.InputJsonObject,
  ) as T;
}

export function approvedRecord<T>(collection: "pages" | "programmes", slug: string, record: T): T {
  return mergeReviewChanges(
    record as Prisma.InputJsonObject,
    approvedChanges(collection, slug),
  ) as T;
}
