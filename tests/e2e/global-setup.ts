import { execFileSync } from "node:child_process";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function runFixture(command: "setup" | "teardown"): string {
  return execFileSync(npx, ["tsx", "tests/e2e/fixtures/e2e-data.ts", command], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

/** Creates the e2e staff accounts; workers read them from E2E_USERS. */
export default function globalSetup() {
  process.env.E2E_USERS = runFixture("setup");
  return () => {
    runFixture("teardown");
  };
}
