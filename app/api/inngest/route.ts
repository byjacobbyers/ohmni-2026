import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { leadSubmitted } from '@/lib/inngest/functions/lead-submitted'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [leadSubmitted],
})
