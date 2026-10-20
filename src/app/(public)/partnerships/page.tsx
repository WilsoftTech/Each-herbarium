import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { NumberedList } from "@/components/sections/numbered-list";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("partnerships");
}

// Draft partnership types (pending: `partnershipModel`).
const types = [
  {
    title: "Research and academic",
    body: "Universities, herbaria and research institutes working on East African botany.",
  },
  {
    title: "Community organisations",
    body: "Groups who hold and care for local plant knowledge and landscapes.",
  },
  {
    title: "Conservation organisations",
    body: "Organisations protecting habitats and species across the region.",
  },
  {
    title: "Education and hospitality",
    body: "Places that welcome the public and help people learn about plants.",
  },
] as const;

export default async function PartnershipsPage() {
  const page = await loadManagedPage("partnerships");
  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Get involved", href: "/get-involved" }]}
            current={{ label: "Partnerships", href: "/partnerships" }}
          />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
        image={page.image ?? undefined}
      />

      <Section aria-labelledby="types-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="types-title"
                eyebrow="Who we work with"
                title="Kinds of partnership"
              />
              <PendingContent
                item="partnershipModel"
                variant="badge"
                className="self-start md:self-end"
              />
            </div>
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={types} columns={2} />
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="approach-title" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="approach-title"
              eyebrow="Next steps"
              title="Starting a conversation"
            />
          </div>
          <div className="space-y-6 lg:col-span-7">
            <Notice title="The partnership enquiry form is not available yet">
              <p>
                An online form will be added soon. Until then, see the{" "}
                <Link href="/contact" className="text-primary underline underline-offset-4">
                  contact page
                </Link>
                , or read about our{" "}
                <Link href="/about/partners" className="text-primary underline underline-offset-4">
                  current partners
                </Link>
                .
              </p>
            </Notice>
            <PendingContent item="partnershipModel" />
          </div>
        </Container>
      </Section>

      <SequenceNav
        label="Get involved"
        title="Contact"
        href="/contact"
        description="Start a conversation with EACH."
      />
    </>
  );
}
