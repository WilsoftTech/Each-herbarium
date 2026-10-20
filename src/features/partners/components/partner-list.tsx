import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Partner } from "../schema";

const relationshipLabel: Record<Partner["relationship"], string> = {
  "independent-partner": "Independent partner",
};

/** Confirmed partners with their relationship to EACH stated explicitly. */
export function PartnerList({ partners }: { partners: readonly Partner[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {partners.map((partner) => (
        <li key={partner.slug} data-reveal>
          <article className="group/partner relative h-full rounded-sm border border-border bg-card p-8 transition-colors duration-(--motion-duration-base) hover:border-foreground/40">
            <p className="text-eyebrow font-medium text-primary uppercase">
              {relationshipLabel[partner.relationship]}
            </p>
            <h3 className="mt-4 font-display text-heading">
              {partner.href ? (
                <Link
                  href={partner.href}
                  className="rounded-sm decoration-1 underline-offset-4 group-hover/partner:underline after:absolute after:inset-0 after:content-['']"
                >
                  {partner.name}
                </Link>
              ) : partner.websiteUrl ? (
                <a
                  href={partner.websiteUrl}
                  rel="noopener noreferrer"
                  className="rounded-sm decoration-1 underline-offset-4 group-hover/partner:underline after:absolute after:inset-0 after:content-['']"
                >
                  {partner.name}
                </a>
              ) : (
                partner.name
              )}
            </h3>
            <p className="mt-3 leading-7 text-pretty text-muted-foreground">
              {partner.description}
            </p>
            {partner.href || partner.websiteUrl ? (
              <ArrowRightIcon className="mt-6 size-5 text-primary transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/partner:translate-x-1" />
            ) : null}
          </article>
        </li>
      ))}
    </ul>
  );
}
