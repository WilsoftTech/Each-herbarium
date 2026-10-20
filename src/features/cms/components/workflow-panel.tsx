import Link from "next/link";
import { ActionForm, type FormResult } from "@/components/admin/action-form";
import { AdminPanel, formatAdminDate, StatusBadge } from "@/components/admin/admin-ui";
import { CheckboxField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import type { Role } from "@/services/permissions";
import {
  availableTransitions,
  canDelete,
  canEdit,
  transitions,
  type ContentStatus,
} from "../workflow";

type Action = (state: FormResult, form: FormData) => Promise<FormResult>;

type WorkflowPanelProps = {
  role: Role;
  item: {
    id: string;
    status: ContentStatus;
    version: number;
    publishedAt: Date | null;
    updatedAt: Date;
  };
  transition: Action;
  remove?: Action;
  /** Admin preview of the unpublished version, if the type has a page. */
  previewHref?: string;
  /** Public URL, shown while published. */
  publicHref?: string;
};

const guidance: Record<ContentStatus, string> = {
  DRAFT: "Not visible on the website. Submit it for review when it is ready.",
  IN_REVIEW: "Waiting for a reviewer. Not visible on the website.",
  PUBLISHED: "Live on the website. Changes you save appear immediately.",
  ARCHIVED: "Removed from the website and kept for reference. Restore it to edit.",
};

/**
 * Status, workflow buttons and deletion for one item. Buttons appear only for
 * transitions the role may perform; the actions check again on the server.
 */
export function WorkflowPanel({
  role,
  item,
  transition,
  remove,
  previewHref,
  publicHref,
}: WorkflowPanelProps) {
  const names = availableTransitions(role, item.status);
  const editable = canEdit(role, item.status);

  return (
    <AdminPanel title="Publishing">
      <div className="flex items-center gap-3">
        <StatusBadge status={item.status} />
        <span className="text-xs text-muted-foreground">Version {item.version}</span>
      </div>
      <p className="text-sm text-muted-foreground">{guidance[item.status]}</p>
      {!editable ? (
        <p className="text-sm">
          {item.status === "ARCHIVED"
            ? "Archived items cannot be edited."
            : "Your role cannot edit this item in its current state."}
        </p>
      ) : null}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Last changed</dt>
        <dd>{formatAdminDate(item.updatedAt)}</dd>
        {item.publishedAt ? (
          <>
            <dt className="text-muted-foreground">Published</dt>
            <dd>{formatAdminDate(item.publishedAt)}</dd>
          </>
        ) : null}
      </dl>
      <div className="flex flex-wrap gap-3 text-sm">
        {previewHref ? (
          <Link
            href={previewHref}
            className="rounded-sm text-primary underline-offset-4 hover:underline"
          >
            Preview
          </Link>
        ) : null}
        {publicHref && item.status === "PUBLISHED" ? (
          <Link
            href={publicHref}
            className="rounded-sm text-primary underline-offset-4 hover:underline"
          >
            View on site
          </Link>
        ) : null}
      </div>

      {names.length ? (
        <ActionForm action={transition} label="Change status">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="version" value={item.version} />
          <div className="flex flex-wrap gap-3">
            {names.map((name) => (
              <SubmitButton
                key={name}
                name="transition"
                value={name}
                size="sm"
                variant={name === "approve" || name === "submit" ? "primary" : "outline"}
              >
                {transitions[name].label}
              </SubmitButton>
            ))}
          </div>
        </ActionForm>
      ) : null}

      {remove && canDelete(role, item.status) ? (
        <details className="rounded-sm border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium">Delete permanently</summary>
          <ActionForm action={remove} label="Delete" className="mt-4 space-y-4">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="version" value={item.version} />
            <CheckboxField name="confirm" label="I understand this cannot be undone" required />
            <SubmitButton variant="destructive" size="sm" pendingLabel="Deleting…">
              Delete
            </SubmitButton>
          </ActionForm>
        </details>
      ) : null}
    </AdminPanel>
  );
}
