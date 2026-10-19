import { media, type MediaAsset } from "@/config/media";

/**
 * Reference specimens: openly licensed images of real herbarium sheets
 * collected in Uganda. They illustrate what a specimen record is. They are
 * not EACH's collections. Label data is transcribed from each image's
 * Wikimedia Commons record (which cites its GBIF occurrence).
 */
export type ReferenceSpecimen = {
  id: string;
  image: MediaAsset;
  taxon: string;
  /** Name the sheet is filed under, when it differs from the accepted name. */
  filedAs?: string;
  locality: string;
  collected: string;
  collector: string;
  record: { label: string; href: string };
};

export const referenceSpecimens = [
  {
    id: "eclipta",
    image: media.herbariumSheet,
    taxon: "Eclipta prostrata",
    filedAs: "Eclipta alba",
    locality: "Sonde, east of Namungongo, Kyagwe County, Uganda",
    collected: "3 June 1994",
    collector: "P. K. Rwaburindore",
    record: {
      label: "GBIF occurrence 4602174741",
      href: "https://www.gbif.org/occurrence/4602174741",
    },
  },
  {
    id: "cuscuta",
    image: media.herbariumSheetCuscuta,
    taxon: "Cuscuta epilinum",
    locality: "Nyakageme, Kigezi, Uganda",
    collected: "1 June 1949",
    collector: "J. W. Purseglove",
    record: {
      label: "GBIF occurrence 5082951611",
      href: "https://www.gbif.org/occurrence/5082951611",
    },
  },
  {
    id: "callistemon",
    image: media.herbariumSheetCallistemon,
    taxon: "Callistemon salignus",
    locality: "Makerere University Hill, Kampala, Uganda",
    collected: "10 September 1971",
    collector: "K. A. Lye",
    record: {
      label: "GBIF occurrence 4853844971",
      href: "https://www.gbif.org/occurrence/4853844971",
    },
  },
] as const satisfies readonly ReferenceSpecimen[];
