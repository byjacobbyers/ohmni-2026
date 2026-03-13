import { groq } from 'next-sanity'

export const videoQuery = groq`
  asset-> {
    _id,
    playbackId,
    status,
    data { duration, aspect_ratio }
  }
`
