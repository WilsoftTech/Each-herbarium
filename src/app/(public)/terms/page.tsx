import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms of use",
  description: "Terms for using the EACH website. Draft awaiting legal review.",
  path: "/terms",
});

// Draft for legal review (`legalPolicies`).
export default function TermsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Terms of use", href: "/terms" }} />}
        eyebrow="Policies"
        title="Terms of use"
        lead={<p>The terms for using this website.</p>}
        aside={<PendingContent item="legalPolicies" />}
      />
      <Section aria-label="Terms of use" className="pt-0">
        <Container>
          <Prose>
            <h2>About this website</h2>
            <p>
              This website is published by East African Community Herbariums (EACH). The
              organisation&apos;s legal details will be added here.
            </p>
            <h2>Content in development</h2>
            <p>
              Parts of this website are still being prepared. Content marked as a placeholder or
              draft has not been approved by EACH and should not be relied on.
            </p>
            <h2>Not medical advice</h2>
            <p>
              Information about plants, including plants used in traditional medicine, is provided
              for education and conservation. It is not medical advice. Speak to a qualified health
              professional about any health concern.
            </p>
            <h2>Photographs and other material</h2>
            <p>
              Many photographs on this website are by third parties and are used under Creative
              Commons licences. Each is credited where it appears, with a link to its licence, and
              may be reused under the terms of that licence. The EACH name and logo may not be used
              without permission.
            </p>
            <h2>Links</h2>
            <p>This website links to other websites. EACH is not responsible for their content.</p>
            <h2>Changes and contact</h2>
            <p>
              These terms may change as the website develops. Questions can be sent through the{" "}
              <Link href="/contact">contact page</Link> once contact details are published.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  );
}
