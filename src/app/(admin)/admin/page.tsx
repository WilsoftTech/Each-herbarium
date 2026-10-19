import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/services/admin-auth";

// No title: page metadata is emitted even when access is denied, and must
// not reveal that an admin area exists.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="flex flex-1 py-24">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Administration</h1>
      </Container>
    </main>
  );
}
