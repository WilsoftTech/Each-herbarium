"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useActionFormState } from "./action-form";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  /** Shown while the action runs. */
  pendingLabel?: string;
};

/** Submit button for an ActionForm: disabled while its action runs. */
export function SubmitButton({ children, pendingLabel, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useActionFormState();
  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
