import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { PendingContent } from "@/components/ui/pending-content";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How the EACH website handles personal information. Draft awaiting legal review.",
  path: "/privacy",
});

// Draft: describes what the site does today. Legal review pending (`legalPolicies`).
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Privacy", href: "/privacy" }} />}
        eyebrow="Policies"
        title="Privacy"
        lead={<p>How this website handles information about you.</p>}
        aside={<PendingContent item="legalPolicies" />}
      />
      <Section aria-label="Privacy policy" className="pt-0">
        <Container>
          <Prose>
            <h2>What this website collects today</h2>
            <p>
              This website does not ask for any personal information. It has no forms, accounts or
              newsletter sign-up, and it does not use cookies, analytics or advertising trackers.
            </p>
            <h2>Technical information</h2>
            <p>
              Like any website, the servers that deliver it may record standard technical
              information, such as your IP address, browser type and the pages requested, to keep
              the service secure and working. The hosting arrangements and how long these records
              are kept will be confirmed here.
            </p>
            <h2>Links to other websites</h2>
            <p>
              Photograph credits link to Wikimedia Commons, and specimen records link to GBIF. Those
              websites have their own privacy policies.
            </p>
            <h2>When forms are added</h2>
            <p>
              Before any contact, volunteer or partnership form goes live, this policy will be
              updated to explain what is collected, why, who can see it, how long it is kept and how
              to ask for it to be deleted.
            </p>
            <h2>Your rights</h2>
            <p>
              Depending on where you live, data protection law, such as Uganda&apos;s Data
              Protection and Privacy Act, 2019, gives you rights over your personal information,
              including the right to access and correct it.
            </p>
            <h2>Who is responsible</h2>
            <p>
              The organisation responsible for this website, and how to contact it about privacy,
              will be named here. See also the <Link href="/contact">contact page</Link>.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  );
}
