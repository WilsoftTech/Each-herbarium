# 0011. Pending revisions keep published content live until approval

- **Status:** Accepted
- **Date:** 2026-10-21
- **Milestone:** M04
- Amends [ADR 0007](0007-cms-editorial-workflow.md): edits to published content no longer go live on save.

## Context

ADR 0007 let reviewers and administrators edit published content in place, so a save changed the live page at once, and editors could not touch published content at all. The M04 brief requires the opposite: anyone with content access may propose changes to a published item, the website keeps showing the approved version, and only a reviewer's approval makes the changes live. Approval must re-validate the changes, and concurrent edits must not overwrite each other.

Options considered: a full version history table per content type (one shadow table per model); a generic `content_revisions` table holding the editor's validated input; duplicating rows with a `draftOf` pointer. Per-type shadow tables would duplicate seven schemas and their relations. Draft rows would collide with unique slugs and leak into every public query.

## Decision

**One generic table, at most one pending revision per item.** `content_revisions` (`collection`, `entity_id` unique together) stores the editor's validated input as JSON (`data`), its own `status` (`DRAFT` or `IN_REVIEW`, enforced by a CHECK), its own optimistic-lock `version`, and `base_version`, the live row's version when the revision began. Public queries never read this table.

**Saving.** `applySave` (`features/cms/content-workflow.ts`) checks the live row's status:

- Draft or in review: the row is updated as before (it is not on the website).
- Published: the input becomes the item's revision. Before storing it, the change is applied inside a transaction that is always rolled back (`withRollback`, `services/db.ts`) and the publishing rules are checked, so the editor learns at once if the changes could not be published. The live row is not modified and no cache tag expires.

Editors may now save published items (as revisions). Revisions waiting for review are editable only by roles with `content:edit-in-review` (renamed from `content:edit-live`).

**Transitions** (`revisionTransitions` in `features/cms/workflow.ts`): `submitRevision` (any role), `approveRevision` and `returnRevision` (reviewers, administrators), `discardRevision` (any role for draft changes; reviewers and administrators once submitted). Approval runs in one transaction: re-validate the stored data with the feature's input schema (`SaveOperations.revive`), check the live row still has `base_version`, apply it through the feature's own `update` (same reference checks and relation handling as a direct save), re-run `checkPublishable`, delete the revision, write the audit event, then expire the collection's cache tags. `publishedAt` keeps the first publication date.

**Unpublish and archive are blocked** while a revision is pending, so a revision never outlives the published version it changes. The panel explains why.

**Preview and editor.** The editor form and `/admin/preview/<type>/<id>` show the item with the revision applied, read through the same queries and mappers as the public pages inside a rolled-back transaction (`readWithRevision`). Nothing is committed, so other sessions and the public cache never see it. Each feature exposes `get<Type>Editor` and preview loaders built on `loadForEditing` and `loadPreview`.

**Media references** held only in revisions are found by the media library's usage check (a JSON text search on `content_revisions.data`), so an image chosen in pending changes cannot be deleted.

**Audit.** `<collection>.revise`, `.revision-submit`, `.revision-approve`, `.revision-return`, `.revision-discard`.

## Consequences

- One pending revision per item. A second editor must continue the existing revision (optimistic locking reports conflicts).
- Rolled-back previews briefly lock the live row inside a short transaction; PostgreSQL readers are not blocked (MVCC). Acceptable at EACH's editing volume.
- The JSON in `data` has no foreign keys. Approval re-checks every reference and fails readably if, for example, a chosen partner was deleted.
- A slug change in a revision takes effect at approval; uniqueness is checked then.
- Revision history is not kept after approval; the audit log records who proposed, submitted and approved each change.
