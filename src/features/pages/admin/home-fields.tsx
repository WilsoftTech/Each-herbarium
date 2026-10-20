import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxGroup, SelectField, TextField } from "@/components/admin/form-fields";
import { formData } from "@/features/cms";
import type { MediaOption } from "@/features/media";
import {
  homeSectionLabel,
  landscapeCount,
  movableSectionKeys,
  type HomeContent,
  type HomeSectionKey,
} from "../home-content";

type HomeFieldsProps = {
  content: HomeContent | null;
  images: readonly MediaOption[];
};

const paragraphHint = "Separate paragraphs with a blank line.";
const linkHint = "A page on this site, such as /volunteer, or a full https:// address.";

/** Field name for a path inside the homepage content, e.g. content.hero.primaryAction.href. */
const field = (...path: (string | number)[]) => ["content", ...path].join(".");

function LinkFields({
  path,
  legend,
  value,
}: {
  path: (string | number)[];
  legend: string;
  value?: { label: string; href: string };
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextField
        name={field(...path, "label")}
        label={`${legend}: label`}
        required
        maxLength={60}
        defaultValue={value?.label}
      />
      <TextField
        name={field(...path, "href")}
        label={`${legend}: destination`}
        required
        hint={linkHint}
        defaultValue={value?.href}
      />
    </div>
  );
}

function HeadingFields({
  section,
  value,
}: {
  section: string;
  value?: { eyebrow: string; title: string };
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextField
        name={field(section, "eyebrow")}
        label="Label above the heading"
        required
        maxLength={80}
        defaultValue={value?.eyebrow}
      />
      <TextField
        name={field(section, "title")}
        label="Heading"
        required
        maxLength={200}
        defaultValue={value?.title}
      />
    </div>
  );
}

function ImageField({
  name,
  label,
  images,
  value,
}: {
  name: string;
  label: string;
  images: readonly MediaOption[];
  value?: string;
}) {
  return (
    <SelectField
      name={name}
      label={label}
      required
      options={[
        { value: "", label: "Choose an image…" },
        ...images.map((image) => ({ value: image.id, label: image.label })),
      ]}
      defaultValue={value ?? ""}
    />
  );
}

function FeatureFields({
  section,
  value,
  images,
}: {
  section: "research" | "community";
  value?: HomeContent["research"];
  images: readonly MediaOption[];
}) {
  return (
    <>
      <HeadingFields section={section} value={value} />
      <TextField
        name={field(section, "body")}
        label="Text"
        required
        rows={6}
        hint={paragraphHint}
        defaultValue={value ? formData.joinParagraphs(value.body) : ""}
      />
      <ImageField
        name={field(section, "imageId")}
        label="Image"
        images={images}
        value={value?.imageId}
      />
      <LinkFields path={[section, "action"]} legend="Link" value={value?.action} />
    </>
  );
}

/**
 * Editor for the homepage's typed sections. The cinematic hero's headline,
 * label, text and photograph are the page's own fields above; this edits the
 * rest. Every value is validated again on the server.
 */
