/**
 * The approved M03 public routes, shared by unit and browser tests. Dynamic
 * routes are listed with every slug the static content defines.
 */
export const staticRoutes = [
  "/",
  "/about",
  "/about/mission",
  "/about/leadership",
  "/about/partners",
  "/our-work",
  "/our-work/plant-conservation",
  "/our-work/environmental-conservation",
  "/our-work/medicinal-plants",
  "/our-work/indigenous-knowledge",
  "/herbarium",
  "/research",
  "/resources",
  "/projects",
  "/impact",
  "/get-involved",
  "/volunteer",
  "/partnerships",
  "/bitwiire-herbarium-cafe",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;

export const dynamicRoutes = [
  "/projects/placeholder-montane-forest",
  "/projects/placeholder-papyrus-wetland",
  "/projects/placeholder-dryland-savanna",
  "/resources/placeholder-publication",
  "/resources/placeholder-field-guide",
  "/resources/placeholder-field-story",
] as const;

export const publicRoutes = [...staticRoutes, ...dynamicRoutes] as const;

/** Routes that open with the full-bleed hero (transparent header). */
export const heroRoutes = [
  "/",
  "/our-work",
  "/our-work/plant-conservation",
  "/our-work/environmental-conservation",
  "/projects/placeholder-montane-forest",
] as const;

/** Pages that show only placeholder content and must not be indexed. */
export const noindexRoutes = ["/about/leadership", ...dynamicRoutes] as const;
