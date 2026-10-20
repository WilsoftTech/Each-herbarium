import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, TextField } from "@/components/admin/form-fields";

/** Reads the fields rendered by SeoFields. Validated with seoInputSchema. */
export function readSeoFields(form: FormData) {
  const text = (name: string) => {
    const value = form.get(name);
    return typeof value === "string" && value.trim() ? value.trim() : null;
  };
  return {
    seoTitle: text("seoTitle"),
    seoDescription: text("seoDescription"),
    noindex: form.get("noindex") === "on",
  };
}

/**
 * Search and sharing overrides for an item with its own public page. Empty
 * fields fall back to the title and summary; the item's image is the
 * sharing image.
 */
export function SeoFields({
  value,
}: {
  value?: { seoTitle: string | null; seoDescription: string | null; noindex: boolean };
}) {
  return (
    <AdminPanel
      title="Search and sharing"
      description="Leave empty to use the title and summary. The main image is used when the page is shared."
    >
      <TextField
        name="seoTitle"
        label="Search title"
        maxLength={120}
        defaultValue={value?.seoTitle}
        hint="The site name is added automatically."
      />
      <TextField
        name="seoDescription"
        label="Search description"
        rows={2}
        maxLength={300}
        defaultValue={value?.seoDescription}
      />
      <CheckboxField
        name="noindex"
        label="Hide from search engines"
        defaultChecked={value?.noindex ?? false}
        hint="Adds noindex and leaves the page out of the sitemap. Placeholders are always hidden."
      />
    </AdminPanel>
  );
}
