import { z } from "zod";
import { contentStatusSchema, mediaAssetSchema, slugSchema } from "@/validation/content";
import type { MediaAsset } from "@/config/media";
import { homeContentSchema } from "./home-content";
import type { LandingContent, LandingSlug } from "./landing-content";

export {
  isManagedPageSlug,
  managedPageSlugs,
  pageEntry,
  pageRegistry,
  type ManagedPageSlug,
} from "./registry";

/**
 * A managed page as public routes see it (published rows only). Each slug
 * belongs to a fixed route that decides the layout; the CMS supplies the words.
 */
export const pageSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema,
  title: z.string().min(1),
  /** Meta description. */
  description: z.string().min(30),
  eyebrow: z.string().min(1),
  lead: z.string(),
  /** Rich text (src/lib/rich-text.ts); prose pages only. */
  body: z.string(),
  /** Header photograph or sharing image, per the page registry. */
  image: mediaAssetSchema.nullable(),
  /** Browser and search title, when it differs from the headline. */
  seoTitle: z.string().min(1).nullable(),
  noindex: z.boolean(),
});

export type Page = z.infer<typeof pageSchema>;

/**
 * The homepage: its page fields drive the cinematic hero, `content` the
 * sections. Images are resolved to the public media contract; a section whose
 * image is no longer usable is left out rather than breaking the page.
 */
export type HomeImages = {
  heritage: z.infer<typeof mediaAssetSchema> | null;
  /** In the order of content.heritage.landscapes. */
  landscapes: (z.infer<typeof mediaAssetSchema> | null)[];
  research: z.infer<typeof mediaAssetSchema> | null;
  community: z.infer<typeof mediaAssetSchema> | null;
  panels: [z.infer<typeof mediaAssetSchema> | null, z.infer<typeof mediaAssetSchema> | null];
};

export const homePageSchema = z.object({
  page: pageSchema.extend({ image: mediaAssetSchema }),
  content: homeContentSchema,
});

export type HomePage = z.infer<typeof homePageSchema> & { images: HomeImages };

/**
 * A landing page: header fields, its designed sections (landing-content.ts)
 * and the usable images those sections refer to, by media id. A section
 * image that is missing or lacks its alt text and caption is absent from
 * `images`, and the view leaves that image out rather than breaking.
 */
export type LandingPage<S extends LandingSlug> = {
  slug: S;
  page: Page;
  content: LandingContent<S>;
  images: Record<string, MediaAsset>;
};

/** Any landing page, discriminated by slug. */
export type AnyLandingPage = { [S in LandingSlug]: LandingPage<S> }[LandingSlug];
