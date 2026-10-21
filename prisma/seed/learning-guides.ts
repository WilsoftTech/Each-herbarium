import { media } from "@/config/media";
import type { SeedArticle } from "./types";

/** New, client-authorised website guides. These are not historical research publications. */
export const learningGuides: readonly SeedArticle[] = [
  {
    slug: "understanding-herbarium-records",
    placeholder: false,
    type: "GUIDE",
    title: "Understanding a herbarium record",
    summary:
      "An introduction to specimens, labels and traceable botanical information. This website guide makes no claim about EACH specimen holdings.",
    publishedOn: "2026-10-21",
    authors: ["East African Community Herbariums"],
    image: media.herbariumSheetCuscuta,
    body: [
      "## A specimen and its context",
      "A herbarium record connects preserved plant material with information about its identity and collection. The material and label support later checking; a photograph alone cannot establish every identification or collection detail.",
      "## Reading carefully",
      "Look for the scientific identification, collector, collection date, locality and repository information. Names and identifications may change as records are reviewed. Keep the source and any uncertainty attached to the information.",
      "## Reference material on this website",
      "The attributed sheets shown here illustrate herbarium methods. They are not EACH specimens. This guide is introductory website material, not a research paper or a report of completed collecting.",
    ],
    references: [
      "[Royal Botanic Gardens, Kew — Access the Herbarium](https://www.kew.org/science/engage/accessing-our-science/access-our-collections/herbarium)",
    ],
  },
  {
    slug: "responsible-plant-documentation",
    placeholder: false,
    type: "GUIDE",
    title: "Responsible plant documentation",
    summary:
      "Practical principles for keeping botanical information traceable, distinguishing observations from conclusions and respecting permissions.",
    publishedOn: "2026-10-21",
    authors: ["East African Community Herbariums"],
    image: media.rwenzoriVegetation,
    body: [
      "## Keep the evidence with the record",
      "Record where information came from and distinguish a direct observation from a copied record or an interpretation. Check the identification and preserve uncertainty rather than presenting a guess as a confirmed result.",
      "## Prepare before collecting",
      "Observation does not provide permission to collect. Any field activity needs appropriate expertise, access arrangements and any applicable permits. Sensitive locations should not be disclosed merely because a record can be shared.",
      "## Build useful records",
      "A clear record should identify the organism and the observation's context. Use consistent fields and review records for missing information, duplication and rights before sharing. No dataset publication or field survey by EACH is claimed in this guide.",
    ],
    references: [
      "[GBIF — occurrence data quality requirements](https://www.gbif.org/data-quality-requirements-occurrences)",
    ],
  },
  {
    slug: "knowledge-consent-and-attribution",
    placeholder: false,
    type: "GUIDE",
    title: "Knowledge, consent and attribution",
    summary:
      "An introduction to respectful preparation for discussions about plant knowledge, with attention to permission, restricted information and fair arrangements.",
    publishedOn: "2026-10-21",
    authors: ["East African Community Herbariums"],
    image: media.lakeBunyonyi,
    body: [
      "## Begin with the knowledge holders",
      "Discuss the purpose and intended uses of any documentation in an accessible way before seeking permission. Participation must not be inferred from a conversation, a photograph or a public reference to a community.",
      "## Agree what may be shared",
      "People and communities may place limits on recording, attribution and reuse. Agree those limits, who may access the material and how requests to change permission will be handled. Some knowledge is not appropriate for publication.",
      "## Establish fair arrangements",
      "The Convention on Biological Diversity's Nagoya Protocol addresses traditional knowledge associated with genetic resources, including consent and mutually agreed terms in accordance with domestic law. Applicable requirements and benefit-sharing arrangements need to be established for the particular activity. This guide is educational and does not assert that EACH has obtained any community's consent.",
    ],
    references: [
      "[Convention on Biological Diversity — Nagoya Protocol Article 7](https://www.cbd.int/abs/text/articles?sec=abs-07)",
      "[Convention on Biological Diversity — Nagoya Protocol Article 12](https://www.cbd.int/abs/text/articles?sec=abs-12)",
    ],
  },
];
