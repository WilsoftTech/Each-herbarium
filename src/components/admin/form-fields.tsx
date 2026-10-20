import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "./action-form";

/** Shared control styling: visible border, token colours, the global focus ring. */
export const controlClass =
  "w-full rounded-sm border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground disabled:opacity-60";

/** ARIA wiring between a control, its hint and its validation message. */
export function describedBy(name: string, hasHint: boolean): string {
  return hasHint ? `${name}-hint ${name}-error` : `${name}-error`;
}

type FieldShellProps = {
  /** Control name; also its id, and the key for its validation message. */
  name: string;
  label: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

/** Label, hint, control and validation message, wired together for assistive technology. */
export function Field({ name, label, hint, required, className, children }: FieldShellProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-muted-foreground">
            {" "}
            <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={`${name}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
      <FieldError name={name} />
    </div>
  );
}

type TextFieldProps = {
  name: string;
  label: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  defaultValue?: string | number | null;
  type?: "text" | "email" | "url" | "number" | "date" | "password";
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
  /** Render a textarea with this many rows. */
  rows?: number;
};

/** A labelled text input, or a textarea when `rows` is set. */
export function TextField({
  name,
  label,
  hint,
  required,
  className,
  defaultValue,
  type = "text",
  autoComplete,
  maxLength,
  placeholder,
  rows,
}: TextFieldProps) {
  const shared = {
    id: name,
    name,
    required,
    maxLength,
    placeholder,
    defaultValue: defaultValue ?? undefined,
    "aria-describedby": describedBy(name, Boolean(hint)),
  };

  return (
    <Field name={name} label={label} hint={hint} required={required} className={className}>
      {rows ? (
        <textarea {...shared} rows={rows} className={cn(controlClass, "leading-6")} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} className={controlClass} />
      )}
    </Field>
  );
}

type SelectFieldProps = {
  name: string;
  label: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  defaultValue?: string | null;
  options: readonly { value: string; label: string }[];
};

export function SelectField({
  name,
  label,
  hint,
  required,
  className,
  defaultValue,
  options,
}: SelectFieldProps) {
  return (
    <Field name={name} label={label} hint={hint} required={required} className={className}>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? undefined}
        aria-describedby={describedBy(name, Boolean(hint))}
        className={controlClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

type CheckboxFieldProps = {
  name: string;
  label: string;
  hint?: ReactNode;
  defaultChecked?: boolean;
  required?: boolean;
};

export function CheckboxField({ name, label, hint, defaultChecked, required }: CheckboxFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={name}
          name={name}
          defaultChecked={defaultChecked}
          required={required}
          aria-describedby={describedBy(name, Boolean(hint))}
          className="mt-0.5 size-4 shrink-0 accent-(--primary)"
        />
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      </div>
      {hint ? (
        <p id={`${name}-hint`} className="pl-7 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <div className="pl-7">
        <FieldError name={name} />
      </div>
    </div>
  );
}

type CheckboxGroupProps = {
  name: string;
  legend: string;
  hint?: ReactNode;
  options: readonly { value: string; label: string; description?: string }[];
  defaultValues: readonly string[];
};

/** A set of checkboxes posting several values under one name. */
export function CheckboxGroup({ name, legend, hint, options, defaultValues }: CheckboxGroupProps) {
  return (
    <fieldset className="space-y-3" aria-describedby={describedBy(name, Boolean(hint))}>
      <legend className="text-sm font-medium">{legend}</legend>
      {hint ? (
        <p id={`${name}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {options.length ? (
        <ul className="space-y-2">
          {options.map((option) => {
            const id = `${name}-${option.value}`;
            return (
              <li key={option.value} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={id}
                  name={name}
                  value={option.value}
                  defaultChecked={defaultValues.includes(option.value)}
                  className="mt-0.5 size-4 shrink-0 accent-(--primary)"
                />
                <label htmlFor={id} className="text-sm">
                  {option.label}
                  {option.description ? (
                    <span className="block text-muted-foreground">{option.description}</span>
                  ) : null}
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing to choose from yet.</p>
      )}
      <FieldError name={name} />
    </fieldset>
  );
}
