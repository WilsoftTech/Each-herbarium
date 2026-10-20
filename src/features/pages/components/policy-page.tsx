import type { ReactNode } from "react";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import type { Page } from "../schema";

type PolicyPageProps = {
  page: Page;
  /** Shown beside the lead, e.g. a "draft for review" notice. */
  aside?: ReactNode;
  /** Shown after the text. */
  footer?: ReactNode;
};

/** Layout of a CMS prose page: header, then the text in the reading column. */
export function PolicyPage({ page, aside, footer }: PolicyPageProps) {
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs current={{ label: page.title, href: `/${page.slug}` }} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead ? <p>{page.lead}</p> : undefined}
        aside={aside}
      />
      <Section aria-label={page.title} className="pt-0">
        <Container>
          <RichText source={page.body} />
          {footer}
        </Container>
      </Section>
    </>
  );
}
