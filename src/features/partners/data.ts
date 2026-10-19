import type { PartnerInput } from "./schema";

/**
 * Static partner source for M03, replaced by the CMS in M04. Only confirmed
 * partners are listed. Bitwiire Herbarium Cafe is an independent partner:
 * neither organisation owns the other.
 */
export const partnerEntries: readonly PartnerInput[] = [
  {
    slug: "bitwiire-herbarium-cafe",
    status: "published",
    name: "Bitwiire Herbarium Cafe",
    relationship: "independent-partner",
    description:
      "An independent partner of EACH. Bitwiire Herbarium Cafe and EACH are separate organisations; neither owns the other.",
    href: "/bitwiire-herbarium-cafe",
  },
];
