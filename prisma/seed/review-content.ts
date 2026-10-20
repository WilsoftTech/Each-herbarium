import type { Prisma } from "@/generated/prisma/client";

/** Apply a reviewed field patch to a copy for a pending revision, never a live row. */
export function mergeReviewChanges(
  current: Prisma.InputJsonObject,
  changes: Prisma.InputJsonObject,
): Prisma.InputJsonObject {
  const result = { ...current };
  for (const [key, value] of Object.entries(changes)) {
    const before = current[key];
    result[key] =
      before &&
      value &&
      typeof before === "object" &&
      typeof value === "object" &&
      !Array.isArray(before) &&
      !Array.isArray(value)
        ? mergeReviewChanges(before as Prisma.InputJsonObject, value as Prisma.InputJsonObject)
        : value;
  }
  return result;
}
