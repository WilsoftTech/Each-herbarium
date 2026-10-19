import { media, type MediaAsset } from "@/config/media";

/**
 * East Africa's major plant landscapes, told as a scroll story on the
 * homepage and the environmental conservation page. General ecological
 * description only; no claims about EACH's work in these places.
 */
export type Ecosystem = {
  id: string;
  name: string;
  title: string;
  body: readonly string[];
  image: MediaAsset;
};

export const ecosystems = [
  {
    id: "afroalpine",
    name: "Mountains",
    title: "Gardens above the clouds",
    body: [
      "High on the Rwenzori Mountains and East Africa's other great peaks, giant groundsels and giant lobelias grow in the cold, wet afroalpine zone.",
      "Below them, heather and bamboo zones give way to montane forest, each band shaped by altitude, rainfall and frost.",
    ],
    image: media.rwenzoriGroundselValley,
  },
  {
    id: "forest",
    name: "Forests",
    title: "Tropical forests",
    body: [
      "Uganda's forests, from Bwindi and Budongo to Mabira, shelter tall hardwoods, climbers, ferns and a dense understorey of shrubs and herbs.",
      "Streams that rise in the forest carry water to the farms and towns beyond it.",
    ],
    image: media.mabiraStream,
  },
  {
    id: "wetland",
    name: "Wetlands",
    title: "Papyrus wetlands",
    body: [
      "Papyrus swamps fringe many of East Africa's lakes and rivers. They slow and filter water, store carbon in waterlogged peat, and provide materials and food for nearby communities.",
    ],
    image: media.papyrusSwamp,
  },
  {
    id: "savanna",
    name: "Savannas",
    title: "Savannas and drylands",
    body: [
      "In the drier north-east of Uganda, grasslands, open woodland and candelabra euphorbias are adapted to long dry seasons and the occasional fire.",
    ],
    image: media.kidepoEuphorbia,
  },
] as const satisfies readonly Ecosystem[];
