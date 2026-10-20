import { z } from "zod";
import { formData } from "@/features/cms";
import { slugSchema, textSectionSchema } from "@/validation/content";

const { text, optionalText, checkbox, values, integer, paragraphs, sections } = formData;

/** What the project editor may change. Validated on the server for every save. */
export const projectInputSchema = z.object({
  title: z.string().min(1, "Enter a title.").max(200),
  slug: slugSchema,
  summary: z.string().min(1, "Enter a summary.").max(500),
  ecosystem: z.string().min(1, "Enter the landscape type.").max(100),
  location: z.string().max(200).nullable(),
  period: z.string().max(100).nullable(),
  placeholder: z.boolean(),
  sortOrder: z.number("Enter a whole number.").int().min(0).max(10_000),
  imageId: z.string().min(1, "Choose the main image."),
  galleryIds: z.array(z.string()).max(12, "Choose at most 12 gallery images."),
  programmeIds: z.array(z.string()).max(20),
  partnerIds: z.array(z.string()).max(50),
  landscapeHeading: z.string().min(1, "Enter a heading for the landscape section.").max(200),
  landscapeBody: z
    .array(z.string().min(1))
    .min(1, "Describe the landscape in at least one paragraph."),
  story: z.array(textSectionSchema).max(30),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

/** Reads the editor form. Throws nothing; the caller validates the result. */
export function readProjectForm(form: FormData) {
  const story = sections(text(form, "story"));
  return {
    story,
    input: {
      title: text(form, "title"),
      slug: text(form, "slug"),
      summary: text(form, "summary"),
      ecosystem: text(form, "ecosystem"),
      location: optionalText(form, "location"),
      period: optionalText(form, "period"),
      placeholder: checkbox(form, "placeholder"),
      sortOrder: integer(form, "sortOrder"),
      imageId: text(form, "imageId"),
      galleryIds: values(form, "galleryIds"),
      programmeIds: values(form, "programmeIds"),
      partnerIds: values(form, "partnerIds"),
      landscapeHeading: text(form, "landscapeHeading"),
      landscapeBody: paragraphs(text(form, "landscapeBody")),
      story: story.sections,
    },
  };
}
