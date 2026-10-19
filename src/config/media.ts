import type { z } from "zod";
import type { mediaAssetSchema } from "@/validation/content";

/**
 * Photography registry. Every image records its source and licence, and the
 * credit is shown wherever the image appears.
 *
 * These are openly licensed stand-ins from Wikimedia Commons, used until EACH
 * supplies its own photography. They show East African places and plants but
 * are not EACH's work, sites, projects or collections. Licences:
 * public/images/README.md.
 */
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

const ccBySa4 = {
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
};
const ccBySa3 = {
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
};
const ccBy4 = { license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const media = {
  heroBwindiMist: {
    src: "/images/hero-bwindi-mist.jpg",
    width: 2560,
    height: 1707,
    alt: "Mist rising over forested hills in Bwindi Impenetrable Forest, south-western Uganda.",
    caption: "Bwindi Impenetrable Forest, Uganda",
    credit: {
      author: "Giles Laurent",
      ...ccBySa4,
      sourceUrl: commons(
        "063_Mist_rising_from_the_Bwindi_Impenetrable_Forest_National_Park_Photo_by_Giles_Laurent.jpg",
      ),
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
      ...ccBySa4,
      sourceUrl: commons("Upper_Kachope_Lake_vegetation.jpg"),
    },
  },
  rwenzoriGroundselValley: {
    src: "/images/rwenzori-kachope-valley.jpg",
    width: 2000,
    height: 1500,
    alt: "A valley above the Kachope Lakes in the Rwenzori Mountains, filled with thickets of giant tree groundsels.",
    caption: "Tree groundsels (Dendrosenecio adnivalis), Rwenzori Mountains",
    credit: {
      author: "Rafał Kozubek",
      ...ccBySa4,
      sourceUrl: commons("Valley_above_Kachope_Lakes.jpg"),
    },
  },
  rwenzoriMountSpeke: {
    src: "/images/rwenzori-mount-speke-groundsels.jpg",
    width: 2400,
    height: 1344,
    alt: "A giant groundsel in the foreground with the snow-capped summit of Mount Speke behind, Rwenzori Mountains.",
    caption: "Mount Speke and giant groundsels, Rwenzori Mountains National Park, Uganda",
    credit: {
      author: "Albert Backer",
      ...ccBySa3,
      sourceUrl: commons("Mt.Speke2008.jpg"),
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
      ...ccBy4,
      sourceUrl: commons("Eclipta_alba_(GBIF_4602174741).jpg"),
    },
  },
  herbariumSheetCuscuta: {
    src: "/images/herbarium-sheet-cuscuta-kigezi.jpg",
    width: 1200,
    height: 1600,
    alt: "Pressed herbarium specimen of the twining parasitic plant Cuscuta epilinum, mounted with its handwritten collection label.",
    caption: "Cuscuta epilinum, collected in Kigezi, Uganda, in 1949; imaged at Kew",
    credit: {
      author: "Royal Botanic Gardens, Kew",
      ...ccBy4,
      sourceUrl: commons("Cuscuta_epilinum_(GBIF_5082951611).jpg"),
    },
  },
  herbariumSheetCallistemon: {
    src: "/images/herbarium-sheet-callistemon-kampala.jpg",
    width: 1200,
    height: 1614,
    alt: "Pressed herbarium specimen of a willow bottlebrush branch with narrow leaves, mounted with a Flora of Uganda label.",
    caption:
      "Callistemon salignus, collected on Makerere University Hill, Kampala, in 1971; imaged at Kew",
    credit: {
      author: "Royal Botanic Gardens, Kew",
      ...ccBy4,
      sourceUrl: commons("Callistemon_salignus_(GBIF_4853844971).jpg"),
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
      ...ccBySa3,
      sourceUrl: commons("Budongo_forest.jpg"),
    },
  },
  mabiraStream: {
    src: "/images/mabira-forest-stream.jpg",
    width: 2000,
    height: 1500,
    alt: "A clear stream running over mossy rocks between ferns and broad-leaved plants in Mabira Forest, Uganda.",
    caption: "A stream in Mabira Forest, Uganda",
    credit: {
      author: "Ivan Odongo (Stnts256)",
      ...ccBySa4,
      sourceUrl: commons("A_stream_in_Mabira_Forest.jpg"),
    },
  },
  elgonMontaneForest: {
    src: "/images/elgon-montane-forest.jpg",
    width: 2000,
    height: 1343,
    alt: "Dense montane forest with tall trees and a thick green understorey on Mount Elgon.",
    caption: "Montane forest, Mount Elgon National Park (Kenyan side)",
    credit: {
      author: "Josep M. Gracia",
      ...ccBySa4,
      sourceUrl: commons("ELGON_-_Montane_forest_in_Mount_Elgon_National_Park,_Kenya,_2012.jpg"),
    },
  },
  papyrusSwamp: {
    src: "/images/papyrus-swamp-fog.jpg",
    width: 2400,
    height: 1354,
    alt: "Morning fog over a dense stand of papyrus reeds in a swamp, with trees fading into the mist behind.",
    caption: "Papyrus swamp in fog, western Uganda",
    credit: {
      author: "BalukuBrian",
      ...ccBySa4,
      sourceUrl: commons("Fog_over_papyrus_reeds_in_a_swamp_in_western_Uganda.jpg"),
    },
  },
  kidepoEuphorbia: {
    src: "/images/kidepo-euphorbia-candelabrum.jpg",
    width: 2400,
    height: 1800,
    alt: "Candelabra euphorbia trees on a rocky outcrop, reflected in a still pool of water.",
    caption: "Euphorbia candelabrum, Kidepo Valley National Park, Uganda",
    credit: {
      author: "Sjoerd",
      ...ccBySa4,
      sourceUrl: commons("Cactus_in_Kidepo_Vally_National_park.jpg"),
    },
  },
  kidepoSavanna: {
    src: "/images/kidepo-valley-savanna.jpg",
    width: 2000,
    height: 1500,
    alt: "Open grassland with scattered trees stretching towards a range of mountains under a blue sky.",
    caption: "Savanna in Kidepo Valley National Park, Uganda",
    credit: {
      author: "Sandra Aceng",
      ...ccBySa4,
      sourceUrl: commons("Landscape_of_Kidepo_Valley_National_Park_in_Uganda.jpg"),
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
      ...ccBySa4,
      sourceUrl: commons("Semuliki_National_Park_Vegetation.jpg"),
    },
  },
  lakeBunyonyi: {
    src: "/images/lake-bunyonyi-hills.jpg",
    width: 2400,
    height: 1350,
    alt: "Terraced, cultivated hillsides and patches of trees above Lake Bunyonyi, under white clouds.",
    caption: "Hills above Lake Bunyonyi, Kabale District, Uganda",
    credit: {
      author: "Sjoerdug",
      ...ccBySa4,
      sourceUrl: commons("View_of_Lake_Bunyonyi_in_Kabaale_District.jpg"),
    },
  },
  warburgiaLeaves: {
    src: "/images/warburgia-ugandensis-leaves.jpg",
    width: 1600,
    height: 1200,
    alt: "Glossy, narrow green leaves crowded along the branches of a Uganda greenheart tree.",
    caption: "Leaves of Uganda greenheart (Warburgia ugandensis)",
    credit: {
      author: "Jens-Christian Svenning",
      ...ccBy4,
      sourceUrl: commons(
        "Uganda_Greenheart_imported_from_iNaturalist_photo_153670805_on_24_June_2024.jpg",
      ),
    },
  },
} as const satisfies Record<string, MediaAsset>;
