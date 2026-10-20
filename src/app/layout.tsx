import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/features/settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Editorial display face for headlines; Geist remains the text face.
// `optional`: a late swap would rewrap the large hero headline and shift the
// page (measured CLS 0.22 with delayed fonts), so a slow first load keeps the
// fallback serif for that view instead.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "optional",
});

/** Site-wide defaults. The description is the CMS tagline (Settings, Branding). */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(env.siteUrl),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: settings.tagline,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
