import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { joinLines, joinParagraphs } from "../form-data";
import {
  contentField,
  joinItems,
  sectionsKeyField,
  type FieldSpec,
  type SectionsSpec,
  type SimpleFieldSpec,
} from "../sections";

type ImageOption = { id: string; label: string };

type SectionFieldsProps = {
  /** Which declaration the form uses; read back by readSections' caller. */
  name: string;
  spec: SectionsSpec;
  /** Current values, or null when they do not match the declaration (fields start empty). */
  content: Record<string, Record<string, unknown>> | null;
  images: readonly ImageOption[];
};

const richHint =
  'Blank lines separate paragraphs; "- " starts a list item; [link text](/contact) adds a link; *text* sets a scientific name in italics.';
const itemsHint = 'Start each item with "## " and its title, with its text on the next line.';
const hrefHint = "A page on this site, such as /volunteer, or a full https:// address.";

const asString = (value: unknown) => (typeof value === "string" ? value : "");
const asStrings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

function Simple({
  name,
  spec,
  value,
  images,
}: {
  name: string;
  spec: SimpleFieldSpec;
  value: unknown;
  images: readonly ImageOption[];
}) {
  switch (spec.type) {
    case "line":
      return (
        <TextField
          name={name}
          label={spec.label}
          required={!spec.optional}
          maxLength={spec.max}
          hint={spec.hint}
          defaultValue={asString(value)}
        />
      );
    case "text":
      return (
        <TextField
          name={name}
          label={spec.label}
          required={!spec.optional}
          maxLength={spec.max}
          rows={spec.rows ?? 3}
          hint={spec.hint}
          defaultValue={asString(value)}
        />
      );
    case "rich":
      return (
        <TextField
          name={name}
          label={spec.label}
          required={!spec.optional}
          maxLength={spec.max}
          rows={spec.rows ?? 5}
          hint={spec.hint ? `${spec.hint} ${richHint}` : richHint}
          defaultValue={asString(value)}
        />
      );
    case "paragraphs":
      return (
        <TextField
          name={name}
          label={spec.label}
          required
          rows={6}
          hint={spec.hint ?? "Separate paragraphs with a blank line."}
          defaultValue={joinParagraphs(asStrings(value))}
        />
      );
    case "href":
      return (
        <TextField
          name={name}
          label={spec.label}
          required
          hint={spec.hint ?? hrefHint}
          defaultValue={asString(value)}
        />
      );
    case "image":
      return (
        <SelectField
          name={name}
          label={spec.label}
          required
          hint={spec.hint}
          options={[
            { value: "", label: "Choose an image…" },
            ...images.map((image) => ({ value: image.id, label: image.label })),
          ]}
          defaultValue={asString(value)}
        />
      );
    case "toggle":
      return (
        <CheckboxField
          name={name}
          label={spec.label}
          hint={spec.hint}
          defaultChecked={value === true}
        />
      );
  }
}

function Field({
  name,
  spec,
  value,
  images,
}: {
  name: string;
  spec: FieldSpec;
  value: unknown;
  images: readonly ImageOption[];
}) {
  switch (spec.type) {
    case "link": {
      const link = (value ?? {}) as { label?: unknown; href?: unknown };
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            name={`${name}.label`}
            label={`${spec.label}: label`}
            required
            maxLength={60}
            defaultValue={asString(link.label)}
          />
          <TextField
            name={`${name}.href`}
            label={`${spec.label}: destination`}
            required
            hint={spec.hint ?? hrefHint}
            defaultValue={asString(link.href)}
          />
        </div>
      );
    }
    case "lines":
      return (
        <TextField
          name={name}
          label={spec.label}
          required
          rows={Math.min(Math.max(asStrings(value).length + 1, 4), 12)}
          hint={spec.hint ?? "One entry per line."}
          defaultValue={joinLines(asStrings(value))}
        />
      );
    case "items": {
      const items = Array.isArray(value)
        ? (value as { title?: unknown; body?: unknown }[]).map((item) => ({
            title: asString(item?.title),
            body: asString(item?.body),
          }))
        : [];
      return (
        <TextField
          name={name}
          label={spec.label}
          required
          rows={Math.min(Math.max(items.length * 3 + 1, 6), 24)}
          hint={spec.hint ? `${spec.hint} ${itemsHint}` : itemsHint}
          defaultValue={joinItems(items)}
        />
      );
    }
    case "group": {
      const entries = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      return (
        <div className="space-y-5">
          {spec.hint ? <p className="text-sm text-muted-foreground">{spec.hint}</p> : null}
          {Array.from({ length: spec.count }, (_, index) => (
            <fieldset key={index} className="space-y-5 rounded-sm border border-border p-4">
              <legend className="px-1 text-sm font-medium">
                {spec.itemLabel} {index + 1}
              </legend>
              {Object.entries(spec.fields).map(([subName, subSpec]) => (
                <Simple
                  key={subName}
                  name={`${name}.${index}.${subName}`}
                  spec={subSpec}
                  value={entries[index]?.[subName]}
                  images={images}
                />
              ))}
            </fieldset>
          ))}
        </div>
      );
    }
    default:
      return <Simple name={name} spec={spec} value={value} images={images} />;
  }
}

/**
 * Editor for a page's designed sections, generated from their declaration
 * (src/features/cms/sections.ts). One panel per section, in page order.
 * Every value is validated again on the server.
 */
export function SectionFields({ name, spec, content, images }: SectionFieldsProps) {
  return (
    <>
      <input type="hidden" name={sectionsKeyField} value={name} />
      {Object.entries(spec).map(([key, section]) => (
        <AdminPanel key={key} title={section.label} description={section.description}>
          {Object.entries(section.fields).map(([fieldName, fieldSpec]) => (
            <Field
              key={fieldName}
              name={contentField(key, fieldName)}
              spec={fieldSpec}
              value={content?.[key]?.[fieldName]}
              images={images}
            />
          ))}
        </AdminPanel>
      ))}
    </>
  );
}
