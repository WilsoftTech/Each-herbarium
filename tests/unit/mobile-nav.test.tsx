// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LazyMotion, domAnimation } from "motion/react";
import { describe, expect, it } from "vitest";
import { MobileNav } from "@/components/navigation/mobile-nav";

function renderNav(pathname = "/") {
  return render(
    <LazyMotion features={domAnimation}>
      <MobileNav pathname={pathname} />
    </LazyMotion>,
  );
}

const menuButton = () => screen.getByRole("button", { name: "Menu" });

describe("MobileNav", () => {
  it("starts closed with no dialog in the document", () => {
    renderNav();
    expect(menuButton().getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens a modal dialog, focuses Close, locks scroll and makes the page inert", async () => {
    const user = userEvent.setup();
    const { container } = renderNav();
    await user.click(menuButton());

    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(menuButton().getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close menu" }));
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(container.hasAttribute("inert")).toBe(true);
  });

  it("closes with Escape, restores scroll and returns focus to the Menu button", async () => {
    const user = userEvent.setup();
    const { container } = renderNav();
    await user.click(menuButton());
    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.documentElement.style.overflow).toBe("");
    expect(container.hasAttribute("inert")).toBe(false);
    expect(document.activeElement).toBe(menuButton());
  });

  it("keeps Tab and Shift+Tab inside the dialog", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(menuButton());
    const dialog = screen.getByRole("dialog");

    for (let i = 0; i < 12; i += 1) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    for (let i = 0; i < 12; i += 1) {
      await user.tab({ shift: true });
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("drills into a section, expands its groups and goes back", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(menuButton());
    await user.click(screen.getByRole("button", { name: /^Herbarium/ }));

    const back = await screen.findByRole("button", { name: "Back to main menu" });
    await waitFor(() => expect(document.activeElement).toBe(back));
    expect(screen.getByRole("heading", { level: 2, name: "Herbarium & Research" })).toBeTruthy();

    // The first group starts expanded; the second can be toggled.
    const first = screen.getByRole("button", { name: "Herbarium" });
    const second = screen.getByRole("button", { name: "Knowledge" });
    expect(first.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(first.getAttribute("aria-controls") ?? "")).not.toBeNull();
    expect(second.getAttribute("aria-expanded")).toBe("false");
    await user.click(second);
    expect(second.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: /^Research/ })).toBeTruthy();

    await user.click(back);
    const herbarium = await screen.findByRole("button", { name: /^Herbarium/ });
    await waitFor(() => expect(document.activeElement).toBe(herbarium));
  });

  it("closes when the route changes", async () => {
    const user = userEvent.setup();
    const { rerender } = renderNav("/");
    await user.click(menuButton());
    rerender(
      <LazyMotion features={domAnimation}>
        <MobileNav pathname="/design-system" />
      </LazyMotion>,
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.documentElement.style.overflow).toBe("");
  });
});
