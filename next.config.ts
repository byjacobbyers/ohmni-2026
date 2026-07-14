import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // First-party reverse proxy for PostHog so capture survives ad blockers.
  async rewrites() {
    return [
      {
        source: "/relay-oh/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/relay-oh/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/relay-oh/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog API paths use trailing slashes; Next would otherwise redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
