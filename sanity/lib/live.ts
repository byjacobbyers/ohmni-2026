// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from "./client";

/** Server-side token for draft/published fetches (can be a read token). */
const serverToken = process.env.SANITY_API_READ_TOKEN;
/**
 * Browser token for SanityLive in draft mode only.
 * Prefer a Viewer-role token (`SANITY_VIEWER_TOKEN`); never a write token.
 */
const browserToken =
  process.env.SANITY_VIEWER_TOKEN || process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  ...(serverToken && { serverToken }),
  ...(browserToken && { browserToken }),
});
