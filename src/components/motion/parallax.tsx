"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Travel in percent of the moving element's height, each way. */
  strength?: number;
};

/**
 * Subtle scroll parallax for photographs (ADR 0003). Each `data-parallax`
 * descendant drifts against the scroll inside its clipping parent. The moving
 * element must overhang its parent (for example `-inset-y-[12%]`) so no edge
 * shows. Scrubbed against native scroll; nothing moves under reduced motion.
 */
export function Parallax({ children, className, strength = 8 }: ParallaxProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]", scope.current).forEach((element) => {
          gsap.fromTo(
            element,
            { yPercent: -strength },
            {
              yPercent: strength,
              ease: "none",
              scrollTrigger: {
                trigger: element.parentElement ?? element,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        });
      });
    },
    { scope, dependencies: [strength] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
