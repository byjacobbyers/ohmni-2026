import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { getTargetsForDocument, type WebhookPayload } from '@/lib/revalidate-targets'

export async function GET() {
  return NextResponse.json({
    message: 'Path revalidation endpoint. Use POST to revalidate.',
    endpoint: '/api/revalidate/path',
  })
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 })
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret)

  if (!isValidSignature) {
    return new Response(JSON.stringify({ message: 'Invalid signature' }), { status: 401 })
  }

  if (!body?._type) {
    return new Response(JSON.stringify({ message: 'Missing _type' }), { status: 400 })
  }

  const targets = getTargetsForDocument(body)
  for (const { path, type } of targets) {
    if (type === 'layout') {
      revalidatePath(path, 'layout')
    } else {
      revalidatePath(path)
    }
  }

  return NextResponse.json({ body, targets })
}
