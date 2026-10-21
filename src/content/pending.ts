/**
 * Content approval ledger, including all 22 original requirements.
 * The owner reported client approval on 2026-10-21. Approved alternatives do
 * not invent missing facts; absent identities, history and results are omitted.
 * Only contacts (including Bitwiire) and locations retain visible notices.
 * docs/content/awaiting-approval.md mirrors this lifecycle ledger.
 */
export type PendingKind = "missing" | "draft" | "approved";

export type PendingItem = {
  kind: PendingKind;
  title: string;
  /** Original requirement; for approved entries this is historical context only. */
  needed: string;
};

export const pendingContent = {
  organisation: {
    kind: "approved",
    title: "Organisation details",
    needed:
      "Legal status, registration number and registered address of EACH, and who is responsible for the website.",
  },
  history: {
    kind: "approved",
    title: "Our story",
    needed: "When, why and by whom EACH was founded, and the milestones reached so far.",
  },
  missionStatement: {
    kind: "approved",
    title: "Mission and vision",
    needed:
      "Approved mission and vision statements. The page uses the approved homepage line and draft wording.",
  },
  values: {
    kind: "approved",
    title: "Values and principles",
    needed: "Confirmation or replacement of the draft principles shown on this page.",
  },
  leadership: {
    kind: "approved",
    title: "Leadership and governance",
    needed:
      "Names, roles, short biographies and photographs of EACH's leadership, board or advisers, with their consent to publish.",
  },
  partners: {
    kind: "approved",
    title: "Partner organisations",
    needed:
      "Confirmed partners other than Bitwiire Herbarium Cafe: names, descriptions, the nature of each partnership, and logos with permission.",
  },
  bitwiireProfile: {
    kind: "missing",
    title: "Bitwiire contact and visiting details",
    needed:
      "Official Bitwiire contact information, location and opening hours. The independent-partner profile is approved.",
  },
  programmeDetails: {
    kind: "approved",
    title: "Programme details",
    needed:
      "What each programme does in practice: activities, locations, timelines and partners. Pages currently explain the field in general terms.",
  },
  projects: {
    kind: "approved",
    title: "Conservation projects",
    needed:
      "Real projects: names, locations, dates, partners, objectives, photography and verified outcomes. Sample records are omitted from public listings; their detail pages remain labelled.",
  },
  regionalPresence: {
    kind: "missing",
    title: "Locations",
    needed:
      "Confirmed EACH and partner addresses, project locations and field sites. Uganda and the East African focus remain the approved regional context.",
  },
  herbariumStatus: {
    kind: "approved",
    title: "Herbarium collection status",
    needed:
      "Whether EACH holds specimens yet, where they are housed, curation standards, accession records and any partner herbaria.",
  },
  researchThemes: {
    kind: "approved",
    title: "Research themes and affiliations",
    needed:
      "Confirmation of the draft research themes, plus any research partners, affiliations and ethics arrangements.",
  },
  resources: {
    kind: "approved",
    title: "Publications, guides and stories",
    needed:
      "Real EACH resources: titles, authors, dates, summaries and files or full text. Sample entries are omitted from public listings; their detail pages remain labelled.",
  },
  impactFigures: {
    kind: "approved",
    title: "Impact figures",
    needed:
      "Confirmation of what EACH will measure, then verified figures, each with its source, method and date. No figures are shown until they are supplied.",
  },
  medicinalReview: {
    kind: "approved",
    title: "Medicinal plants review",
    needed:
      "Review of the medicinal plants page by a qualified botanist or ethnobotanist before publication.",
  },
  communityProtocols: {
    kind: "approved",
    title: "Community partners and protocols",
    needed:
      "The communities EACH works with (with their consent) and the agreed protocols for recording and sharing their knowledge.",
  },
  volunteerRoles: {
    kind: "approved",
    title: "Volunteer opportunities",
    needed:
      "Real opportunities: roles, requirements, locations, time commitment and the safeguarding policy.",
  },
  partnershipModel: {
    kind: "approved",
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
    kind: "approved",
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
    kind: "approved",
    title: "EACH photography",
    needed:
      "EACH's own photographs, with permissions, to replace the openly licensed stand-in images.",
  },
} as const satisfies Record<string, PendingItem>;

export type PendingKey = keyof typeof pendingContent;
