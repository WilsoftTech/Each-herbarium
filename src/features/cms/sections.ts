import { z } from "zod";
import { isApprovedHref } from "@/config/routes";
import * as formData from "./form-data";

/**
 * Typed, fixed sections for designed pages (ADR 0013). A page declares its
 * sections and their fields once; the declaration gives the Zod schema, the
 * form reader, the field names used for validation messages, the media ids
 * the content refers to and the editor (components/section-fields.tsx).
 *
 * This is deliberately not a page builder: editors change words, images,
 * list items and link destinations, never which sections exist, their order
 * or their design. Those stay in the page's composition in code.
 */

type Hint = { hint?: string };
type Text = Hint & { label: string; max?: number; optional?: true };

export type SimpleFieldSpec =
  /** One line of plain text. */
  | (Text & { type: "line" })
  /** A short plain-text passage (one paragraph). */
  | (Text & { type: "text"; rows?: number })
  /** Paragraphs, lists, links and *emphasis* (src/lib/rich-text.ts). Links must be approved. */
  | (Text & { type: "rich"; rows?: number })
  /** Several paragraphs, stored as an array. */
  | (Hint & { type: "paragraphs"; label: string; max?: number })
  /** A link destination: an approved site path or an https address. */
  | (Hint & { type: "href"; label: string })
  /** A media library image id. */
  | (Hint & { type: "image"; label: string })
  /** A checkbox. */
  | (Hint & { type: "toggle"; label: string });

export type FieldSpec =
  | SimpleFieldSpec
  /** A button or text link: label and destination. */
  | (Hint & { type: "link"; label: string })
  /** A list of short entries, one per line. */
  | (Hint & { type: "lines"; label: string; min?: number; max?: number })
  /** Titled items ("## Title" then its text), such as numbered steps or principles. */
  | (Hint & { type: "items"; label: string; min?: number; max?: number })
  /** A fixed number of repeated groups (cards, panels), so the layout stays as designed. */
  | (Hint & {
      type: "group";
      label: string;
      /** Name of one entry in the editor, e.g. "Card". */
      itemLabel: string;
      count: number;
      fields: Record<string, SimpleFieldSpec>;
    });

export type SectionSpec = {
  label: string;
  description?: string;
  fields: Record<string, FieldSpec>;
};

export type SectionsSpec = Record<string, SectionSpec>;

type SimpleValue<F> = F extends { type: "paragraphs" }
  ? string[]
  : F extends { type: "toggle" }
    ? boolean
    : string;

export type FieldValue<F> = F extends { type: "link" }
  ? { label: string; href: string }
  : F extends { type: "lines" }
    ? string[]
    : F extends { type: "items" }
      ? { title: string; body: string }[]
      : F extends { type: "group"; fields: infer G }
        ? { -readonly [K in keyof G]: SimpleValue<G[K]> }[]
        : SimpleValue<F>;

export type SectionsValue<S extends SectionsSpec> = {
  -readonly [K in keyof S]: {
    -readonly [F in keyof S[K]["fields"]]: FieldValue<S[K]["fields"][F]>;
  };
};

/* Field declarations. Each returns its literal type so values infer precisely. */

