/**
 * A deliberately small text format for CMS prose. It is parsed into a tree
 * and rendered as React elements, so stored text can never inject HTML or
 * scripts.
 *
 *   ## Heading
 *   A paragraph. Blank lines separate paragraphs.
 *   - A list item
 *   [Link text](/contact) or [Link text](https://example.org)
 *
 * Links are kept only for site paths and https URLs; anything else is shown
 * as plain text.
 */

export type Inline = { type: "text"; value: string } | { type: "link"; text: string; href: string };

export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; content: Inline[] }
  | { type: "list"; items: Inline[][] };

const linkPattern = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/** Only internal paths and https URLs become links. */
export function isSafeHref(href: string): boolean {
  if (/^\/(?!\/)[\w\-./#?=&%]*$/.test(href)) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function parseInline(text: string): Inline[] {
  const result: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(linkPattern)) {
    const [whole, label = "", href = ""] = match;
    const start = match.index;
    if (start > last) result.push({ type: "text", value: text.slice(last, start) });
    result.push(
      isSafeHref(href) ? { type: "link", text: label, href } : { type: "text", value: whole },
    );
    last = start + whole.length;
  }
  if (last < text.length) result.push({ type: "text", value: text.slice(last) });
  return result;
}

export function parseRichText(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", content: parseInline(paragraph.join(" ")) });
      paragraph = [];
    }
    if (list.length) {
      blocks.push({ type: "list", items: list.map(parseInline) });
      list = [];
    }
  };

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "heading", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      if (paragraph.length) flush();
      list.push(line.slice(2).trim());
    } else {
      if (list.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}
