import type { Metadata } from "next";

// Every admin page depends on the signed-in session, so it renders per
// request and is never part of a prerendered shell.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s | EACH admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
