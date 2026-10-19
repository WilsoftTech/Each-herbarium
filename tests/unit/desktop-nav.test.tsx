// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LazyMotion, domAnimation } from "motion/react";
import { describe, expect, it, vi } from "vitest";
import { DesktopNav } from "@/components/navigation/desktop-nav";

function renderNav(pathname = "/") {
  const onOpenChange = vi.fn();
  const utils = render(
    <LazyMotion features={domAnimation}>
      <DesktopNav pathname={pathname} onOpenChange={onOpenChange} />
      <a href="#after">After the navigation</a>
    </LazyMotion>,
  );
  return { ...utils, onOpenChange };
}

const trigger = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name}`) });

describe("DesktopNav", () => {
  it("renders Home as a link and every other item as a collapsed menu button", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    for (const name of ["About EACH", "Our Work", "Herbarium", "Get Involved"]) {
      const button = trigger(name);
      expect(button.getAttribute("aria-expanded")).toBe("false");
      expect(button.hasAttribute("aria-controls")).toBe(false);
    }
  });

  it("opens on click, points aria-controls at the panel and reports the change", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderNav();
    await user.click(trigger("Herbarium"));

    const button = trigger("Herbarium");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    const panel = document.getElementById(button.getAttribute("aria-controls") ?? "");
    expect(panel).not.toBeNull();
    expect(panel?.textContent).toContain("Collections");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("closes on a second click", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(trigger("Herbarium"));
    await user.click(trigger("Herbarium"));
    expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("false");
    await waitFor(() => expect(document.getElementById("mega-menu-herbarium")).toBeNull());
  });

  it("switches menus when another trigger is clicked", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(trigger("Herbarium"));
    await user.click(trigger("Our Work"));
    expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("false");
    expect(trigger("Our Work").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens with Enter and closes with Escape, returning focus to the trigger", async () => {
    const user = userEvent.setup();
    renderNav();
    trigger("About EACH").focus();
    await user.keyboard("{Enter}");
    expect(trigger("About EACH").getAttribute("aria-expanded")).toBe("true");

    await user.tab();
    expect(document.activeElement?.textContent).toContain("Explore About EACH");

    await user.keyboard("{Escape}");
    expect(trigger("About EACH").getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger("About EACH"));
  });

  it("opens with ArrowDown and focuses the first link in the panel", async () => {
    const user = userEvent.setup();
    renderNav();
    trigger("Our Work").focus();
    await user.keyboard("{ArrowDown}");
    expect(trigger("Our Work").getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement?.closest("#mega-menu-our-work")).not.toBeNull();
  });

  it("moves between top-level items with the arrow, Home and End keys", async () => {
    const user = userEvent.setup();
    renderNav();
    screen.getByRole("link", { name: "Home" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(trigger("About EACH"));
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(document.activeElement).toBe(trigger("Get Involved"));
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Home" }));
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(trigger("Get Involved"));
  });

  it("closes when focus leaves the navigation", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(trigger("Get Involved"));
    act(() => screen.getByRole("link", { name: "After the navigation" }).focus());
    expect(trigger("Get Involved").getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on a pointer press outside the navigation", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(trigger("Herbarium"));
    fireEvent.pointerDown(document.body);
    expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("false");
  });

  it("opens on mouse hover after a short delay and pins on click", async () => {
    vi.useFakeTimers();
    try {
      renderNav();
      fireEvent.pointerEnter(trigger("Herbarium"), { pointerType: "mouse" });
      expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("false");
      act(() => vi.advanceTimersByTime(150));
      expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("true");

      // A click on a hover-opened menu pins it instead of closing it.
      fireEvent.click(trigger("Herbarium"), { detail: 1 });
      expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("true");

      // Leaving a pinned menu keeps it open.
      fireEvent.pointerLeave(screen.getByRole("navigation"), { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(500));
      expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("true");
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes a hover-opened menu when the pointer leaves", () => {
    vi.useFakeTimers();
    try {
      renderNav();
      fireEvent.pointerEnter(trigger("Our Work"), { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(150));
      expect(trigger("Our Work").getAttribute("aria-expanded")).toBe("true");
      fireEvent.pointerLeave(screen.getByRole("navigation"), { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(500));
      expect(trigger("Our Work").getAttribute("aria-expanded")).toBe("false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("ignores touch hover so taps use explicit click behaviour", () => {
    vi.useFakeTimers();
    try {
      renderNav();
      fireEvent.pointerEnter(trigger("Our Work"), { pointerType: "touch" });
      act(() => vi.advanceTimersByTime(500));
      expect(trigger("Our Work").getAttribute("aria-expanded")).toBe("false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes when the route changes", async () => {
    const user = userEvent.setup();
    const { rerender } = renderNav("/");
    await user.click(trigger("Herbarium"));
    rerender(
      <LazyMotion features={domAnimation}>
        <DesktopNav pathname="/herbarium" onOpenChange={() => {}} />
      </LazyMotion>,
    );
    expect(trigger("Herbarium").getAttribute("aria-expanded")).toBe("false");
  });
});
