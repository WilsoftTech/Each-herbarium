/**
 * Non-destructive backfill of designed section content (ADR 0013).
 *
 * When a release adds sections, existing rows (and pending revisions) lack
 * them. `fillMissing` adds every key that `defaults` has and `current` does
 * not, recursing into objects. It never replaces a value that exists, so
 * editorial changes are kept; arrays and text are taken as they are.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function fillMissing(current: unknown, defaults: unknown): unknown {
  // Absent or null content (rows and revisions saved before the sections existed).
  if (current === undefined || current === null) return defaults;
  if (!isPlainObject(current) || !isPlainObject(defaults)) return current;
  const result: Record<string, unknown> = { ...current };
  for (const [key, value] of Object.entries(defaults)) {
    result[key] = Object.hasOwn(current, key) ? fillMissing(current[key], value) : value;
  }
  return result;
}
