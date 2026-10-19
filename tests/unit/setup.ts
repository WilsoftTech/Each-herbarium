import { afterEach } from "vitest";

// Browser API stand-ins for component tests that opt into jsdom with
// `// @vitest-environment jsdom`. Node-environment tests skip all of this.
if (typeof window !== "undefined") {
  const { cleanup } = await import("@testing-library/react");
  const { MotionGlobalConfig } = await import("motion/react");

  // Motion animations complete instantly so presence and exit states settle.
  MotionGlobalConfig.skipAnimations = true;

  /** Set to true in a test to emulate `prefers-reduced-motion: reduce`. */
  globalThis.__reducedMotion = false;

  window.matchMedia = (query: string): MediaQueryList => {
    const reduce = globalThis.__reducedMotion;
    const matches =
      (query.includes("prefers-reduced-motion: reduce") && reduce) ||
      (query.includes("prefers-reduced-motion: no-preference") && !reduce);
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };

  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver;
  window.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver;

  afterEach(() => {
    cleanup();
    globalThis.__reducedMotion = false;
    document.documentElement.removeAttribute("style");
  });
}

declare global {
  var __reducedMotion: boolean;
}
