import { Reveal } from "@/components/motion/reveal";
import { ActionPanels } from "@/components/sections/action-panels";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { Section } from "@/components/ui/section";
import { media } from "@/config/media";
import { loadManagedPage, metadataForPage } from "@/features/pages";

export async function generateMetadata() {
  return metadataForPage("get-involved");
}

export default async function GetInvolvedPage() {
  const page = await loadManagedPage("get-involved");
  return (
    <>
      <PageHeader
        surface="dark"
        breadcrumbs={<Breadcrumbs current={{ label: "Get involved", href: "/get-involved" }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={<p>{page.lead}</p>}
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
