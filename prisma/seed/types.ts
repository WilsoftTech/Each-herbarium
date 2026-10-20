import type { MediaAsset } from "@/config/media";
import type { TextSection } from "@/validation/content";

/**
 * Shapes of the initial content migrated from the M03 static modules
 * (ADR 0006 → ADR 0007). Images refer to the licensed photography registry
 * in src/config/media.ts, which the seed also stores as STATIC media rows.
 */
export type SeedProgramme = {
  slug: string;
  title: string;
  summary: string;
  intro: string;
  image: MediaAsset;
  /** Search description of a designed programme page. */
  seoDescription?: string;
};

export type SeedProject = {
  slug: string;
  placeholder: boolean;
  title: string;
  summary: string;
  ecosystem: string;
  location: string | null;
  period: string | null;
  /** Programme slugs. */
  programmes: readonly string[];
  image: MediaAsset;
  gallery: readonly MediaAsset[];
  landscape: TextSection;
  story: readonly TextSection[];
  /** Partner slugs. */
  partners: readonly string[];
};

export type SeedArticle = {
  slug: string;
  placeholder: boolean;
  type: "PUBLICATION" | "GUIDE" | "STORY";
  title: string;
  summary: string;
  publishedOn: string | null;
  authors: readonly string[];
  image: MediaAsset | null;
  body: readonly string[];
};

export type SeedPartner = {
  slug: string;
  placeholder: boolean;
  name: string;
  relationship: "independent-partner";
  description: string;
  href: string | null;
};

export type SeedPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  lead: string;
  body: string;
  /** Browser and search title, when it differs from the headline. */
  seoTitle?: string | null;
  /** Header photograph, or the sharing image (see the page registry). */
  heroImage?: MediaAsset | null;
};