export const field = {
  line: <const O extends Omit<Text, "label">>(label: string, options?: O) =>
    ({ type: "line", label, ...options }) as { type: "line"; label: string } & O,
  text: <const O extends Omit<Text, "label"> & { rows?: number }>(label: string, options?: O) =>
    ({ type: "text", label, ...options }) as { type: "text"; label: string } & O,
  rich: <const O extends Omit<Text, "label"> & { rows?: number }>(label: string, options?: O) =>
    ({ type: "rich", label, ...options }) as { type: "rich"; label: string } & O,
  paragraphs: (label: string, options?: Hint & { max?: number }) =>
    ({ type: "paragraphs", label, ...options }) as const,
  href: (label: string, options?: Hint) => ({ type: "href", label, ...options }) as const,
  image: (label: string, options?: Hint) => ({ type: "image", label, ...options }) as const,
  toggle: (label: string, options?: Hint) => ({ type: "toggle", label, ...options }) as const,
  link: (label: string, options?: Hint) => ({ type: "link", label, ...options }) as const,
  lines: (label: string, options?: Hint & { min?: number; max?: number }) =>
    ({ type: "lines", label, ...options }) as const,
  items: (label: string, options?: Hint & { min?: number; max?: number }) =>
    ({ type: "items", label, ...options }) as const,
  group: <const G extends Record<string, SimpleFieldSpec>>(
    label: string,
    options: { itemLabel: string; count: number; fields: G } & Hint,
  ) => ({ type: "group", label, ...options }) as const,
};

/** The usual heading of a designed section: the label above the heading and the heading. */
export const headingFields = {
  eyebrow: field.line("Label above the heading", { max: 80 }),
  title: field.line("Heading", { max: 200 }),
};

/** A section heading with its introduction. */
export const introducedHeadingFields = {
  ...headingFields,
  description: field.text("Introduction", { max: 600, rows: 3 }),
};

/** "Next" link at the foot of a page (SequenceNav). */
export const nextLinkFields = {
  label: field.line("Label", { max: 80 }),
  title: field.line("Title", { max: 120 }),
  href: field.href("Destination"),
  description: field.text("Description", { max: 300, rows: 2 }),
};

/* Schemas */

const linkPattern = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
const hrefMessage = "Use a page on this site (such as /volunteer) or a full https:// address.";

const hrefSchema = z.string().trim().refine(isApprovedHref, hrefMessage);

function textSchema(spec: Text, label: string) {
  const max = spec.max ?? 2000;
  const base = z.string().trim().max(max, `Keep this under ${max} characters.`);
  return spec.optional ? base : base.min(1, `Enter ${label.toLowerCase()}.`);
}

function simpleSchema(spec: SimpleFieldSpec): z.ZodType {
  switch (spec.type) {
    case "line":
    case "text":
      return textSchema(spec, spec.label);
    case "rich":
      return textSchema(spec, spec.label).refine(
        (value) =>
          [...value.matchAll(linkPattern)].every(([, , href = ""]) => isApprovedHref(href)),
        `Links: ${hrefMessage}`,
      );
    case "paragraphs":
      return z
        .array(z.string().trim().min(1))
        .min(1, "Write at least one paragraph.")
        .max(spec.max ?? 6, `Use at most ${spec.max ?? 6} paragraphs.`);
    case "href":
      return hrefSchema;
    case "image":
      return z.string().min(1, "Choose an image.");
    case "toggle":
      return z.boolean();
  }
}

function fieldSchema(spec: FieldSpec): z.ZodType {
  switch (spec.type) {
    case "link":
      return z.object({
        label: z.string().trim().min(1, "Enter a label.").max(60, "Keep it under 60 characters."),
        href: hrefSchema,
      });
    case "lines": {
      const min = spec.min ?? 1;
      const max = spec.max ?? 12;
      return z
        .array(z.string().trim().min(1).max(300, "Keep each line under 300 characters."))
        .min(min, `List at least ${min}.`)
        .max(max, `List at most ${max}.`);
    }
    case "items": {
      const min = spec.min ?? 1;
      const max = spec.max ?? 12;
      return z
        .array(
          z.object({
            title: z
              .string()
              .trim()
              .min(1, 'Start each item with "## " and its title.')
              .max(120, "Keep each title under 120 characters."),
            body: z
              .string()
              .trim()
              .min(1, "Write a sentence under each title.")
              .max(600, "Keep each item's text under 600 characters."),
          }),
        )
        .min(min, `Write at least ${min} item${min === 1 ? "" : "s"}.`)
        .max(max, `Write at most ${max} items.`);
    }
    case "group":
      return z
        .array(
          z.object(
            Object.fromEntries(
              Object.entries(spec.fields).map(([key, sub]) => [key, simpleSchema(sub)]),
            ),
          ),
        )
        .length(spec.count, `Fill in all ${spec.count}.`);
    default:
      return simpleSchema(spec);
  }
}

