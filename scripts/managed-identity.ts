import { execFileSync } from "node:child_process";
import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthVanillaAdapter } from "@neondatabase/auth/vanilla/adapters";
import { managedScriptEnv } from "./script-env";

/** CLI-only identity bootstrap. Normal user management uses an admin session. */
export async function registerManagedIdentity(input: {
  email: string;
  name: string;
  password: string;
}) {
  const { baseUrl, siteUrl: origin } = managedScriptEnv();
  const client = createAuthClient(baseUrl, {
    adapter: BetterAuthVanillaAdapter({ fetchOptions: { headers: { Origin: origin } } }),
  });
  const result = await client.signUp.email({ ...input, callbackURL: `${origin}/admin` });
  if (result.error || !result.data?.user) {
    throw new Error(result.error?.message ?? "Managed identity creation failed.");
  }
  return result.data.user;
}

export function promoteManagedAdmin(id: string): void {
  setManagedIdentityRole(id, "admin");
}

export function setManagedIdentityRole(id: string, role: "admin" | "user"): void {
  // This ID is the only variable passed through Windows' npm launcher.
  if (!/^[a-zA-Z0-9-]+$/.test(id)) throw new Error("Unexpected managed identity ID.");
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "--yes",
      "neon@latest",
      "neon-auth",
      "user",
      "set-role",
      id,
      "--roles",
      role,
      "--branch",
      managedScriptEnv().branch,
    ],
    { shell: process.platform === "win32", stdio: "pipe" },
  );
}
