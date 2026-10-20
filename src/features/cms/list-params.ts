import { z } from "zod";
import { contentStatuses, type ContentStatus } from "./workflow";

/** Rows per admin list page. Queries never return more. */
export const PAGE_SIZE = 25;

const listParamsSchema = z.object({
  status: z.enum(contentStatuses).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  q: z.string().trim().max(100).optional().catch(undefined),
});

export type ListParams = { status?: ContentStatus; page: number; q?: string };

/** Validates admin list search params; invalid values fall back to defaults. */
export function parseListParams(
  searchParams: Record<string, string | string[] | undefined>,
): ListParams {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const parsed = listParamsSchema.parse({
    status: first(searchParams.status),
    page: first(searchParams.page) ?? 1,
    q: first(searchParams.q) || undefined,
  });
  return { status: parsed.status, page: parsed.page, q: parsed.q };
}

export function pageWindow(page: number): { skip: number; take: number } {
  return { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE };
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/** Builds a list URL that keeps the current filter. */
export function listHref(basePath: string, params: ListParams, page: number): string {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.q) search.set("q", params.q);
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
