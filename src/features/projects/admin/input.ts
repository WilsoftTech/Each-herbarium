import { z } from "zod";
import { formData, readSeoFields } from "@/features/cms";
import { seoInputSchema, slugSchema, textSectionSchema } from "@/validation/content";

const { text, optionalText, checkbox, values, integer, paragraphs, sections, lines } = formData;

/** Operational status of the work itself, separate from editorial publication status. */
export const projectStatuses = ["PLANNED", "ACTIVE", "COMPLETED", "ON_HOLD"] as const;

const isoDate = z.iso.date("Use the date picker or YYYY-MM-DD.").nullable();
const listOf = (label: string) =>
  z.array(z.string().min(1).max(600)).max(30, `List at most 30 ${label}.`);

/** What the project editor may change. Validated on the server for every save. */
export const projectInputSchema = z
  .object({
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
    country: z.string().trim().max(100).nullable(),
    startDate: isoDate,
    endDate: isoDate,
    operationalStatus: z.enum(projectStatuses).nullable(),
    objectives: listOf("objectives"),
    activities: listOf("activities"),
    outcomes: listOf("outcomes"),
    references: listOf("references"),
    featured: z.boolean(),
    ...seoInputSchema.shape,
  })
  .refine((input) => !input.startDate || !input.endDate || input.endDate >= input.startDate, {
    path: ["endDate"],
    message: "The end date cannot be before the start date.",
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
      country: optionalText(form, "country"),
      startDate: optionalText(form, "startDate"),
      endDate: optionalText(form, "endDate"),
      operationalStatus: optionalText(form, "operationalStatus"),
      objectives: lines(text(form, "objectives")),
      activities: lines(text(form, "activities")),
      outcomes: lines(text(form, "outcomes")),
      references: lines(text(form, "references")),
      featured: checkbox(form, "featured"),
      ...readSeoFields(form),
    },
  };
}
