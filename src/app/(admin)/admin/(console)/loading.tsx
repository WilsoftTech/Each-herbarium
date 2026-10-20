/** Shown inside the admin shell while a page loads its data. No animation. */
export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <div className="h-9 w-64 rounded-sm bg-muted" />
      <div className="h-40 rounded-sm border border-border bg-card" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
