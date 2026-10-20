import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import type { Programme } from "./schema";

/** Metadata for a programme page from its published CMS fields. */
export function programmeMetadata(programme: Programme): Metadata {
  return pageMetadata({
    title: programme.seoTitle ?? programme.title,
    description: programme.seoDescription ?? programme.summary,
    path: programme.href,
    image: programme.image,
    noindex: programme.noindex || programme.status === "placeholder",
  });
}
