"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HeroMotionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Scroll-linked hero sequence: the photograph drifts slower than the page
 * (parallax), the copy lifts away and a shade deepens so the hero dissolves
 * into the dark section below. Targets: `data-hero-media`,
 * `data-hero-content`, `data-hero-shade`. No movement under reduced motion.
 */
export function HeroMotion({ children, className }: HeroMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          })
          .to("[data-hero-media]", { yPercent: 22 }, 0)
          .to("[data-hero-content]", { yPercent: -18, opacity: 0 }, 0)
          .to("[data-hero-shade]", { opacity: 1 }, 0);
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
