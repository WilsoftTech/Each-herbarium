import { describe, expect, it } from "vitest";
import { joinSections, lines, paragraphs, sections, text, values } from "@/features/cms/form-data";

describe("admin form parsing", () => {
  it("splits paragraphs on blank lines and joins wrapped lines", () => {
    expect(paragraphs("One\ncontinues\n\n\nTwo\r\n\r\nThree ")).toEqual([
      "One continues",
      "Two",
      "Three",
    ]);
    expect(paragraphs("   ")).toEqual([]);
  });

  it("reads titled sections and round-trips them", () => {
    const source = "## First\n\nA.\n\nB.\n\n## Second\nC.";
    const parsed = sections(source);
    expect(parsed).toEqual({
      stray: false,
      sections: [
        { heading: "First", body: ["A.", "B."] },
        { heading: "Second", body: ["C."] },
      ],
    });
    expect(sections(joinSections(parsed.sections)).sections).toEqual(parsed.sections);
  });

  it("flags text before the first heading", () => {
    const parsed = sections("Intro without heading\n\n## Real\nBody");
    expect(parsed.stray).toBe(true);
    expect(parsed.sections).toEqual([{ heading: "Real", body: ["Body"] }]);
  });

  it("ignores files and blanks where strings are expected", () => {
    const form = new FormData();
    form.set("title", "  Hello  ");
    form.set("file", new File(["x"], "x.txt"));
    form.append("ids", "a");
    form.append("ids", "");
    form.append("ids", "b");
    expect(text(form, "title")).toBe("Hello");
    expect(text(form, "file")).toBe("");
    expect(values(form, "ids")).toEqual(["a", "b"]);
    expect(lines("  A \n\n B")).toEqual(["A", "B"]);
  });
});
