import { media } from "@/config/media";
import type { ResourceInput } from "./schema";

/**
 * Static resource source for M03, replaced by the CMS in M04.
 *
 * EACH has not published any resources yet. These placeholders show how a
 * publication, a guide and a story will be listed and read. They are labelled
 * on every page, are not indexed and have no authors, dates or text.
 */
export const resourceEntries: readonly ResourceInput[] = [
  {
    slug: "placeholder-publication",
    status: "placeholder",
    type: "publication",
    title: "Placeholder publication",
    summary:
      "Shows how an EACH publication will be listed, with its authors, date, abstract and download.",
    published: null,
    authors: [],
    image: media.herbariumSheetCallistemon,
    body: [],
  },
  {
    slug: "placeholder-field-guide",
    status: "placeholder",
    type: "guide",
    title: "Placeholder field guide",
    summary: "Shows how a guide for students, volunteers or visitors will be presented.",
    published: null,
    authors: [],
    image: media.rwenzoriVegetation,
    body: [],
  },
  {
    slug: "placeholder-field-story",
    status: "placeholder",
    type: "story",
    title: "Placeholder story from the field",
    summary: "Shows how news and stories from EACH's work will be told.",
    published: null,
    authors: [],
    image: media.budongoTree,
    body: [],
  },
];
