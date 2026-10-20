import type { TextSection } from "@/validation/content";

/**
 * Helpers for reading admin form fields. Every value is still validated with
 * Zod afterwards; these only normalise the raw strings.
 */

/** Trimmed text, or "" when absent or not a string (e.g. a File). */
export function text(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Trimmed text, or null when empty. */
export function optionalText(form: FormData, name: string): string | null {
  return text(form, name) || null;
}

export function checkbox(form: FormData, name: string): boolean {
  return form.get(name) === "on";
}

/** All string values of a multi-value field (checkbox groups, multi-selects). */
export function values(form: FormData, name: string): string[] {
  return form
    .getAll(name)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

export function integer(form: FormData, name: string): number {
  const value = Number(text(form, name));
  return Number.isInteger(value) ? value : Number.NaN;
}

/** Paragraphs separated by blank lines. Single line breaks are joined with spaces. */
export function paragraphs(source: string): string[] {
  return source
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/**
 * Blocks separated by blank lines, keeping line breaks inside a block, for
 * rich text stored as an array (article bodies): a list keeps one item per line.
 */
export function blocks(source: string): string[] {
  return source
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

/** The inverse of `paragraphs`, for filling a textarea. */
export function joinParagraphs(items: readonly string[]): string {
  return items.join("\n\n");
}

/**
 * Titled sections written as "## Heading" followed by paragraphs. Text before
 * the first heading is reported as an error by the caller's schema (it has no
 * heading).
 */
export function sections(source: string): { sections: TextSection[]; stray: boolean } {
  const normalised = source
    .replace(/\r\n?/g, "\n")
    .replace(/^[ \t]+(?=##)/gm, "")
    .trim();
  const result: TextSection[] = [];
  let stray = false;
  normalised.split(/^##[ \t]+/m).forEach((chunk, index) => {
    // Everything before the first heading.
    if (index === 0) {
      if (chunk.trim()) stray = true;
      return;
    }
    const [heading = "", ...rest] = chunk.split("\n");
    result.push({ heading: heading.trim(), body: paragraphs(rest.join("\n")) });
  });
  return { sections: result, stray };
}

export function joinSections(items: readonly TextSection[]): string {
  return items.map((item) => `## ${item.heading}\n\n${joinParagraphs(item.body)}`).join("\n\n");
}

/** The inverse of `lines`, for filling a textarea. */
export function joinLines(items: readonly string[]): string {
  return items.join("\n");
}

/** One entry per line, blanks dropped (authors, list fields). */
export function lines(source: string): string[] {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
