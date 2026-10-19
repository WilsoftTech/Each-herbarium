/**
 * Content EACH has not yet supplied or approved. Every placeholder on the site
 * names one of these keys, so the list below is the complete register of what
 * is outstanding. docs/content/awaiting-approval.md mirrors it (a unit test
 * keeps the two in step).
 *
 * `missing`: the information does not exist on the site yet.
 * `draft`: the site shows proposed wording that EACH must confirm or replace.
 */
export type PendingKind = "missing" | "draft";

export type PendingItem = {
  kind: PendingKind;
  title: string;
  /** What EACH needs to provide or confirm. */
  needed: string;
};

export const pendingContent = {
  organisation: {
    kind: "missing",
    title: "Organisation details",
    needed:
      "Legal status, registration number and registered address of EACH, and who is responsible for the website.",
  },
  history: {
    kind: "missing",
    title: "Our story",
    needed: "When, why and by whom EACH was founded, and the milestones reached so far.",
  },
  missionStatement: {
    kind: "draft",
    title: "Mission and vision",
    needed:
      "Approved mission and vision statements. The page uses the approved homepage line and draft wording.",
  },
  values: {
    kind: "draft",
    title: "Values and principles",
    needed: "Confirmation or replacement of the draft principles shown on this page.",
  },
  leadership: {
    kind: "missing",
    title: "Leadership and governance",
    needed:
      "Names, roles, short biographies and photographs of EACH's leadership, board or advisers, with their consent to publish.",
  },
  partners: {
    kind: "missing",
    title: "Partner organisations",
    needed:
      "Confirmed partners other than Bitwiire Herbarium Cafe: names, descriptions, the nature of each partnership, and logos with permission.",
  },
  bitwiireProfile: {
    kind: "missing",
    title: "Bitwiire Herbarium Cafe profile",
    needed:
      "A description approved by Bitwiire, its location and opening hours, photographs, and how the partnership works in practice.",
  },
  programmeDetails: {
    kind: "draft",
    title: "Programme details",
    needed:
      "What each programme does in practice: activities, locations, timelines and partners. Pages currently explain the field in general terms.",
  },
  projects: {
    kind: "missing",
    title: "Conservation projects",
    needed:
      "Real projects: names, locations, dates, partners, objectives, photography and verified outcomes. Placeholder case studies show the layout only.",
  },
  regionalPresence: {
    kind: "missing",
    title: "Regional presence",
    needed:
      "Confirmed sites, districts or countries where EACH works today, and any planned expansion across East Africa.",
  },
  herbariumStatus: {
    kind: "missing",
    title: "Herbarium collection status",
    needed:
      "Whether EACH holds specimens yet, where they are housed, curation standards, accession records and any partner herbaria.",
  },
  researchThemes: {
    kind: "draft",
    title: "Research themes and affiliations",
    needed:
      "Confirmation of the draft research themes, plus any research partners, affiliations and ethics arrangements.",
  },
  resources: {
    kind: "missing",
    title: "Publications, guides and stories",
    needed:
      "Real EACH resources: titles, authors, dates, summaries and files or full text. Placeholder entries show the layout only.",
  },
  impactFigures: {
    kind: "missing",
    title: "Impact figures",
    needed:
      "Confirmation of what EACH will measure, then verified figures, each with its source, method and date. No figures are shown until they are supplied.",
  },
  medicinalReview: {
    kind: "draft",
    title: "Medicinal plants review",
    needed:
      "Review of the medicinal plants page by a qualified botanist or ethnobotanist before publication.",
  },
  communityProtocols: {
    kind: "draft",
    title: "Community partners and protocols",
    needed:
      "The communities EACH works with (with their consent) and the agreed protocols for recording and sharing their knowledge.",
  },
  volunteerRoles: {
    kind: "missing",
    title: "Volunteer opportunities",
    needed:
      "Real opportunities: roles, requirements, locations, time commitment and the safeguarding policy.",
  },
  partnershipModel: {
    kind: "draft",
    title: "Partnership types",
    needed:
      "Confirmation of the draft partnership types and how organisations should approach EACH.",
  },
  contactDetails: {
    kind: "missing",
    title: "Contact details",
    needed:
      "Email address, telephone number, postal address, office hours and official social accounts.",
  },
  legalPolicies: {
    kind: "draft",
    title: "Privacy policy and terms of use",
    needed:
      "Legal review of the draft privacy policy and terms, including the data controller's identity and contact details.",
  },
  accessibilityContact: {
    kind: "missing",
    title: "Accessibility contact",
    needed: "A named contact or address for accessibility feedback, and a target response time.",
  },
  photography: {
    kind: "missing",
    title: "EACH photography",
    needed:
      "EACH's own photographs, with permissions, to replace the openly licensed stand-in images.",
  },
} as const satisfies Record<string, PendingItem>;

export type PendingKey = keyof typeof pendingContent;