export function HomeFields({ content, images }: HomeFieldsProps) {
  const order: readonly HomeSectionKey[] = content?.layout.order.slice(1) ?? movableSectionKeys;
  const position = (key: HomeSectionKey) => order.indexOf(key) + 1;

  return (
    <>
      <AdminPanel title="Hero buttons">
        <LinkFields
          path={["hero", "primaryAction"]}
          legend="Main button"
          value={content?.hero.primaryAction}
        />
        <LinkFields
          path={["hero", "secondaryAction"]}
          legend="Second button"
          value={content?.hero.secondaryAction}
        />
      </AdminPanel>

      <AdminPanel
        title="Section order and visibility"
        description="Sections appear after the introduction in this order (1 first). The introduction always follows the hero."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {movableSectionKeys.map((key) => (
            <TextField
              key={key}
              name={field("layout", "position", key)}
              label={homeSectionLabel[key]}
              type="number"
              required
              defaultValue={position(key)}
            />
          ))}
        </div>
        <CheckboxGroup
          name={field("layout", "hidden")}
          legend="Hide these sections"
          options={movableSectionKeys.map((key) => ({ value: key, label: homeSectionLabel[key] }))}
          defaultValues={content?.layout.hidden ?? []}
        />
      </AdminPanel>

      <AdminPanel title={homeSectionLabel.introduction}>
        <TextField
          name={field("introduction", "eyebrow")}
          label="Label"
          required
          maxLength={80}
          defaultValue={content?.introduction.eyebrow}
        />
        <TextField
          name={field("introduction", "text")}
          label="Statement"
          required
          rows={3}
          maxLength={400}
          defaultValue={content?.introduction.text}
        />
        <TextField
          name={field("introduction", "detail")}
          label="Supporting text"
          rows={3}
          maxLength={800}
          defaultValue={content?.introduction.detail}
        />
        <LinkFields
          path={["introduction", "action"]}
          legend="Link"
          value={content?.introduction.action}
        />
      </AdminPanel>

      <AdminPanel
        title={homeSectionLabel.programmes}
        description="The programmes themselves come from Programmes (published only)."
      >
        <HeadingFields section="programmes" value={content?.programmes} />
        <TextField
          name={field("programmes", "description")}
          label="Introduction"
          rows={3}
          maxLength={600}
          defaultValue={content?.programmes.description}
        />
        <TextField
          name={field("programmes", "linkLabel")}
          label="Link label (to /our-work)"
          required
          maxLength={60}
          defaultValue={content?.programmes.linkLabel}
        />
      </AdminPanel>

      <AdminPanel title={homeSectionLabel.heritage}>
        <HeadingFields section="heritage" value={content?.heritage} />
        <TextField
          name={field("heritage", "description")}
          label="Introduction"
          rows={3}
          maxLength={600}
          defaultValue={content?.heritage.description}
        />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            name={field("heritage", "statementEyebrow")}
            label="Photograph label"
            required
            maxLength={80}
            defaultValue={content?.heritage.statementEyebrow}
          />
          <TextField
            name={field("heritage", "statement")}
            label="Statement over the photograph"
            required
            maxLength={200}
            defaultValue={content?.heritage.statement}
          />
        </div>
        <ImageField
          name={field("heritage", "imageId")}
          label="Full-width photograph"
          images={images}
          value={content?.heritage.imageId}
        />
        {Array.from({ length: landscapeCount }, (_, index) => {
          const landscape = content?.heritage.landscapes[index];
          return (
            <fieldset key={index} className="space-y-5 rounded-sm border border-border p-4">
              <legend className="px-1 text-sm font-medium">Landscape {index + 1}</legend>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  name={field("heritage", "landscapes", index, "name")}
                  label="Short name"
                  required
                  maxLength={40}
                  defaultValue={landscape?.name}
                />
                <TextField
                  name={field("heritage", "landscapes", index, "title")}
                  label="Title"
                  required
                  maxLength={120}
                  defaultValue={landscape?.title}
                />
              </div>
              <TextField
                name={field("heritage", "landscapes", index, "body")}
                label="Text"
                required
                rows={5}
                hint={paragraphHint}
                defaultValue={landscape ? formData.joinParagraphs(landscape.body) : ""}
              />
              <ImageField
                name={field("heritage", "landscapes", index, "imageId")}
                label="Image"
                images={images}
                value={landscape?.imageId}
              />
            </fieldset>
          );
        })}
      </AdminPanel>

      <AdminPanel
        title={homeSectionLabel.projects}
        description='Shows published projects marked "Featured on the homepage", or the first three in display order when none are.'
      >
        <HeadingFields section="projects" value={content?.projects} />
        <TextField
          name={field("projects", "description")}
          label="Introduction"
          rows={3}
          maxLength={600}
          defaultValue={content?.projects.description}
        />
        <TextField
          name={field("projects", "linkLabel")}
          label="Link label (to /projects)"
          required
          maxLength={60}
          defaultValue={content?.projects.linkLabel}
        />
      </AdminPanel>

      <AdminPanel
        title={homeSectionLabel.presence}
        description="States only what is confirmed. Leave sites and wider region empty to show placeholder markers."
      >
        <HeadingFields section="presence" value={content?.presence} />
        <TextField
          name={field("presence", "text")}
          label="Introduction"
          required
          rows={3}
          maxLength={600}
          defaultValue={content?.presence.text}
        />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            name={field("presence", "start")}
            label="Where we begin"
            required
            maxLength={120}
            defaultValue={content?.presence.start}
          />
          <TextField
            name={field("presence", "region")}
            label="Region"
            required
            maxLength={120}
            defaultValue={content?.presence.region}
          />
          <TextField
            name={field("presence", "sites")}
            label="Sites and districts"
            maxLength={200}
            defaultValue={content?.presence.sites}
          />
          <TextField
            name={field("presence", "wider")}
            label="Wider region"
            maxLength={200}
            defaultValue={content?.presence.wider}
          />
        </div>
      </AdminPanel>

      <AdminPanel title={homeSectionLabel.research}>
        <FeatureFields section="research" value={content?.research} images={images} />
      </AdminPanel>

      <AdminPanel title={homeSectionLabel.community}>
        <FeatureFields section="community" value={content?.community} images={images} />
      </AdminPanel>

      <AdminPanel title={homeSectionLabel.involved}>
        <HeadingFields section="involved" value={content?.involved} />
        {([0, 1] as const).map((index) => {
          const panel = content?.involved.panels[index];
          return (
            <fieldset key={index} className="space-y-5 rounded-sm border border-border p-4">
              <legend className="px-1 text-sm font-medium">Panel {index + 1}</legend>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  name={field("involved", "panels", index, "eyebrow")}
                  label="Label"
                  required
                  maxLength={80}
                  defaultValue={panel?.eyebrow}
                />
                <TextField
                  name={field("involved", "panels", index, "title")}
                  label="Heading"
                  required
                  maxLength={200}
                  defaultValue={panel?.title}
                />
              </div>
              <TextField
                name={field("involved", "panels", index, "description")}
                label="Description"
                required
                rows={3}
                maxLength={400}
                defaultValue={panel?.description}
              />
              <ImageField
                name={field("involved", "panels", index, "imageId")}
                label="Image"
                images={images}
                value={panel?.imageId}
              />
              <LinkFields
                path={["involved", "panels", index, "action"]}
                legend="Link"
                value={panel?.action}
              />
            </fieldset>
          );
        })}
      </AdminPanel>

      <AdminPanel
        title={homeSectionLabel.stories}
        description='Shows published articles marked "Featured on the homepage", or the three newest when none are.'
      >
        <HeadingFields section="stories" value={content?.stories} />
        <TextField
          name={field("stories", "linkLabel")}
          label="Link label (to /resources)"
          required
          maxLength={60}
          defaultValue={content?.stories.linkLabel}
        />
      </AdminPanel>
    </>
  );
}
