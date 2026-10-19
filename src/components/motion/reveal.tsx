"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Scroll-triggered entrance for server-rendered content (ADR 0003).
 *
 * Descendants marked `data-reveal` rise and fade in with a stagger; elements
 * marked `data-reveal-media` are uncovered with a clip reveal. The server
 * renders the final state, so content is visible without JavaScript, and
 * nothing animates under `prefers-reduced-motion: reduce`.
 *
 * Reveals may be nested (a section that reveals its heading can contain a
 * component that reveals its own items). Each one animates only the targets
 * whose nearest `Reveal` is itself, so no element is animated twice.
 */
export function Reveal({ children, className }: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const own = (element: HTMLElement) =>
          element.closest("[data-reveal-scope]") === scope.current;
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current).filter(own);
        if (items.length) {
          gsap.from(items, {
            opacity: 0,
            y: 48,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
          });
        }

        gsap.utils
          .toArray<HTMLElement>("[data-reveal-media]", scope.current)
          .filter(own)
          .forEach((media) => {
            gsap.from(media, {
              clipPath: "inset(100% 0% 0% 0%)",
              duration: 1.4,
              ease: "power4.out",
              scrollTrigger: { trigger: media, start: "top 88%", once: true },
            });
          });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} data-reveal-scope className={className}>
      {children}
    </div>
  );
}
