import { groq } from 'next-sanity'

/** Projection fragment only — not a standalone query. */
// @sanity-typegen-ignore
export const imageQuery = groq`
  alt,
  crop { ... },
  hotspot { x, y },
  asset-> {
    _id,
    url,
    metadata {
      dimensions { aspectRatio, height, width },
      lqip
    }
  }
`
