import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AdminPageHeader,
  EmptyState,
  formatAdminDate,
  Pagination,
  Tag,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { listMediaForAdmin, mediaSrc, parseMediaListParams } from "@/features/media";
import { formatFileSize } from "@/features/resources";
import { cn } from "@/lib/utils";
import { requireAdmin } from "@/services/admin-auth";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "Media library" };

const filters = [
  { label: "All", kind: undefined },
  { label: "Images", kind: "IMAGE" },
  { label: "Documents", kind: "DOCUMENT" },
] as const;

export default async function MediaLibraryPage({ searchParams }: PageProps<"/admin/media">) {
  const session = await requireAdmin();
  const params = parseMediaListParams(await searchParams);
  const { rows, pageCount } = await listMediaForAdmin(params);
  const href = (page: number, kind = params.kind) => {
    const search = new URLSearchParams();
    if (kind) search.set("kind", kind);
    if (page > 1) search.set("page", String(page));
    const query = search.toString();
    return query ? `/admin/media?${query}` : "/admin/media";
  };

  return (
    <>
      <AdminPageHeader
        title="Media library"
        description="Images and PDFs used by content. Files are stored privately and served through this website."
        actions={
          can(session.role, "media:upload") ? (
            <Button asChild size="sm">
              <Link href="/admin/media/upload">Upload</Link>
            </Button>
          ) : null
        }
      />
      <nav aria-label="Filter by type" className="mb-6">
        <ul className="flex flex-wrap gap-2 text-sm">
          {filters.map((filter) => {
            const current = filter.kind === params.kind;
            return (
              <li key={filter.label}>
                <Link
                  href={href(1, filter.kind)}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "inline-flex rounded-sm border px-3 py-1.5",
                    current
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {filter.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {rows.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((asset) => (
            <li key={asset.id} className="overflow-hidden rounded-sm border border-border bg-card">
              <Link href={`/admin/media/${asset.id}`} className="group block rounded-sm">
                <div className="relative aspect-[4/3] bg-muted">
                  {asset.kind === "IMAGE" && asset.status === "READY" ? (
                    <Image
                      src={mediaSrc(asset)}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                      {asset.kind === "DOCUMENT" ? "PDF document" : "Upload not finished"}
                    </span>
                  )}
                </div>
                <div className="space-y-1 p-4 text-sm">
                  <p className="truncate font-medium group-hover:underline">{asset.fileName}</p>
                  <p className="line-clamp-2 text-muted-foreground">
                    {asset.caption || "No caption"}
                  </p>
                  <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {formatFileSize(asset.byteSize)} · {formatAdminDate(asset.createdAt)}
                    {asset.status === "PENDING" ? <Tag>Pending</Tag> : null}
                    {asset.storage === "STATIC" ? <Tag>Site photograph</Tag> : null}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>No files yet.</EmptyState>
      )}
      <Pagination page={params.page} pageCount={pageCount} href={(page) => href(page)} />
    </>
  );
}
