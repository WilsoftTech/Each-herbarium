import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, Pagination } from "./admin-ui";
import { ContentTable, type ContentTableRow } from "./content-table";
import { controlClass } from "./form-fields";

type CollectionListProps = {
  title: string;
  description: ReactNode;
  basePath: string;
  /** "New project" link target; omitted when the role cannot create. */
  newHref?: string;
  newLabel?: string;
  rows: readonly ContentTableRow[];
  detailLabel?: string;
  /** Status filter (from the CMS feature). */
  filter: ReactNode;
  query?: string;
  status?: string;
  page: number;
  pageCount: number;
  pageHref: (page: number) => string;
};

/** Body of every content list page: header, search, status filter, table, pagination. */
export function CollectionList({
  title,
  description,
  basePath,
  newHref,
  newLabel = "New",
  rows,
  detailLabel,
  filter,
  query,
  status,
  page,
  pageCount,
  pageHref,
}: CollectionListProps) {
  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          newHref ? (
            <Button asChild size="sm">
              <Link href={newHref}>{newLabel}</Link>
            </Button>
          ) : null
        }
      />
      <form role="search" method="get" action={basePath} className="mb-4 flex max-w-md gap-2">
        <label htmlFor="q" className="sr-only">
          Search by title or slug
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by title or slug"
          maxLength={100}
          className={controlClass}
        />
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <Button type="submit" variant="outline" size="sm" className="h-auto">
          Search
        </Button>
      </form>
      {filter}
      <ContentTable rows={rows} basePath={basePath} caption={title} detailLabel={detailLabel} />
      <Pagination page={page} pageCount={pageCount} href={pageHref} />
    </>
  );
}
