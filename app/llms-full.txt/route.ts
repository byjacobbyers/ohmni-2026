import { fetchLlmsFull, markdownResponse } from '@/lib/llms-server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return markdownResponse(await fetchLlmsFull(), request, { surface: 'llms-full.txt' })
}
