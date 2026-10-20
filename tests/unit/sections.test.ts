import { describe, expect, it } from "vitest";
import {
  parseItems,
  parseSections,
  readSections,
  sectionFormValues,
  sectionImageFields,
  sectionsSchema,
  type SectionsSpec,
} from "@/features/cms/sections";
import { landingSections } from "@/features/pages/landing-content";
import { pageRegistry } from "@/features/pages/registry";
import { designedProgrammeSections } from "@/features/programmes/designed-content";
import { bespokeProgrammeSlugs } from "@/features/programmes/schema";
import { parseInline } from "@/lib/rich-text";
import { fillMissing } from "../../prisma/seed/fill-content";
import { seedLandingContent } from "../../prisma/seed/landing-content";
import { seedProgrammeContent } from "../../prisma/seed/programme-content";

const imageId = (asset: { src: string }) => `media-${asset.src}`;
const landing = seedLandingContent(imageId);
const programmes = seedProgrammeContent(imageId);

/** Posts values the way the browser does: checkboxes only when ticked. */
function toForm(values: Record<string, string | boolean>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === true) data.set(key, "on");
    else if (value !== false) data.set(key, value);
  }
  return data;
}

const designed: [string, SectionsSpec, unknown][] = [
  ...Object.entries(landingSections).map(
    ([slug, spec]) =>
      [slug, spec as SectionsSpec, landing[slug as keyof typeof landing]] as [
        string,
        SectionsSpec,
        unknown,
      ],
  ),
  ...Object.entries(designedProgrammeSections).map(
    ([slug, spec]) =>
      [slug, spec as SectionsSpec, programmes[slug as keyof typeof programmes]] as [
        string,
        SectionsSpec,
        unknown,
      ],
  ),
];

describe("designed section declarations", () => {
  it("cover every landing page in the registry and every founding programme", () => {
    const landingSlugs = Object.entries(pageRegistry)
      .filter(([, entry]) => entry.kind === "landing")
      .map(([slug]) => slug);
    expect(Object.keys(landingSections).sort()).toEqual(landingSlugs.sort());
    expect(Object.keys(designedProgrammeSections).sort()).toEqual(
      [...bespokeProgrammeSlugs].sort(),
    );
  });

  it.each(designed)("%s: the seeded M03 copy is valid content", (_slug, spec, content) => {
    const result = sectionsSchema(spec).safeParse(content);
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it.each(designed)("%s: the editor's form round-trips the content", (slug, spec, content) => {
    const parsed = sectionsSchema(spec).parse(content);
    const posted = readSections(toForm(sectionFormValues(slug, spec, parsed)), spec);
    expect(sectionsSchema(spec).parse(posted)).toEqual(parsed);
  });
});

describe("section validation", () => {
  const spec = landingSections.about;
  const valid = () => structuredClone(landing.about);

  it("reports each problem beside its own control", () => {
    const content = valid();
    content.purpose.action.href = "/nowhere";
    content.explore.cards[1]!.imageId = "";
    content.facts.title = "";
    const result = parseSections(spec, content);
    expect(result.errors).toMatchObject({
      "content.purpose.action.href": expect.stringMatching(/page on this site/),
      "content.explore.cards.1.imageId": "Choose an image.",
      "content.facts.title": expect.any(String),
    });
  });

  it("keeps the designed number of cards", () => {
    const content = valid();
    content.explore.cards.pop();
    expect(parseSections(spec, content).errors).toHaveProperty("content.explore.cards");
  });

  it("refuses links in rich text that are not approved destinations", () => {
    const content = valid();
    content.facts.history = "Read [our story](/not-a-page).";
    expect(parseSections(spec, content).errors).toHaveProperty("content.facts.history");
    content.facts.history = "Read our [mission](/about/mission) or [Kew](https://www.kew.org).";
    expect(parseSections(spec, content).errors).toBeNull();
  });

  it("requires a title for each item and reports it on the textarea", () => {
    expect(parseItems("Stray text\n\n## Collect\nGather it.")).toEqual([
      { title: "", body: "Stray text" },
      { title: "Collect", body: "Gather it." },
    ]);
    const content = structuredClone(landing.herbarium);
    content.process.items = parseItems("Stray text\n\n## Collect\nGather it.");
    expect(parseSections(landingSections.herbarium, content).errors).toEqual({
      "content.process.items": 'Start each item with "## " and its title.',
    });
  });

  it("lists every chosen image with the field it was chosen in", () => {
    const images = sectionImageFields(landingSections["get-involved"], landing["get-involved"]);
    expect(images.map((image) => image.name)).toEqual([
      "content.ways.panels.0.imageId",
      "content.ways.panels.1.imageId",
      "content.ways.panels.2.imageId",
      "content.ways.panels.3.imageId",
    ]);
  });
});

describe("filling missing sections", () => {
  it("adds absent keys and never replaces existing values", () => {
    const current = { heritage: { title: "Edited", landscapes: ["kept"] }, layout: { hidden: [] } };
    const defaults = {
      heritage: { title: "Seeded", landscapes: ["seeded"], statement: "Added" },
      layout: { hidden: ["presence"], order: ["introduction"] },
      presence: { title: "Added" },
    };
    expect(fillMissing(current, defaults)).toEqual({
      heritage: { title: "Edited", landscapes: ["kept"], statement: "Added" },
      layout: { hidden: [], order: ["introduction"] },
      presence: { title: "Added" },
    });
  });

  it("fills content that was never set", () => {
    expect(fillMissing({}, { a: 1 })).toEqual({ a: 1 });
    expect(fillMissing(null, { a: 1 })).toEqual({ a: 1 });
    expect(fillMissing(undefined, { a: 1 })).toEqual({ a: 1 });
  });

  it("is idempotent", () => {
    const once = fillMissing({ about: {} }, landing);
    expect(fillMissing(once, landing)).toEqual(once);
  });
});

describe("rich text emphasis", () => {
  it("marks scientific names in italics, alongside links", () => {
    expect(parseInline("*Prunus africana* is listed by [CITES](https://cites.org).")).toEqual([
      { type: "emphasis", value: "Prunus africana" },
      { type: "text", value: " is listed by " },
      { type: "link", text: "CITES", href: "https://cites.org" },
      { type: "text", value: "." },
    ]);
  });
});
