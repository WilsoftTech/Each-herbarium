import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/sections/page-header";
import { SequenceNav } from "@/components/sections/sequence-nav";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { KeyFacts } from "@/components/ui/key-facts";
import { PendingContent } from "@/components/ui/pending-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { listResources, ResourceList } from "@/features/resources";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Research",
  description:
    "Botanical research for East Africa: documenting the flora, assessing conservation status and recording plant knowledge responsibly.",
  path: "/research",
});

// Draft themes for EACH to confirm (pending: `researchThemes`).
const themes = [
  {
    title: "Documenting the flora",
    body: "Recording which plants grow where, backed by herbarium specimens and field data.",
  },
  {
    title: "Conservation status",
    body: "Contributing evidence to assessments of which species are threatened, and why.",
  },
  {
    title: "Ethnobotany",
    body: "Studying how people know and use plants, with the consent and participation of the communities concerned.",
  },
  {
    title: "Ecosystems and change",
    body: "Understanding how land use and a changing climate affect East Africa's plant communities.",
  },
] as const;

export default async function ResearchPage() {
  const publications = (await listResources()).filter((item) => item.type === "publication");

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: "Research", href: "/research" }} />}
        eyebrow="Herbarium & Research"
        title="Botanical research for East Africa"
        lead={
          <p>
            Research turns specimens and field observations into knowledge that can guide
            conservation, teaching and policy.
          </p>
        }
        aside={
          <KeyFacts
            columns={1}
            facts={[
              {
                term: "Research partners",
                value: <PendingContent item="researchThemes" variant="badge" />,
              },
              { term: "Publications", value: <PendingContent item="resources" variant="badge" /> },
            ]}
          />
        }
      />

      <Section aria-labelledby="themes-title" className="pt-0">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-6 border-t border-foreground pt-10 md:flex-row md:items-end">
              <SectionHeading id="themes-title" eyebrow="Themes" title="Areas of research" />
              <PendingContent
                item="researchThemes"
                variant="badge"
                className="self-start md:self-end"
              />
            </div>
            <ol className="mt-12">
              {themes.map((theme, index) => (
                <li
                  key={theme.title}
                  data-reveal
                  className="grid gap-4 border-t border-border py-8 md:grid-cols-12 md:gap-8"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-display-md font-light text-primary tabular-nums md:col-span-2"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-display-md font-light text-balance md:col-span-5">
                    {theme.title}
                  </h3>
                  <p className="text-lead text-pretty text-muted-foreground md:col-span-5">
                    {theme.body}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </Reveal>
      </Section>

      <Section surface="muted" aria-labelledby="publications-title">
        <Reveal>
          <Container>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                id="publications-title"
                eyebrow="Publications"
                title="Papers and reports"
                description="EACH has not published research yet. This placeholder shows how publications will be listed."
              />
              <Link
                href="/resources"
                data-reveal
                className="group/link inline-flex shrink-0 items-center gap-2 rounded-sm font-medium text-primary"
              >
                <span className="underline-offset-4 group-hover/link:underline">All resources</span>
                <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/link:translate-x-1" />
              </Link>
            </div>
            <ResourceList resources={publications} className="mt-12" />
          </Container>
        </Reveal>
      </Section>

      <Section aria-labelledby="collaborate-title" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="collaborate-title"
              eyebrow="Collaborate"
              title="Research partnerships"
              description="Researchers and institutions interested in East African botany can explore partnerships with EACH."
            />
          </div>
          <div className="lg:col-span-7">
            <PendingContent item="researchThemes" />
          </div>
        </Container>
      </Section>

      <SequenceNav
        label="Herbarium & Research"
        title="Resources"
        href="/resources"
        description="Publications, guides and stories."
      />
    </>
  );
}
