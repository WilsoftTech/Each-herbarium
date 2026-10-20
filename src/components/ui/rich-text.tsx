import Link from "next/link";
import { parseRichText, type Inline } from "@/lib/rich-text";
import { Prose } from "./prose";

function InlineContent({ content }: { content: Inline[] }) {
  return content.map((part, index) =>
    part.type === "text" ? (
      part.value
    ) : part.href.startsWith("/") ? (
      <Link key={index} href={part.href}>
        {part.text}
      </Link>
    ) : (
      <a key={index} href={part.href} rel="noopener noreferrer">
        {part.text}
      </a>
    ),
  );
}

/** Renders CMS rich text (see src/lib/rich-text.ts) inside the reading column. */
export function RichText({ source, className }: { source: string; className?: string }) {
  return (
    <Prose className={className}>
      {parseRichText(source).map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h2 key={index}>{block.text}</h2>;
          case "paragraph":
            return (
              <p key={index}>
                <InlineContent content={block.content} />
              </p>
            );
          case "list":
            return (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <InlineContent content={item} />
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </Prose>
  );
}
