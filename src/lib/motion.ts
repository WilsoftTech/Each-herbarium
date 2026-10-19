/**
 * Shared animation constants (ADR 0003). Framework-agnostic: no GSAP or Motion
 * imports here, so importing this module never pulls an animation library into
 * a bundle.
 */

/** Media query for GSAP `matchMedia` branches that may animate. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Media query for the reduced-motion branch. */
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

/** `ease-cinematic` token as a cubic-bezier array for Motion. */
export const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;
/** `ease-standard` token as a cubic-bezier array for Motion. */
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

/** Durations in seconds, mirroring the `--motion-duration-*` tokens. */
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.7,
  cinematic: 1.2,
} as const;

/** Whether the visitor asked for reduced motion. False on the server. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOTION_REDUCED).matches;
}
