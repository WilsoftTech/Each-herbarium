import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import {
  CheckboxField,
  CheckboxGroup,
  SelectField,
  TextField,
} from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { EditorTarget, formData, SeoFields, statusLabel } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import { saveProject } from "./actions";
import type { ProjectForAdmin } from "./queries";

const dateValue = (date: Date | null | undefined) => (date ? date.toISOString().slice(0, 10) : "");

const operationalOptions = [
  { value: "", label: "Not confirmed" },
  { value: "PLANNED", label: "Planned" },
  { value: "ACTIVE", label: "Under way" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On hold" },
];

type ProjectFormProps = {
  project?: ProjectForAdmin;
  /** Set when the form edits the pending changes of a published project. */
  revisionId?: string | null;
  images: readonly MediaOption[];
  programmes: readonly { id: string; title: string; status: keyof typeof statusLabel }[];
  partners: readonly { id: string; name: string; status: keyof typeof statusLabel }[];
  /** False when the role cannot edit the item in its current status. */
  editable: boolean;
};

const paragraphHint = "Separate paragraphs with a blank line.";

/** Create or edit a project. All fields are validated again on the server. */
export function ProjectForm({
  project,
  revisionId,
  images,
  programmes,
  partners,
  editable,
}: ProjectFormProps) {
  const landscape = project?.landscape as { heading: string; body: string[] } | undefined;
  const story = (project?.story ?? []) as { heading: string; body: string[] }[];
  const imageOptions = [
    { value: "", label: "Choose an image…" },
    ...images.map((image) => ({ value: image.id, label: image.label })),
  ];

  return (
    <ActionForm action={saveProject} label="Project details" className="space-y-6">
      <EditorTarget item={project} revisionId={revisionId} />
      <fieldset disabled={!editable} className="space-y-6">
        <AdminPanel title="Basics">
          <TextField
            name="title"
            label="Title"
            required
            maxLength={200}
            defaultValue={project?.title}
          />
          <TextField
            name="slug"
            label="Slug"
            required
            maxLength={120}
            defaultValue={project?.slug}
            hint="The address: /projects/your-slug. Lowercase letters, numbers and hyphens."
          />
          <TextField
            name="summary"
            label="Summary"
            required
            rows={3}
            maxLength={500}
            defaultValue={project?.summary}
          />
          <div className="grid gap-5 md:grid-cols-3">
            <TextField
              name="ecosystem"
              label="Landscape type"
              required
              defaultValue={project?.ecosystem}
              hint="For example: Montane forest."
            />
            <TextField
              name="location"
              label="Location"
              defaultValue={project?.location}
              hint="Leave empty until confirmed."
            />
            <TextField
              name="period"
              label="Period"
              defaultValue={project?.period}
              hint="For example: 2026 to 2028."
            />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <TextField
              name="sortOrder"
              label="Display order"
              type="number"
              required
              defaultValue={project?.sortOrder ?? 0}
              hint="Lower numbers appear first."
            />
          </div>
          <CheckboxField
            name="featured"
            label="Featured on the homepage"
            defaultChecked={project?.featured ?? false}
            hint="Featured published projects appear in the homepage section; without any, the first three are shown."
          />
          <CheckboxField
            name="placeholder"
            label="Placeholder"
            defaultChecked={project?.placeholder ?? false}
            hint="Shows the layout only: labelled on the site, never indexed, never presented as fact."
          />
        </AdminPanel>

        <AdminPanel
          title="Where and when"
          description="Leave fields empty until EACH confirms them. The operational status describes the work, not whether this page is published."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              name="country"
              label="Country"
              maxLength={100}
              defaultValue={project?.country}
            />
            <SelectField
              name="operationalStatus"
              label="Project status"
              options={operationalOptions}
              defaultValue={project?.operationalStatus ?? ""}
            />
            <TextField
              name="startDate"
              label="Start date"
              type="date"
              defaultValue={dateValue(project?.startDate)}
            />
            <TextField
              name="endDate"
              label="End date"
              type="date"
              defaultValue={dateValue(project?.endDate)}
            />
          </div>
        </AdminPanel>

        <AdminPanel title="Images" description="Upload images in the media library first.">
          <SelectField
            name="imageId"
            label="Main image"
            required
            options={imageOptions}
            defaultValue={project?.imageId ?? ""}
          />
          <CheckboxGroup
            name="galleryIds"
            legend="Gallery"
            hint="The first two appear beside the landscape text and as a full-width image. At most 12."
            options={images.map((image) => ({ value: image.id, label: image.label }))}
            defaultValues={project?.gallery.map((item) => item.mediaId) ?? []}
          />
        </AdminPanel>

        <AdminPanel title="Landscape">
          <TextField
            name="landscapeHeading"
            label="Heading"
            required
            defaultValue={landscape?.heading}
          />
          <TextField
            name="landscapeBody"
            label="Text"
            required
            rows={6}
            hint={`${paragraphHint} Describe the landscape only; make no claims about the project here.`}
            defaultValue={landscape ? formData.joinParagraphs(landscape.body) : ""}
          />
        </AdminPanel>

        <AdminPanel title="Story">
          <TextField
            name="story"
            label="Project story"
            rows={12}
            hint={`Start each part with a line such as "## What we found". ${paragraphHint} Leave empty until EACH supplies the story.`}
            defaultValue={formData.joinSections(story)}
          />
        </AdminPanel>

        <AdminPanel
          title="Objectives, activities and outcomes"
          description="One entry per line. Record only verified outcomes; never estimates or targets presented as results."
        >
          <TextField
            name="objectives"
            label="Objectives"
            rows={4}
            defaultValue={formData.joinLines(project?.objectives ?? [])}
          />
          <TextField
            name="activities"
            label="Activities"
            rows={4}
            defaultValue={formData.joinLines(project?.activities ?? [])}
          />
          <TextField
            name="outcomes"
            label="Verified outcomes"
            rows={4}
            defaultValue={formData.joinLines(project?.outcomes ?? [])}
          />
          <TextField
            name="references"
            label="References"
            rows={4}
            hint="One source per line. Links: [title](https://example.org/paper)."
            defaultValue={formData.joinLines(project?.references ?? [])}
          />
        </AdminPanel>

        <AdminPanel title="Links">
          <CheckboxGroup
            name="programmeIds"
            legend="Programmes"
            hint="Only published programmes are shown on the site."
            options={programmes.map((programme) => ({
              value: programme.id,
              label: programme.title,
              description: statusLabel[programme.status],
            }))}
            defaultValues={project?.programmes.map((item) => item.programmeId) ?? []}
          />
          <CheckboxGroup
            name="partnerIds"
            legend="Partners"
            hint="Only published partners are shown on the site."
            options={partners.map((partner) => ({
              value: partner.id,
              label: partner.name,
              description: statusLabel[partner.status],
            }))}
            defaultValues={project?.partners.map((item) => item.partnerId) ?? []}
          />
        </AdminPanel>

        <SeoFields value={project} />
      </fieldset>

      {editable ? (
        <SubmitButton pendingLabel="Saving…">
          {!project
            ? "Create draft"
            : project.status === "PUBLISHED"
              ? "Save pending changes"
              : "Save changes"}
        </SubmitButton>
      ) : null}
    </ActionForm>
  );
}
