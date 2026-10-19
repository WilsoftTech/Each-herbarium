import "server-only";
import { partnerEntries } from "./data";
import { partnerSchema, type Partner } from "./schema";

const partners: readonly Partner[] = partnerSchema.array().parse(partnerEntries);

/** Confirmed partners, in display order. */
export async function listPartners(): Promise<readonly Partner[]> {
  return partners;
}
