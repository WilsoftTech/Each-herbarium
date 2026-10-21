import { approvedRecord } from "./approved-content";
import type { SeedPage } from "./types";

/**
 * Policy pages, migrated word for word from the M03 page components into the
 * CMS rich-text format (src/lib/rich-text.ts). Historical defaults below are
 * overlaid with client-approved wording before new records are seeded.
 */
const originalPages: readonly SeedPage[] = [
  {
    slug: "privacy",
    title: "Privacy",
    description: "How the EACH website handles personal information. Draft awaiting legal review.",
    eyebrow: "Policies",
    lead: "How this website handles information about you.",
    body: `## What this website collects today
This website does not ask for any personal information. It has no forms, accounts or newsletter sign-up, and it does not use cookies, analytics or advertising trackers.

## Technical information
Like any website, the servers that deliver it may record standard technical information, such as your IP address, browser type and the pages requested, to keep the service secure and working. The hosting arrangements and how long these records are kept will be confirmed here.

## Links to other websites
Photograph credits link to Wikimedia Commons, and specimen records link to GBIF. Those websites have their own privacy policies.

## When forms are added
Before any contact, volunteer or partnership form goes live, this policy will be updated to explain what is collected, why, who can see it, how long it is kept and how to ask for it to be deleted.

## Your rights
Depending on where you live, data protection law, such as Uganda's Data Protection and Privacy Act, 2019, gives you rights over your personal information, including the right to access and correct it.

## Who is responsible
The organisation responsible for this website, and how to contact it about privacy, will be named here. See also the [contact page](/contact).`,
  },
  {
    slug: "terms",
    title: "Terms of use",
    description: "Terms for using the EACH website. Draft awaiting legal review.",
    eyebrow: "Policies",
    lead: "The terms for using this website.",
    body: `## About this website
This website is published by East African Community Herbariums (EACH). The organisation's legal details will be added here.

## Content in development
Parts of this website are still being prepared. Content marked as a placeholder or draft has not been approved by EACH and should not be relied on.

## Not medical advice
Information about plants, including plants used in traditional medicine, is provided for education and conservation. It is not medical advice. Speak to a qualified health professional about any health concern.

## Photographs and other material
Many photographs on this website are by third parties and are used under Creative Commons licences. Each is credited where it appears, with a link to its licence, and may be reused under the terms of that licence. The EACH name and logo may not be used without permission.

## Links
This website links to other websites. EACH is not responsible for their content.

## Changes and contact
These terms may change as the website develops. Questions can be sent through the [contact page](/contact) once contact details are published.`,
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    description:
      "How the EACH website is built to be usable by everyone, how it is tested, and its known limitations.",
    eyebrow: "Policies",
    lead: "We want everyone to be able to use this website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
    body: `## What we have done
- Pages use headings, landmarks and lists so that their structure is clear.
- Everything can be used with a keyboard, focus is always visible, and a skip link leads to the main content.
- Images have text alternatives, or are marked as decorative.
- Text colours are chosen and measured for sufficient contrast.
- Animation is reduced when your device asks for reduced motion, and no animation hides content or takes over scrolling.
- All content can be read with JavaScript turned off.

## How we test
Every page is checked automatically with the axe accessibility engine during development. Keyboard use, reduced motion and pages without JavaScript are tested in a real browser.

## Known limitations
- The site has not yet been tested by people using screen readers.
- The EACH logo is currently available only as a small photographic image, which can be hard to read at small sizes.
- Some content is still being prepared and is marked as a placeholder or draft.

## Feedback
If something on this website does not work for you, we would like to know. A contact for accessibility feedback will be published here.`,
  },
];

export const seedPages = originalPages.map((page) => approvedRecord("pages", page.slug, page));
