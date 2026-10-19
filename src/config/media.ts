/**
 * Photography registry. Every image records its source and licence, and the
 * credit is shown wherever the image appears.
 *
 * These are openly licensed stand-ins from Wikimedia Commons, used until EACH
 * supplies its own photography. They show East African places and plants but
 * are not EACH's work or collections. Licences: public/images/README.md.
 */
export type MediaAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Short caption describing what and where. */
  caption: string;
  credit: {
    author: string;
    license: string;
    licenseUrl: string;
    sourceUrl: string;
  };
};

export const media = {
  heroBwindiMist: {
    src: "/images/hero-bwindi-mist.jpg",
    width: 2560,
    height: 1707,
    alt: "Mist rising over forested hills in Bwindi Impenetrable Forest, south-western Uganda.",
    caption: "Bwindi Impenetrable Forest, Uganda",
    credit: {
      author: "Giles Laurent",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:063_Mist_rising_from_the_Bwindi_Impenetrable_Forest_National_Park_Photo_by_Giles_Laurent.jpg",
    },
  },
  rwenzoriVegetation: {
    src: "/images/rwenzori-kachope-vegetation.jpg",
    width: 1600,
    height: 1200,
    alt: "Giant lobelias, ferns and Hypericum trees above Upper Kachope Lake in the Rwenzori Mountains.",
    caption: "Afromontane vegetation, Rwenzori Mountains",
    credit: {
      author: "Rafał Kozubek",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Upper_Kachope_Lake_vegetation.jpg",
    },
  },
  herbariumSheet: {
    src: "/images/herbarium-sheet-uganda.jpg",
    width: 1200,
    height: 1600,
    alt: "Pressed herbarium specimen of Eclipta prostrata collected in Uganda in 1994, mounted on a sheet with its collection label.",
    caption: "Herbarium specimen collected in Uganda, imaged at Kew",
    credit: {
      author: "Royal Botanic Gardens, Kew",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Eclipta_alba_(GBIF_4602174741).jpg",
    },
  },
  budongoTree: {
    src: "/images/budongo-forest-tree.jpg",
    width: 1200,
    height: 1600,
    alt: "Looking up the buttressed trunk of a large tree into the canopy of Budongo Forest, Uganda.",
    caption: "Budongo Forest, Uganda",
    credit: {
      author: "Dror Feitelson",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Budongo_forest.jpg",
    },
  },
  semulikiVegetation: {
    src: "/images/semuliki-vegetation.jpg",
    width: 1600,
    height: 1067,
    alt: "Tall grasses in front of a forested hillside in Semuliki National Park, Uganda.",
    caption: "Semuliki National Park, Uganda",
    credit: {
      author: "Timothy Akolamazima",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Semuliki_National_Park_Vegetation.jpg",
    },
  },
} as const satisfies Record<string, MediaAsset>;
