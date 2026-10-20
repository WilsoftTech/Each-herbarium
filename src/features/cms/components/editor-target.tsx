/**
 * Hidden fields every editor form posts: which item, the version the form was
 * opened at (optimistic locking) and, for published items with pending
 * changes, which revision. Renders nothing for a new item.
 */
export function EditorTarget({
  item,
  revisionId,
}: {
  item?: { id: string; version: number };
  revisionId?: string | null;
}) {
  if (!item) return null;
  return (
    <>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="version" value={item.version} />
      {revisionId ? <input type="hidden" name="revision" value={revisionId} /> : null}
    </>
  );
}
