"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

// The first page of a visit renders without an entrance so it never delays
// the initial paint; later client-side navigations fade the new page in.
const session = { navigated: false };

type PageTransitionProps = { children: ReactNode };

/** Page entrance for client-side navigations. Used by `(public)/template.tsx`. */
export function PageTransition({ children }: PageTransitionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!session.navigated) {
        session.navigated = true;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(scope.current, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "opacity,transform",
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
