import { fetchLlmsIndex, markdownResponse } from '@/lib/llms-server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return markdownResponse(await fetchLlmsIndex(), request, { surface: 'llms.txt' })
}
