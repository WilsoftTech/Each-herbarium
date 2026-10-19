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
import { media } from "@/config/media";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Volunteer",
  description:
    "Volunteer with EACH: the kinds of field, herbarium, education and digital work volunteers may help with.",
  path: "/volunteer",
  image: media.budongoTree,
});

// Indicative areas, not confirmed roles (pending: `volunteerRoles`).
const areas = [
  {
    title: "Field work",
    body: "Supporting surveys and plant collecting, under the guidance of trained botanists.",
  },
  {
    title: "Herbarium work",
    body: "Helping to press, mount, label and catalogue specimens.",
  },
  {
    title: "Education and outreach",
    body: "Sharing plant knowledge with schools, visitors and communities.",
  },
  {
    title: "Digital and communications",
    body: "Imaging specimens, managing data, writing and photography.",
  },
] as const;

export default function VolunteerPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            trail={[{ label: "Get involved", href: "/get-involved" }]}
            current={{ label: "Volunteer", href: "/volunteer" }}
          />
        }
        eyebrow="Get involved"
        title="Volunteer with EACH"
        lead={
          <p>Give your time and skills to help document and protect East Africa&apos;s plants.</p>
        }
        image={media.elgonMontaneForest}
      />

      <Section aria-labelledby="areas-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="areas-title"
                eyebrow="Ways to help"
                title="Where volunteers may contribute"
                description="These are the kinds of work volunteers could support. Confirmed opportunities will be listed here."
              />
              <PendingContent
                item="volunteerRoles"
                variant="badge"
                className="self-start md:self-end"
              />
            </div>
          </Container>
        </Reveal>
        <Container className="mt-16">
          <NumberedList items={areas} columns={2} />
        </Container>
      </Section>

      <Section surface="muted" aria-labelledby="next-title" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="next-title"
              eyebrow="Next steps"
              title="Registering your interest"
            />
          </div>
          <div className="space-y-6 lg:col-span-7">
            <Notice title="The volunteer form is not available yet">
              <p>
                An online form will be added soon. Until then, see the{" "}
                <Link href="/contact" className="text-primary underline underline-offset-4">
                  contact page
                </Link>
                .
              </p>
            </Notice>
            <PendingContent item="volunteerRoles" />
          </div>
        </Container>
      </Section>

      <SequenceNav
        label="Get involved"
        title="Partnerships"
        href="/partnerships"
        description="Collaborate with EACH as an institution or organisation."
      />
    </>
  );
}
