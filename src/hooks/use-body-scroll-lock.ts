"use client";

import { useEffect } from "react";

/**
 * Prevents the page behind an overlay from scrolling while `locked` is true.
 * Compensates for the removed scrollbar so the layout does not shift, and
 * restores the previous styles on unlock or unmount.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };

    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
    };
  }, [locked]);
}
