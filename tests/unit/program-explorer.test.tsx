// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgramExplorer } from "@/components/sections/program-explorer";
import { PendingContent } from "@/components/ui/pending-content";
import { herbariumProgramme, programmes } from "@/content/programmes";

const items = [...programmes, herbariumProgramme];

function activeLink() {
  return document.querySelector("[data-explorer-list] a[data-active]");
}

function visibleImageSrc() {
  return [...document.querySelectorAll("img")]
    .find((img) => img.className.includes("opacity-100"))
    ?.getAttribute("src");
}

describe("ProgramExplorer", () => {
  it("renders every programme as a link with its summary always visible", () => {
    render(<ProgramExplorer items={items} />);
    for (const item of items) {
      const link = screen.getByRole("link", { name: new RegExp(item.title) });
      expect(link.getAttribute("href")).toBe(item.href);
      expect(screen.getByText(item.summary)).toBeTruthy();
    }
    expect(activeLink()?.getAttribute("href")).toBe(items[0]?.href);
  });

  it("brings a programme forward on keyboard focus", () => {
    render(<ProgramExplorer items={items} />);
    const target = items[2]!;
    fireEvent.focus(screen.getByRole("link", { name: new RegExp(target.title) }));
    expect(activeLink()?.getAttribute("href")).toBe(target.href);
    expect(visibleImageSrc()).toContain(encodeURIComponent(target.image.src));
  });

  it("follows mouse hover but ignores touch, which simply navigates", () => {
    render(<ProgramExplorer items={items} />);
    const second = screen.getByRole("link", { name: new RegExp(items[1]!.title) });
    const third = screen.getByRole("link", { name: new RegExp(items[2]!.title) });
    fireEvent.pointerEnter(third, { pointerType: "touch" });
    expect(activeLink()?.getAttribute("href")).toBe(items[0]?.href);
    fireEvent.pointerEnter(second, { pointerType: "mouse" });
    expect(activeLink()?.getAttribute("href")).toBe(items[1]?.href);
  });

  it("keeps the panel photographs decorative and credits the active one", () => {
    render(<ProgramExplorer items={items} />);
    for (const img of document.querySelectorAll("[aria-hidden='true'] img")) {
      expect(img.getAttribute("alt")).toBe("");
    }
    expect(screen.getByRole("link", { name: items[0]!.image.credit.author })).toBeTruthy();
  });
});

describe("PendingContent", () => {
  it("labels missing content and names what is needed", () => {
    render(<PendingContent item="leadership" />);
    const note = screen.getByRole("note");
    expect(note.dataset.pending).toBe("leadership");
    expect(note.textContent).toContain("Awaiting content from EACH");
    expect(note.textContent).toContain("Leadership and governance");
  });

  it("distinguishes drafts from missing content, including for screen readers", () => {
    render(<PendingContent item="values" variant="badge" />);
    const badge = document.querySelector("[data-pending='values']");
    expect(badge?.textContent).toContain("Draft");
    expect(badge?.textContent).toContain("Values and principles (Draft for EACH review)");
  });
});
