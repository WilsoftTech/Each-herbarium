import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/admin/admin-ui";
import { PreviewFrame } from "@/components/admin/preview-banner";
import { PageHeader } from "@/components/sections/page-header";
import { herbariumProgramme } from "@/content/programmes";
import { getPagePreview, HomePageView, pickFeatured, PolicyPage } from "@/features/pages";
import { listProgrammes } from "@/features/programmes";
import { listProjects } from "@/features/projects";
import { listResources } from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Preview page" };

export default async function PagePreviewPage({ params }: PageProps<"/admin/preview/pages/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const preview = await getPagePreview(id);
  if (!preview) notFound();
  const value = preview.value;

  return (
    <PreviewFrame
      status={preview.status}
      pendingChanges={Boolean(preview.revision)}
      editHref={`/admin/pages/${id}`}
    >
      {!value ? (
        <div className="p-10">
          <EmptyState>{preview.error}</EmptyState>
        </div>
      ) : value.kind === "home" ? (
        <HomePreview home={value.home} />
      ) : value.kind === "prose" ? (
        <PolicyPage page={value.page} />
      ) : (
        <>
          <PageHeader
            eyebrow={value.page.eyebrow}
            title={value.page.title}
            lead={value.page.lead ? <p>{value.page.lead}</p> : undefined}
            image={value.page.image ?? undefined}
          />
          <div className="px-6 pb-16">
            <EmptyState>
              The rest of {value.route} is part of the page&apos;s design and is not shown in this
              preview.
            </EmptyState>
          </div>
        </>
      )}
    </PreviewFrame>
  );
}

/** The homepage composition with published programmes, projects and articles, as on the site. */
async function HomePreview({ home }: { home: Parameters<typeof HomePageView>[0]["home"] }) {
  const [programmes, projects, resources] = await Promise.all([
    listProgrammes(),
    listProjects(),
    listResources(),
  ]);
  return (
    <HomePageView
      home={home}
      programmes={[...programmes, herbariumProgramme]}
      projects={pickFeatured(projects)}
      resources={pickFeatured(resources)}
    />
  );
}
