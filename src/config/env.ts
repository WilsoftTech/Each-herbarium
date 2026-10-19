import "server-only";
import { parseServerEnv } from "@/validation/env";

/** Validated server environment. Importing this from a Client Component fails the build. */
export const env = parseServerEnv(process.env);
