import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/config/media";
import { listPartners, PartnerList } from "@/features/partners";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Partners",
  description:
    "The organisations EACH works alongside, including its independent partner Bitwiire Herbarium Cafe.",
  path: "/about/partners",
  image: media.semulikiVegetation,
});

export default async function PartnersPage() {
  const partners = await listPartners();
  const trail = [{ label: "About EACH", href: "/about" }];

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs trail={trail} current={{ label: "Partners", href: "/about/partners" }} />
        }
        eyebrow="Partners"
        title="Working alongside others"
        lead={
          <p>
            Conservation depends on collaboration. Every organisation listed here is independent:
            partnership never means that one organisation owns or runs another.
          </p>
        }
      />

      <Section aria-labelledby="confirmed-title" className="pt-0">
        <Reveal>
          <Container>
            <SectionHeading id="confirmed-title" eyebrow="Confirmed" title="Our partners" />
            <div className="mt-12">
              <PartnerList partners={partners} />
            </div>
            <PendingContent item="partners" className="mt-12" />
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="partner-cta-title">
        <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            id="partner-cta-title"
            eyebrow="Partner with us"
            title="Interested in working with EACH?"
            description="Research institutions, community organisations and conservation groups can explore how to collaborate."
          />
          <Button asChild size="lg" className="self-start md:self-end">
            <Link href="/partnerships">
              Partnerships
              <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
