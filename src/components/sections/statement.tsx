import Link from "next/link";
import { ScrollText } from "@/components/motion/scroll-text";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";

type StatementProps = {
  id: string;
  eyebrow: string;
  /** Large statement that brightens word by word on scroll. Approved or clearly drafted copy only. */
  text: string;
  /** Supporting paragraph beneath the statement. */
  detail?: string;
  action?: { label: string; href: string };
  surface?: "light" | "muted" | "dark" | "warm";
};

/** A single large editorial statement, used to introduce a page or section. */
export function Statement({ id, eyebrow, text, detail, action, surface = "dark" }: StatementProps) {
  return (
    <Section id={id} surface={surface} aria-labelledby={`${id}-title`}>
      <Container>
        <h2 id={`${id}-title`} className="text-eyebrow font-medium text-primary uppercase">
          {eyebrow}
        </h2>
        <ScrollText
          text={text}
          className="mt-8 max-w-5xl font-display text-display-lg font-light text-balance"
        />
        {detail || action ? (
          <div className="mt-12 grid gap-8 md:grid-cols-12">
            {detail ? (
              <p className="text-lead text-pretty text-muted-foreground md:col-span-7 md:col-start-6">
                {detail}
              </p>
            ) : null}
            {action ? (
              <Link
                href={action.href}
                className="group/link inline-flex items-center gap-2 self-start rounded-sm font-medium text-primary md:col-span-7 md:col-start-6"
              >
                <span className="underline-offset-4 group-hover/link:underline">
                  {action.label}
                </span>
                <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/link:translate-x-1" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
