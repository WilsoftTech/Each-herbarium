import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // `server-only` throws outside the react-server condition. Unit tests
      // render Server Components directly, so use its empty server build.
      "server-only": fileURLToPath(new URL("node_modules/server-only/empty.js", import.meta.url)),
    },
  },
  test: {
    // Node by default; interactive component tests opt into jsdom per file.
    environment: "node",
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integration/**/*.test.ts"],
    setupFiles: ["tests/unit/setup.ts"],
    // Rebuilds the test database schema once per run.
    globalSetup: ["tests/global-setup.ts"],
    // Files share one test database, so they run one at a time.
    fileParallelism: false,
    // Each query is a round trip to the development database.
    testTimeout: 60_000,
    hookTimeout: 180_000,
  },
});
