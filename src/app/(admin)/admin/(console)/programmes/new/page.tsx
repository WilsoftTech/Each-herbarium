import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { listMediaOptions } from "@/features/media";
import { ProgrammeForm } from "@/features/programmes";
import { requireAdmin } from "@/services/admin-auth";

export const metadata: Metadata = { title: "New programme" };

export default async function NewProgrammesPage() {
  await requireAdmin("content:edit-draft");
  const images = await listMediaOptions("IMAGE");

  return (
    <>
      <AdminPageHeader
        title="New programme"
        description="New items start as drafts and are not visible on the site."
        back={{ label: "Programmes", href: "/admin/programmes" }}
      />
      <div className="max-w-4xl">
        <ProgrammeForm images={images} editable />
      </div>
    </>
  );
}