/** The Zod schema for content declared by `spec`. */
export function sectionsSchema<S extends SectionsSpec>(spec: S): z.ZodType<SectionsValue<S>> {
  const shape = Object.fromEntries(
    Object.entries(spec).map(([key, section]) => [
      key,
      z.object(
        Object.fromEntries(
          Object.entries(section.fields).map(([name, sub]) => [name, fieldSchema(sub)]),
        ),
      ),
    ]),
  );
  // The shape is built from `spec` field by field, so it matches SectionsValue<S>.
  return z.object(shape) as unknown as z.ZodType<SectionsValue<S>>;
}

/* Form fields */

/** Field name for a path in the content, e.g. content.process.items. */
export const contentField = (...path: (string | number)[]) => ["content", ...path].join(".");

/** Hidden field naming the declaration the form was rendered from (see readSections). */
export const sectionsKeyField = "content.$sections";

/** Text with its line structure, as rich text and "## " items need it. */
function multiline(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.replace(/\r\n?/g, "\n").trim() : "";
}

function readSimple(form: FormData, name: string, spec: SimpleFieldSpec): unknown {
  switch (spec.type) {
    case "rich":
      return multiline(form, name);
    case "paragraphs":
      return formData.paragraphs(multiline(form, name));
    case "toggle":
      return formData.checkbox(form, name);
    default:
      return formData.text(form, name);
  }
}

/** Items written as "## Title" followed by their text. Text before the first title becomes an untitled item. */
export function parseItems(source: string): { title: string; body: string }[] {
  const { sections, stray } = formData.sections(source);
  const items = sections.map((item) => ({ title: item.heading, body: item.body.join(" ") }));
  if (stray) {
    const before = source.replace(/\r\n?/g, "\n").split(/^[ \t]*##[ \t]+/m)[0] ?? "";
    items.unshift({ title: "", body: formData.paragraphs(before).join(" ") });
  }
  return items;
}

/** The inverse of parseItems, for filling a textarea. */
export function joinItems(items: readonly { title: string; body: string }[]): string {
  return items.map((item) => `## ${item.title}\n${item.body}`).join("\n\n");
}

function simpleFormValue(spec: SimpleFieldSpec, value: unknown): string | boolean {
  if (spec.type === "toggle") return value === true;
  if (spec.type === "paragraphs") {
    return formData.joinParagraphs(Array.isArray(value) ? (value as string[]) : []);
  }
  return typeof value === "string" ? value : "";
}

/**
 * The form fields the editor posts for `content`, by field name (the inverse
 * of readSections). Used to resubmit content unchanged, e.g. in tests.
 */
export function sectionFormValues(
  name: string,
  spec: SectionsSpec,
  content: SectionsValue<SectionsSpec>,
): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = { [sectionsKeyField]: name };
  for (const [key, section] of Object.entries(spec)) {
    for (const [fieldName, sub] of Object.entries(section.fields)) {
      const path = contentField(key, fieldName);
      const value: unknown = content[key]?.[fieldName];
      switch (sub.type) {
        case "link": {
          const link = value as { label: string; href: string };
          values[`${path}.label`] = link.label;
          values[`${path}.href`] = link.href;
          break;
        }
        case "lines":
          values[path] = formData.joinLines(value as string[]);
          break;
        case "items":
          values[path] = joinItems(value as { title: string; body: string }[]);
          break;
        case "group":
          (value as Record<string, unknown>[]).forEach((entry, index) => {
            for (const [subName, subSpec] of Object.entries(sub.fields)) {
              values[`${path}.${index}.${subName}`] = simpleFormValue(subSpec, entry[subName]);
            }
          });
          break;
        default:
          values[path] = simpleFormValue(sub, value);
      }
    }
  }
  return values;
}

