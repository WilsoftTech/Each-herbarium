import type { SeedPartner } from "./types";

/**
 * Initial partners, migrated from the M03 static source. Only confirmed
 * partners are listed. Bitwiire Herbarium Cafe is an independent partner:
 * neither organisation owns the other.
 */
export const seedPartners: readonly SeedPartner[] = [
  {
    slug: "bitwiire-herbarium-cafe",
    placeholder: false,
    name: "Bitwiire Herbarium Cafe",
    relationship: "independent-partner",
    description:
      "An independent partner of EACH. Bitwiire Herbarium Cafe and EACH are separate organisations; neither owns the other.",
    href: "/bitwiire-herbarium-cafe",
  },
];
