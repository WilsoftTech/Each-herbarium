/**
 * Cache tags for CMS content. Public queries tag their `"use cache"` entries
 * with every collection they read, and admin mutations expire the tags of the
 * collections they change (updateTag). One tag per collection keeps the rule
 * simple and correct: a change to a partner expires every cached page that
 * shows partners, including project pages.
 */
export const contentTags = {
  pages: "content:pages",
  programmes: "content:programmes",
  projects: "content:projects",
  articles: "content:articles",
  resources: "content:resources",
  partners: "content:partners",
  team: "content:team",
  media: "content:media",
  settings: "content:settings",
} as const;

export type ContentCollection = keyof typeof contentTags;
