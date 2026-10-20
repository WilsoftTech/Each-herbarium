/**
 * Confirmation shown in an editor's header after the save redirect
 * (`?saved=1` or `?revision=1`, set by the shared save action).
 */
export function savedMessage(query: Record<string, string | string[] | undefined>): string | null {
  if (query.revision) {
    return "Changes saved as pending changes. The website still shows the published version.";
  }
  return query.saved ? "Saved." : null;
}
