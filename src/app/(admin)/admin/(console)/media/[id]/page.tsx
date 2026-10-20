import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, AdminPanel, formatAdminDate } from "@/components/admin/admin-ui";
import {
  DeleteMediaForm,
  findMediaUsage,
  getMediaForAdmin,
  mediaSrc,
  MetadataForm,
} from "@/features/media";
import { formatFileSize } from "@/features/resources";
import { requireAdmin } from "@/services/admin-auth";
import { getDb } from "@/services/db";
import { can } from "@/services/permissions";

export const metadata: Metadata = { title: "File details" };

export default async function MediaDetailPage({
  params,
  searchParams,
}: PageProps<"/admin/media/[id]">) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [asset, usage] = await Promise.all([getMediaForAdmin(id), findMediaUsage(getDb(), id)]);
  if (!asset) notFound();
  const src = mediaSrc(asset);
  const deletable = can(session.role, "media:delete") && asset.storage === "NEON" && !usage.length;

  return (
    <>
      <AdminPageHeader
        title={asset.fileName}
        description={
          query.uploaded
            ? "Uploaded and ready to use."
            : `${asset.mimeType} · ${formatFileSize(asset.byteSize)}`
        }
        back={{ label: "Media library", href: "/admin/media" }}
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <MetadataForm asset={asset} editable={can(session.role, "media:edit")} />
        <div className="space-y-6">
          <AdminPanel title="File">
            {asset.kind === "IMAGE" && asset.status === "READY" && asset.width && asset.height ? (
              <Image
                src={src}
                alt={asset.alt}
                width={asset.width}
                height={asset.height}
                sizes="22rem"
                className="h-auto w-full rounded-sm"
              />
            ) : null}
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Status</dt>
              <dd>{asset.status === "READY" ? "Ready" : "Upload not finished"}</dd>
              {asset.width && asset.height ? (
                <>
                  <dt className="text-muted-foreground">Size</dt>
                  <dd>
                    {asset.width} × {asset.height} px
                  </dd>
                </>
              ) : null}
              <dt className="text-muted-foreground">Uploaded</dt>
              <dd>
                {formatAdminDate(asset.createdAt)}
                {asset.uploadedBy ? ` by ${asset.uploadedBy.name}` : ""}
              </dd>
            </dl>
            {asset.status === "READY" ? (
              <a
                href={src}
                className="inline-block rounded-sm text-sm text-primary underline-offset-4 hover:underline"
              >
                Open file
              </a>
            ) : null}
          </AdminPanel>
          <AdminPanel title="Used by">
            {usage.length ? (
              <ul className="space-y-1 text-sm">
                {usage.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="rounded-sm underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Not used by any content.</p>
            )}
          </AdminPanel>
          {deletable ? (
            <AdminPanel
              title="Delete"
              description="Removes the file from storage. This cannot be undone."
            >
              <DeleteMediaForm id={asset.id} />
            </AdminPanel>
          ) : null}
        </div>
      </div>
    </>
  );
}
