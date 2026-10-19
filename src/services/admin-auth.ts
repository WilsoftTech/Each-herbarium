import "server-only";
import { notFound } from "next/navigation";

export type AdminSession = {
  userId: string;
};

/**
 * Authorises access to admin routes and actions. Call it in every admin page,
 * Server Action and Route Handler before reading or changing data. Layouts
 * are not enough.
 *
 * No identity provider is configured until M04, so every request is denied.
 * Responding with 404 avoids revealing that the admin area exists.
 */
export async function requireAdmin(): Promise<AdminSession> {
  notFound();
}
