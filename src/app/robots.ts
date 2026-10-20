import type { MetadataRoute } from "next";
import { env } from "@/config/env";

/** Public pages are crawlable; the admin area and previews never are. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
