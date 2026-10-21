import { expect, test } from "@playwright/test";

// The forms are off until an administrator turns them on (site settings);
// the admin suite covers the switched-on flow (admin.spec.ts, "public forms").
// These checks need no sign-in, so they also run with E2E_PUBLIC_ONLY=1.
test.describe("public forms while switched off", () => {
  for (const [path, notice] of [
    ["/contact", "The contact form is not available yet"],
    ["/volunteer", "The volunteer form is not available yet"],
    ["/partnerships", "The partnership enquiry form is not available yet"],
    ["/get-involved", "Online forms are not available yet"],
  ] as const) {
    test(`${path} explains that the form is not available`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByText(notice)).toBeVisible();
      await expect(page.getByRole("form", { name: / form$/ })).toHaveCount(0);
    });
  }
});
