/**
 * Result of an admin Server Action, rendered by the form that called it.
 * Shared by server and client code, so it holds plain data only.
 */
export type ActionState = {
  ok: boolean;
  /** Summary for the whole form, announced to assistive technology. */
  message?: string;
  /** Messages per field name. */
  fieldErrors?: Record<string, string>;
};

export const idleState: ActionState = { ok: true };
