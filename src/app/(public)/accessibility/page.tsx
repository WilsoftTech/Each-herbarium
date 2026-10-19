import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Accessibility",
  description:
    "How the EACH website is built to be usable by everyone, how it is tested, and its known limitations.",
  path: "/accessibility",
});

// Statements below describe the site as built and tested (docs/audits/M03-verification.md).
export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Accessibility", href: "/accessibility" }} />}
        eyebrow="Policies"
        title="Accessibility"
        lead={
          <p>
            We want everyone to be able to use this website. We aim to meet the Web Content
            Accessibility Guidelines (WCAG) 2.2 at level AA.
          </p>
        }
      />
      <Section aria-label="Accessibility statement" className="pt-0">
        <Container>
          <Prose>
            <h2>What we have done</h2>
            <ul>
              <li>Pages use headings, landmarks and lists so that their structure is clear.</li>
              <li>
                Everything can be used with a keyboard, focus is always visible, and a skip link
                leads to the main content.
              </li>
              <li>Images have text alternatives, or are marked as decorative.</li>
              <li>Text colours are chosen and measured for sufficient contrast.</li>
              <li>
                Animation is reduced when your device asks for reduced motion, and no animation
                hides content or takes over scrolling.
              </li>
              <li>All content can be read with JavaScript turned off.</li>
            </ul>
            <h2>How we test</h2>
            <p>
              Every page is checked automatically with the axe accessibility engine during
              development. Keyboard use, reduced motion and pages without JavaScript are tested in a
              real browser.
            </p>
            <h2>Known limitations</h2>
            <ul>
              <li>The site has not yet been tested by people using screen readers.</li>
              <li>
                The EACH logo is currently available only as a small photographic image, which can
                be hard to read at small sizes.
              </li>
              <li>Some content is still being prepared and is marked as a placeholder or draft.</li>
            </ul>
            <h2>Feedback</h2>
            <p>
              If something on this website does not work for you, we would like to know. A contact
              for accessibility feedback will be published here.
            </p>
          </Prose>
          <PendingContent item="accessibilityContact" className="mt-12 max-w-[68ch]" />
        </Container>
      </Section>
    </>
  );
}
