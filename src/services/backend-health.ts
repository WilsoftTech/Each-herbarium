import "server-only";
import { z } from "zod";
import { getFunctionEnv } from "@/config/env";

/** Liveness of the deployed Neon runtime; does not imply database health. */
export async function backendIsAlive(): Promise<boolean> {
  const response = await fetch(getFunctionEnv().url, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return false;
  return z
    .object({ service: z.literal("each-backend"), ok: z.literal(true) })
    .safeParse(await response.json()).success;
}
