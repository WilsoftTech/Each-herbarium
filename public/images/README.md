# Photography

Openly licensed **stand-in** photography from Wikimedia Commons, used until EACH supplies its own images ([ADR 0005](../../docs/decisions/0005-interim-photography.md)). These photographs show East African places and plants. They are **not** EACH's work, sites or collections, and must never be captioned as if they were.

Every image is registered in `src/config/media.ts` with its alt text, caption and credit. The credit is shown wherever the image appears, as the licences require.

Files were downloaded as Commons renditions, then only resized and re-encoded (`sharp`, JPEG). They were not cropped, recoloured or otherwise edited. `object-fit: cover` crops them visually at display time.

| File                              | Subject                                                                                  | Author                     | Licence      | Source                                                                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-bwindi-mist.jpg`            | Mist rising from Bwindi Impenetrable Forest National Park, Uganda (2560×1707)            | Giles Laurent              | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:063_Mist_rising_from_the_Bwindi_Impenetrable_Forest_National_Park_Photo_by_Giles_Laurent.jpg) |
| `rwenzori-kachope-vegetation.jpg` | Vegetation above Upper Kachope Lake, Rwenzori Mountains (1600×1200)                      | Rafał Kozubek              | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Upper_Kachope_Lake_vegetation.jpg)                                                         |
| `herbarium-sheet-uganda.jpg`      | Herbarium specimen of _Eclipta prostrata_, collected in Uganda in 1994 (1200×1600)       | Royal Botanic Gardens, Kew | CC BY 4.0    | [Commons](<https://commons.wikimedia.org/wiki/File:Eclipta_alba_(GBIF_4602174741).jpg>)                                                      |
| `budongo-forest-tree.jpg`         | Large tree in Budongo Forest, Murchison Falls National Park, Uganda (1200×1600)          | Dror Feitelson             | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Budongo_forest.jpg)                                                                        |
| `semuliki-vegetation.jpg`         | Grassland and forested hillside, Semuliki National Park, Uganda (1600×1067)              | Timothy Akolamazima        | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Semuliki_National_Park_Vegetation.jpg)                                                     |

Licence metadata was read from the Commons API (`extmetadata`) on 2026-10-19.

The herbarium sheet is a specimen held by the Missouri Botanical Garden Herbarium and imaged at Kew. The sheet carries Kew's own "copyright reserved" scale bar. Commons and GBIF publish the image under CC BY 4.0, which is the licence relied on here.
