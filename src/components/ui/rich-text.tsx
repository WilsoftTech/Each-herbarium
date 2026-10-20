import Link from "next/link";
import { parseRichText, type Block, type Inline } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import { Prose } from "./prose";

function InlineContent({ content, linkClassName }: { content: Inline[]; linkClassName?: string }) {
  return content.map((part, index) =>
    part.type === "text" ? (
      part.value
    ) : part.type === "emphasis" ? (
      <i key={index}>{part.value}</i>
    ) : part.href.startsWith("/") ? (
      <Link key={index} href={part.href} className={linkClassName}>
        {part.text}
      </Link>
    ) : (
      <a key={index} href={part.href} rel="noopener noreferrer" className={linkClassName}>
        {part.text}
      </a>
    ),
  );
}

function Blocks({ blocks, linkClassName }: { blocks: Block[]; linkClassName?: string }) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "heading":
        return <h2 key={index}>{block.text}</h2>;
      case "paragraph":
        return (
          <p key={index}>
            <InlineContent content={block.content} linkClassName={linkClassName} />
          </p>
        );
      case "list":
        return (
          <ul key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <InlineContent content={item} linkClassName={linkClassName} />
              </li>
            ))}
          </ul>
        );
    }
  });
}

/** Renders CMS rich text (see src/lib/rich-text.ts) inside the reading column. */
export function RichText({ source, className }: { source: string; className?: string }) {
  return (
    <Prose className={className}>
      <Blocks blocks={parseRichText(source)} />
    </Prose>
  );
}

/**
 * CMS rich text inside a designed section: paragraphs and lists inherit the
 * section's typography (spacing comes from `className`), links are underlined
 * in the primary colour. Headings in the source render as paragraphs here so
 * the section's heading outline is unchanged.
 */
export function RichParagraphs({ source, className }: { source: string; className?: string }) {
  const blocks = parseRichText(source).map((block): Block =>
    block.type === "heading"
      ? { type: "paragraph", content: [{ type: "text", value: block.text }] }
      : block,
  );
  return (
    <div className={cn("[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6", className)}>
      <Blocks
        blocks={blocks}
        linkClassName="rounded-sm text-primary underline underline-offset-4"
      />
    </div>
  );
}
