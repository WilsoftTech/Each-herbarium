import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/ui/json-ld";
import { env } from "@/config/env";
import { herbariumProgramme } from "@/content/programmes";
import { getHomePage, HomePageView, metadataForPage, pickFeatured } from "@/features/pages";
import { getSiteSettings } from "@/features/settings";
import { listProgrammes } from "@/features/programmes";
import { listProjects } from "@/features/projects";
import { listResources } from "@/features/resources";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

async function loadHome() {
  const home = await getHomePage();
  if (!home) notFound();
  return home;
}

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("home", { absoluteTitle: true });
}

/**
 * The homepage. Its words, images, links and section order are managed in
 * the CMS (Pages → Homepage); programmes, featured projects and articles are
 * the published records themselves, never copies.
 */
export default async function Home() {
  const [home, programmes, projects, resources, settings] = await Promise.all([
    loadHome(),
    listProgrammes(),
    listProjects(),
    listResources(),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd
        data={[organizationJsonLd(env.siteUrl, settings.tagline), websiteJsonLd(env.siteUrl)]}
      />
      <HomePageView
        home={home}
        programmes={[...programmes, herbariumProgramme]}
        projects={pickFeatured(projects)}
        resources={pickFeatured(resources)}
      />
    </>
  );
}
