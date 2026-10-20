import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${port}`;
const publicOnly = process.env.E2E_PUBLIC_ONLY === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: publicOnly ? ["**/admin.spec.ts"] : [],
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  // Creates the e2e staff accounts on the development database and removes
  // e2e content afterwards (tests/e2e/fixtures/e2e-data.ts).
  globalSetup: publicOnly ? undefined : "./tests/e2e/global-setup.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests run against a production build. Run `npm run build` first.
  webServer: {
    stdout: "pipe",
    command: `npm run start -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    // Auth must trust the origin the tests use.
    env: { BETTER_AUTH_URL: baseURL },
  },
});
