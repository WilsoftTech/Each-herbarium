"use client";

import {
  createContext,
  startTransition,
  use,
  useActionState,
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** Mirrors ActionState in features/cms (shared components cannot import features). */
export type FormResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

type FormContextValue = { state: FormResult; pending: boolean };

const FormContext = createContext<FormContextValue>({ state: { ok: true }, pending: false });

export function useActionFormState(): FormContextValue {
  return use(FormContext);
}

type ActionFormProps = {
  action: (state: FormResult, form: FormData) => Promise<FormResult>;
  children: ReactNode;
  className?: string;
  /** Accessible name for the form, when the page has several. */
  label?: string;
  /** Clear the fields after a successful submission (public forms). */
  resetOnSuccess?: boolean;
};

/**
 * Form bound to a Server Action, with its result in context for FieldError
 * and SubmitButton. Submissions are dispatched in a transition from onSubmit
 * so React does not reset the fields (an editor keeps their input when
 * validation fails). Without JavaScript the native `action` still works.
 */
export function ActionForm({
  action,
  children,
  className,
  label,
  resetOnSuccess,
}: ActionFormProps) {
  const [state, formAction, pending] = useActionState(action, { ok: true });
  const messageRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Move focus to the result so screen reader and keyboard users hear it.
  useEffect(() => {
    if (state.ok && state.message && resetOnSuccess) formRef.current?.reset();
    if (state.message) messageRef.current?.focus();
  }, [state, resetOnSuccess]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const data = new FormData(event.currentTarget, submitter);
    startTransition(() => formAction(data));
  }

  return (
    <FormContext value={{ state, pending }}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={onSubmit}
        aria-label={label}
        className={className}
      >
        {state.message ? (
          <p
            ref={messageRef}
            tabIndex={-1}
            role={state.ok ? "status" : "alert"}
            className={cn(
              "mb-6 rounded-sm border px-4 py-3 text-sm outline-none",
              state.ok
                ? "border-primary/40 bg-primary/5 text-foreground"
                : "border-destructive/50 bg-destructive/5 text-destructive",
            )}
          >
            {state.message}
          </p>
        ) : null}
        {children}
      </form>
    </FormContext>
  );
}

/** The validation message for one field, linked by `aria-describedby="<name>-error"`. */
export function FieldError({ name }: { name: string }) {
  const { state } = useActionFormState();
  return (
    <p id={`${name}-error`} className="text-sm text-destructive empty:hidden">
      {state.fieldErrors?.[name]}
    </p>
  );
}
