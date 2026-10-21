import { z } from "zod";

/** The public forms. Values match the `inquiry_kind` database enum. */
export const enquiryKindSchema = z.enum(["CONTACT", "VOLUNTEER", "PARTNERSHIP"]);
export type EnquiryKind = z.infer<typeof enquiryKindSchema>;

export const enquiryKindLabel: Record<EnquiryKind, string> = {
  CONTACT: "Contact",
  VOLUNTEER: "Volunteer interest",
  PARTNERSHIP: "Partnership enquiry",
};

export const contactTopics = [
  { value: "general", label: "General question" },
  { value: "herbarium", label: "Herbarium and research" },
  { value: "education", label: "Education and resources" },
  { value: "accessibility", label: "Website accessibility" },
  { value: "other", label: "Something else" },
] as const;

/** Starting role areas from the approved volunteer copy. Not open vacancies. */
export const volunteerAreas = [
  { value: "documentation", label: "Botanical documentation" },
  { value: "herbarium", label: "Herbarium support" },
  { value: "education", label: "Education" },
  { value: "editorial", label: "Editorial assistance" },
] as const;

export const partnershipTypes = [
  { value: "research", label: "Research or herbarium collaboration" },
  { value: "conservation", label: "Conservation project" },
  { value: "education", label: "Education or community programme" },
  { value: "other", label: "Something else" },
] as const;

function choice<T extends readonly { value: string }[]>(options: T, message: string) {
  const values = options.map((option) => option.value) as [
    T[number]["value"],
    ...T[number]["value"][],
  ];
  return z.enum(values, { error: message });
}

export function labelOf(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

const name = z.string().min(1, "Enter your name.").max(120, "Use at most 120 characters.");
const email = z
  .email("Enter an email address in the format name@example.com.")
  .max(254, "Use at most 254 characters.");
const message = z
  .string()
  .min(10, "Write at least 10 characters.")
  .max(5000, "Use at most 5,000 characters.");
const consent = z.literal(true, { error: "Confirm that EACH may store your details to reply." });

export const contactInputSchema = z.object({
  kind: z.literal("CONTACT"),
  name,
  email,
  topic: choice(contactTopics, "Choose a topic."),
  message,
  consent,
});

export const volunteerInputSchema = z.object({
  kind: z.literal("VOLUNTEER"),
  name,
  email,
  areas: z
    .array(choice(volunteerAreas, "Choose from the listed areas."))
    .min(1, "Choose at least one area.")
    .max(volunteerAreas.length),
  availability: z.string().max(300, "Use at most 300 characters.").nullable(),
  message,
  consent,
});

export const partnershipInputSchema = z.object({
  kind: z.literal("PARTNERSHIP"),
  name,
  email,
  organisation: z
    .string()
    .min(1, "Enter your organisation's name.")
    .max(200, "Use at most 200 characters."),
  partnershipType: choice(partnershipTypes, "Choose a type of partnership."),
  message,
  consent,
});

/** Server-side validation of every public form, whatever the browser sent. */
export const enquiryInputSchema = z.discriminatedUnion(
  "kind",
  [contactInputSchema, volunteerInputSchema, partnershipInputSchema],
  { error: "Unknown form." },
);

export type EnquiryInput = z.infer<typeof enquiryInputSchema>;

/** Name of the hidden field that people never fill in; bots often do. */
export const HONEYPOT_FIELD = "website";
