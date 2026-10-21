import type { NextConfig } from "next";

// Baseline security headers. A Content Security Policy is added in M06.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Media uploads: 4 MB files (MAX_UPLOAD_BYTES) plus multipart overhead,
      // within Vercel's 4.5 MB request limit.
      bodySizeLimit: "4.5mb",
    },
  },
  images: {
    qualities: [70, 75],
    // Only optimise files that are meant to be images, never with a query string.
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/brand/**", search: "" },
      { pathname: "/media/**", search: "" },
      // Statically imported images (the logo).
      { pathname: "/_next/static/media/**", search: "" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
