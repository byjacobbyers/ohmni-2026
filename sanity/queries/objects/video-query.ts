import { groq } from 'next-sanity'

/** Projection fragment only — not a standalone query. */
// @sanity-typegen-ignore
export const muxAssetProjection = groq`
  _id,
  _type,
  _ref,
  playbackId,
  status,
  data {
    duration,
    aspect_ratio
  }
`

/** Projection fragment only — not a standalone query. */
// @sanity-typegen-ignore
export const videoQuery = groq`
  asset-> {
    ${muxAssetProjection}
  }
`