/** Reads the editor's fields (named content.<section>.<field>…) into content for `spec`. */
export function readSections(form: FormData, spec: SectionsSpec): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(spec).map(([key, section]) => [
      key,
      Object.fromEntries(
        Object.entries(section.fields).map(([name, sub]) => {
          const path = contentField(key, name);
          switch (sub.type) {
            case "link":
              return [
                name,
                {
                  label: formData.text(form, `${path}.label`),
                  href: formData.text(form, `${path}.href`),
                },
              ];
            case "lines":
              return [name, formData.lines(multiline(form, path))];
            case "items":
              return [name, parseItems(multiline(form, path))];
            case "group":
              return [
                name,
                Array.from({ length: sub.count }, (_, index) =>
                  Object.fromEntries(
                    Object.entries(sub.fields).map(([subName, subSpec]) => [
                      subName,
                      readSimple(form, `${path}.${index}.${subName}`, subSpec),
                    ]),
                  ),
                ),
              ];
            default:
              return [name, readSimple(form, path, sub)];
          }
        }),
      ),
    ]),
  );
}

/**
 * The editor field a validation issue belongs to. Lists edited in one
 * textarea report on that textarea; links and groups on their own inputs.
 */
export function sectionFieldName(spec: SectionsSpec, path: readonly PropertyKey[]): string {
  const [section = "", name = "", ...rest] = path.map(String);
  const sub = spec[section]?.fields[name];
  if (!sub) return contentField(...[section, name].filter(Boolean));
  if (sub.type === "link" && rest[0]) return contentField(section, name, rest[0]);
  if (sub.type === "group" && rest[0] !== undefined && rest[1] !== undefined) {
    return contentField(section, name, rest[0], rest[1]);
  }
  return contentField(section, name);
}

/**
 * Validates content for `spec`. Field errors are keyed by the editor's field
 * names, so each message appears beside its control.
 */
export function parseSections<S extends SectionsSpec>(
  spec: S,
  content: unknown,
): { content: SectionsValue<S>; errors: null } | { content: null; errors: Record<string, string> } {
  const result = sectionsSchema(spec).safeParse(content);
  if (result.success) return { content: result.data, errors: null };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    errors[sectionFieldName(spec, issue.path)] ??= issue.message;
  }
  return { content: null, errors };
}

/** Every image in the content with the editor field it is chosen in. */
export function sectionImageFields(
  spec: SectionsSpec,
  content: unknown,
): { name: string; id: string }[] {
  if (!content || typeof content !== "object") return [];
  const found: { name: string; id: string }[] = [];
  const record = content as Record<string, Record<string, unknown> | undefined>;
  for (const [key, section] of Object.entries(spec)) {
    const value = record[key];
    if (!value || typeof value !== "object") continue;
    for (const [name, sub] of Object.entries(section.fields)) {
      const fieldValue = value[name];
      if (sub.type === "image" && typeof fieldValue === "string" && fieldValue) {
        found.push({ name: contentField(key, name), id: fieldValue });
      }
      if (sub.type === "group" && Array.isArray(fieldValue)) {
        (fieldValue as (Record<string, unknown> | undefined)[]).forEach((entry, index) => {
          for (const [subName, subSpec] of Object.entries(sub.fields)) {
            const id = entry?.[subName];
            if (subSpec.type === "image" && typeof id === "string" && id) {
              found.push({ name: contentField(key, name, index, subName), id });
            }
          }
        });
      }
    }
  }
  return found;
}

/** Every media id the content refers to (for publishing checks, previews and rendering). */
export function sectionImageIds(spec: SectionsSpec, content: unknown): string[] {
  return [...new Set(sectionImageFields(spec, content).map((image) => image.id))];
}
