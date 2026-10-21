import "server-only";
import {
  parseAuthEnv,
  parseFunctionEnv,
  parseDatabaseEnv,
  parseEmailEnv,
  parseServerEnv,
  parseStorageEnv,
  type AuthEnv,
  type DatabaseEnv,
  type EmailEnv,
  type StorageEnv,
} from "@/validation/env";

/** Validated server environment. Importing this from a Client Component fails the build. */
export const env = parseServerEnv(process.env);

function once<T>(read: () => T): () => T {
  let value: T | undefined;
  return () => (value ??= read());
}

/** Database connection settings, validated on first use. */
export const getDatabaseEnv: () => DatabaseEnv = once(() => parseDatabaseEnv(process.env));

/** Better Auth settings, validated on first use. */
export const getAuthEnv: () => AuthEnv = once(() => parseAuthEnv(process.env));

/** Neon S3 credentials, validated on first use. Never exposed to the browser. */
export const getStorageEnv: () => StorageEnv = once(() => parseStorageEnv(process.env));

/** Resend settings, or null when email is not configured. Validated on first use. */
export const getEmailEnv: () => EmailEnv | null = () => parseEmailEnv(process.env);

export const getFunctionEnv = once(() => parseFunctionEnv(process.env));
