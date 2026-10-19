import { Reveal } from "@/components/motion/reveal";
import { ActionPanels } from "@/components/sections/action-panels";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { Section } from "@/components/ui/section";
import { media } from "@/config/media";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get involved",
  description:
    "Volunteer, partner or get in touch to help protect East Africa's plant heritage with EACH.",
  path: "/get-involved",
  image: media.semulikiVegetation,
});

export default function GetInvolvedPage() {
  return (
    <>
      <PageHeader
        surface="dark"
        breadcrumbs={<Breadcrumbs current={{ label: "Get involved", href: "/get-involved" }} />}
        eyebrow="Get involved"
        title="Help protect East Africa's plant heritage"
        lead={
          <p>
            Conservation needs many hands and many kinds of knowledge. Find the way of taking part
            that suits you.
          </p>
        }
        aside={
          <Notice title="Online forms are not available yet">
            <p>Sign-up and enquiry forms will be added soon. Each page explains what to expect.</p>
          </Notice>
        }
      />

      <Section surface="dark" aria-label="Ways to take part" className="pt-0">
        <Reveal>
          <Container>
            <ActionPanels
              headingLevel="h2"
              panels={[
                {
                  eyebrow: "Volunteer",
                  title: "Give your time and skills",
                  description: "Field, herbarium, education and digital work.",
                  href: "/volunteer",
                  cta: "Volunteering",
                  image: media.budongoTree,
                },
                {
                  eyebrow: "Partnerships",
                  title: "Collaborate as an organisation",
                  description:
                    "For research institutions, community groups and conservation organisations.",
                  href: "/partnerships",
                  cta: "Partnerships",
                  image: media.kidepoEuphorbia,
                },
                {
                  eyebrow: "Our partner",
                  title: "Bitwiire Herbarium Cafe",
                  description: "An independent partner of EACH.",
                  href: "/bitwiire-herbarium-cafe",
                  cta: "About the partnership",
                  image: media.lakeBunyonyi,
                },
                {
                  eyebrow: "Contact",
                  title: "Start a conversation",
                  description: "Questions, ideas or offers of help.",
                  href: "/contact",
                  cta: "Contact EACH",
                  image: media.mabiraStream,
                },
              ]}
            />
          </Container>
        </Reveal>
      </Section>
    </>
  );
}
