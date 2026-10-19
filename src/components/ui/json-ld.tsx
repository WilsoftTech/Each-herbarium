import { serializeJsonLd, type JsonLdObject } from "@/lib/structured-data";

/** Renders structured data. Pass only verified facts (see `@/lib/structured-data`). */
export function JsonLd({ data }: { data: JsonLdObject | readonly JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
