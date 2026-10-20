import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/features/auth";
import { getAdminSession } from "@/services/admin-auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage() {
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center bg-muted px-5 py-16">
      <div className="w-full max-w-sm rounded-sm border border-border bg-card p-8">
        <p className="font-display text-lg font-semibold">EACH administration</p>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          For EACH staff. Accounts are created by an administrator.
        </p>
        <div className="mt-8">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
