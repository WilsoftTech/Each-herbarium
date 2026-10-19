"use client";

import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PhotoCredit } from "@/components/ui/photo-credit";
import { isActivePath, megaMenuPanelId, type NavItemWithMenu } from "@/config/navigation";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MegaMenuPanelProps = {
  item: NavItemWithMenu;
  pathname: string;
  /** `reveal` wipes the panel open; `crossfade` is used when switching between open menus. */
  mode: "reveal" | "crossfade";
  reduced: boolean;
  onNavigate: () => void;
  onHeightChange: (itemId: string, height: number) => void;
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_CINEMATIC } },
};

/** Full-width panel of one mega menu. Rendered directly after its trigger for a natural tab order. */
export function MegaMenuPanel({
  item,
  pathname,
  mode,
  reduced,
  onNavigate,
  onHeightChange,
}: MegaMenuPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { feature } = item;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const report = () => onHeightChange(item.id, element.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(element);
    return () => observer.disconnect();
  }, [item.id, onHeightChange]);

  // Up and Down arrows move between the panel's links.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = Array.from(ref.current?.querySelectorAll<HTMLElement>("a[href]") ?? []);
    const index = links.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    links[(index + step + links.length) % links.length]?.focus();
  };

  const reveal = mode === "reveal" && !reduced;

  return (
    <m.div
      ref={ref}
      id={megaMenuPanelId(item)}
      data-mega-panel={item.id}
      onKeyDown={onKeyDown}
      className="fixed inset-x-0 top-header text-foreground"
      initial={reveal ? { clipPath: "inset(0% 0% 100% 0%)" } : { opacity: 0 }}
      animate={
        reveal
          ? { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.5, ease: EASE_CINEMATIC } }
          : { opacity: 1, transition: { duration: reduced ? 0.12 : 0.25 } }
      }
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <Container className="max-w-[96rem]">
        <m.div
          className="grid grid-cols-12 gap-x-10 py-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: reveal ? 0.12 : 0.03 }}
        >
          <m.div variants={rise} className={feature ? "col-span-3" : "col-span-4"}>
            <Eyebrow>{item.label}</Eyebrow>
            <p className="mt-5 font-display text-2xl leading-snug text-pretty">{item.summary}</p>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="group/link mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              <span className="underline-offset-4 group-hover/link:underline">
                Explore {item.label}
              </span>
              <ArrowRightIcon className="transition-transform duration-(--motion-duration-base) ease-cinematic group-hover/link:translate-x-1" />
            </Link>
          </m.div>

          <div
            className={cn(
              "grid grid-cols-2 gap-x-10 gap-y-8 border-l border-border pl-10",
              feature ? "col-span-5" : "col-span-8",
            )}
          >
            {item.groups.map((group, groupIndex) => (
              <m.div key={group.heading} variants={stagger}>
                <m.p
                  id={`${megaMenuPanelId(item)}-group-${groupIndex}`}
                  variants={rise}
                  className="text-eyebrow font-medium text-muted-foreground uppercase"
                >
                  {group.heading}
                </m.p>
                <ul
                  aria-labelledby={`${megaMenuPanelId(item)}-group-${groupIndex}`}
                  className="mt-5 space-y-5"
                >
                  {group.links.map((link) => {
                    const current = isActivePath(link, pathname);
                    return (
                      <m.li key={link.href} variants={rise}>
                        <Link
                          href={link.href}
                          onClick={onNavigate}
                          aria-current={current ? "page" : undefined}
                          className="group/link block rounded-sm"
                        >
                          <span
                            className={cn(
                              "font-medium decoration-1 underline-offset-4 group-hover/link:text-primary group-hover/link:underline",
                              current && "text-primary",
                            )}
                          >
                            {link.label}
                          </span>
                          {link.description ? (
                            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                              {link.description}
                            </span>
                          ) : null}
                        </Link>
                      </m.li>
                    );
                  })}
                </ul>
              </m.div>
            ))}
          </div>

          {feature ? (
            <m.figure variants={rise} className="col-span-4">
              <Link
                href={feature.href}
                onClick={onNavigate}
                className="group/feature block rounded-sm"
              >
                <m.div
                  className="relative aspect-16/10 overflow-hidden rounded-sm bg-muted"
                  initial={reduced ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  transition={{ duration: 0.9, ease: EASE_CINEMATIC, delay: 0.1 }}
                >
                  <m.div
                    className="absolute inset-0"
                    initial={reduced ? false : { scale: 1.12 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.3, ease: EASE_CINEMATIC, delay: 0.1 }}
                  >
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      fill
                      sizes="(min-width: 1536px) 480px, 30vw"
                      className="object-cover transition-transform duration-(--motion-duration-cinematic) ease-cinematic group-hover/feature:scale-105"
                    />
                  </m.div>
                </m.div>
                <Eyebrow className="mt-5">{feature.eyebrow}</Eyebrow>
                <span className="mt-2 block font-display text-xl leading-snug decoration-1 underline-offset-4 group-hover/feature:underline">
                  {feature.title}
                </span>
              </Link>
              <figcaption className="mt-2">
                <span className="sr-only">{feature.image.caption}. </span>
                <PhotoCredit image={feature.image} />
              </figcaption>
            </m.figure>
          ) : null}
        </m.div>
      </Container>
    </m.div>
  );
}
