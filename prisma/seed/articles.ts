import { media } from "@/config/media";
import type { SeedArticle } from "./types";
import { learningGuides } from "./learning-guides";

/**
 * Initial articles (publications, guides, stories), migrated from the M03
 * static source. EACH has not published any yet: these placeholders show how
 * each type is listed and read. They are labelled on every page, are not
 * indexed and have no authors, dates or text.
 */
export const seedArticles: readonly SeedArticle[] = [
  ...learningGuides,
  {
    slug: "placeholder-publication",
    placeholder: true,
    type: "PUBLICATION",
    title: "Placeholder publication",
    summary:
      "Shows how an EACH publication will be listed, with its authors, date, abstract and download.",
    publishedOn: null,
    authors: [],
    image: media.herbariumSheetCallistemon,
    body: [],
  },
  {
    slug: "placeholder-field-guide",
    placeholder: true,
    type: "GUIDE",
    title: "Placeholder field guide",
    summary: "Shows how a guide for students, volunteers or visitors will be presented.",
    publishedOn: null,
    authors: [],
    image: media.rwenzoriVegetation,
    body: [],
  },
  {
    slug: "placeholder-field-story",
    placeholder: true,
    type: "STORY",
    title: "Placeholder story from the field",
    summary: "Shows how news and stories from EACH's work will be told.",
    publishedOn: null,
    authors: [],
    image: media.budongoTree,
    body: [],
  },
];
