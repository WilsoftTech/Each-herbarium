"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { MOTION_OK } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ScrollTextProps = {
  text: string;
  as?: "p" | "h2" | "blockquote";
  id?: string;
  className?: string;
};

/**
 * Statement text that brightens word by word as it scrolls into the reading
 * position. The words are rendered on the server at full opacity; the dimmed
 * start state is applied only on the client, only when motion is allowed, and
 * completes before the text reaches the middle of the viewport.
 */
export function ScrollText({ text, as: Tag = "p", id, className }: ScrollTextProps) {
  const scope = useRef<HTMLElement | null>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>("[data-word]", scope.current),
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: scope.current,
              start: "top 85%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          },
        );
      });
    },
    { scope },
  );

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        scope.current = node;
      }}
      id={id}
      className={className}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span data-word>{word}</span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
