import { PostHog } from 'posthog-node'

/**
 * Server-side PostHog capture for API routes and background jobs.
 * No key -> no-op, so the template runs without an account.
 * flushAt 1 / flushInterval 0 send immediately (short-lived serverless runtimes).
 */
export async function captureServerEvent(
  event: string,
  distinctId: string,
  properties: Record<string, unknown> = {}
) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return

  const client = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  })
  client.capture({ distinctId, event, properties })
  await client.shutdown()
}
