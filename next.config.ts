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
      // Markdown twins of every page: append .md to a URL. Home is /index.md.
      // The proxy skips dotted paths, so these never enter experiments.
      { source: "/index.md", destination: "/md/en/page/home" },
      // Decks read as text; deliberately absent from llms.txt, and /present is robots-disallowed.
      { source: "/present/:slug.md", destination: "/md/en/presentation/:slug" },
      { source: "/es/index.md", destination: "/md/es/page/home" },
      { source: "/posts/:slug.md", destination: "/md/en/post/:slug" },
      { source: "/es/posts/:slug.md", destination: "/md/es/post/:slug" },
      { source: "/es/:slug.md", destination: "/md/es/page/:slug" },
      { source: "/:slug.md", destination: "/md/en/page/:slug" },
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
