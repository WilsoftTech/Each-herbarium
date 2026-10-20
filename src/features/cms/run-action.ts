import "server-only";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { AuthorizationError } from "@/services/admin-auth";
import type { ActionState } from "./action-state";

/** A failure the user can act on; its message is shown as is. */
export class ActionError extends Error {
  constructor(
    message: string,
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ActionError";
  }
}

/** Another editor saved the record after this form was opened. */
export class ConflictError extends ActionError {
  constructor() {
    super("Someone else changed this item while you were editing. Reload the page and try again.");
    this.name = "ConflictError";
  }
}

/** Field errors from a failed Zod parse, keyed by the first path segment. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Parses input or throws an ActionError carrying the field errors. */
export function parseInput<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ActionError("Check the highlighted fields.", fieldErrorsOf(result.error));
  }
  return result.data;
}

/**
 * Runs an admin action body and converts expected failures into an
 * ActionState. Unexpected errors are logged on the server and reported with a
 * generic message, so internals never reach the browser. Next.js control
 * flow (redirect, notFound) is rethrown untouched.
 */
export async function runAction(body: () => Promise<ActionState | void>): Promise<ActionState> {
  try {
    return (await body()) ?? { ok: true };
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof ActionError) {
      return { ok: false, message: error.message, fieldErrors: error.fieldErrors };
    }
    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Prisma's pg driver adapter reports the PostgreSQL index in cause;
        // older engines instead supplied meta.target.
        const adapter = z
          .object({
            cause: z.object({
              constraint: z.object({
                index: z.string().optional(),
                fields: z.array(z.string()).optional(),
              }),
            }),
          })
          .safeParse(error.meta?.driverAdapterError);
        const target = String(
          error.meta?.target ??
            (adapter.success
              ? (adapter.data.cause.constraint.index ??
                adapter.data.cause.constraint.fields?.join(","))
              : ""),
        );
        if (target.includes("slug")) {
          return {
            ok: false,
            message: "Check the highlighted fields.",
            fieldErrors: { slug: "This slug is already used." },
          };
        }
        // Two people started a revision of the same item at once.
        if (target.includes("collection") || target.includes("entity_id")) {
          return { ok: false, message: new ConflictError().message };
        }
        return { ok: false, message: "That value is already in use." };
      }
      if (error.code === "P2003" || error.code === "P2014") {
        return { ok: false, message: "This item is still used by other content." };
      }
      if (error.code === "P2025") {
        return { ok: false, message: "This item no longer exists." };
      }
    }

    console.error("[admin action]", error);
    return { ok: false, message: "Something went wrong. Nothing was saved. Try again." };
  }
}
