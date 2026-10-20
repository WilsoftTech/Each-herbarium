import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { EditorTarget, SectionFields } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import { homeContentSchema } from "../home-content";
import { isLandingSlug, landingSections } from "../landing-content";
import { pageEntry } from "../registry";
import { savePage } from "./actions";
import type { PageForAdmin } from "./admin";
import { HomeFields } from "./home-fields";

const formatHint = (
  <>
    Start a heading with <code>## </code>, a list item with <code>- </code>, and separate paragraphs
    with a blank line. Links: <code>[contact page](/contact)</code> or a full https:// address.
  </>
);

/**
 * Editor for a managed page. Which fields show depends on the page registry:
 * prose pages edit their text, the homepage and landing pages their header
 * and designed sections. The layout of each route stays in code.
 */
export function PageForm({
  page,
  revisionId,
  images,
  editable,
}: {
  page: PageForAdmin;
  /** Set when the form edits the pending changes of a published page. */
  revisionId?: string | null;
  images: readonly MediaOption[];
  editable: boolean;
}) {
  const entry = pageEntry(page.slug);
  const kind = entry?.kind ?? "prose";
  const home = kind === "home" ? homeContentSchema.safeParse(page.content) : null;
  const imageRequired = Boolean(entry && "imageRequired" in entry);
  const imageOptions = [
    { value: "", label: imageRequired ? "Choose an image…" : "No image" },
    ...images.map((image) => ({ value: image.id, label: image.label })),
  ];

  return (
    <ActionForm action={savePage} label="Page content" className="space-y-6">
      <EditorTarget item={page} revisionId={revisionId} />
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel
          title={kind === "home" ? "Cinematic hero" : "Header"}
          description={entry ? `Shown at ${entry.route}.` : undefined}
        >
          <TextField
            name="title"
            label={kind === "home" ? "Headline" : "Title"}
            required
            maxLength={200}
            defaultValue={page.title}
          />
          <TextField
            name="eyebrow"
            label="Label above the title"
            required
            maxLength={80}
            defaultValue={page.eyebrow}
          />
          <TextField
            name="lead"
            label={kind === "home" ? "Text under the headline" : "Introduction"}
            rows={3}
            maxLength={600}
            defaultValue={page.lead}
          />
          <SelectField
            name="heroImageId"
            label={
              kind === "home"
                ? "Hero photograph"
                : entry?.image === "header"
                  ? "Header photograph"
                  : "Sharing image"
            }
            required={imageRequired}
            hint={
              entry?.image === "sharing"
                ? "This page has no header photograph; the image is used when the page is shared. Without one, the default sharing image applies."
                : "Upload images in the media library first."
            }
            options={imageOptions}
            defaultValue={page.heroImageId ?? ""}
          />
        </AdminPanel>

        {kind === "prose" ? (
          <AdminPanel title="Text">
            <TextField
              name="body"
              label="Page text"
              required
              rows={24}
              defaultValue={page.body}
              hint={formatHint}
            />
          </AdminPanel>
        ) : null}

        {kind === "home" ? (
          <HomeFields content={home?.success ? home.data : null} images={images} />
        ) : null}

        {isLandingSlug(page.slug) ? (
          <>
            <p className="text-sm text-muted-foreground">
              The sections below follow the page from top to bottom. Their design and order are
              fixed; programmes, projects, articles, partners and team members shown on the page are
              managed in their own sections of the admin.
            </p>
            <SectionFields
              name={page.slug}
              spec={landingSections[page.slug]}
              content={
                page.content && typeof page.content === "object" && !Array.isArray(page.content)
                  ? (page.content as Record<string, Record<string, unknown>>)
                  : null
              }
              images={images}
            />
          </>
        ) : null}

        <AdminPanel title="Search and sharing">
          <TextField
            name="seoTitle"
            label="Search title"
            maxLength={120}
            defaultValue={page.seoTitle}
            hint="Leave empty to use the title. The site name is added automatically."
          />
          <TextField
            name="description"
            label="Search description"
            required
            rows={2}
            maxLength={300}
            defaultValue={page.description}
            hint="Shown by search engines and when the page is shared."
          />
          <CheckboxField
            name="noindex"
            label="Hide from search engines"
            defaultChecked={page.noindex}
            hint="Adds noindex and leaves the page out of the sitemap."
          />
        </AdminPanel>
      </fieldset>
      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {page.status === "PUBLISHED" ? "Save pending changes" : "Save changes"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
