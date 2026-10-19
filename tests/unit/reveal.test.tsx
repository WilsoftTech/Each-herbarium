// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/motion/reveal";

function renderReveal() {
  render(
    <Reveal>
      <h2 data-reveal>Heading</h2>
      <div data-reveal-media>Image</div>
    </Reveal>,
  );
  return {
    heading: screen.getByRole("heading", { name: "Heading" }),
    media: screen.getByText("Image"),
  };
}

describe("Reveal", () => {
  it("leaves content in its final, visible state under reduced motion", () => {
    globalThis.__reducedMotion = true;
    const { heading, media } = renderReveal();
    expect(heading.style.opacity).toBe("");
    expect(heading.style.transform).toBe("");
    expect(media.style.clipPath).toBe("");
  });

  it("applies entrance start states on the client when motion is allowed", () => {
    globalThis.__reducedMotion = false;
    const { heading } = renderReveal();
    expect(heading.style.opacity).toBe("0");
  });
});
