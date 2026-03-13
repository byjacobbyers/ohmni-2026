import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { routeQuery } from '../objects/route-query'
import { videoQuery } from '../objects/video-query'

const portableTextWithLinks = `content[] {
  ...,
  markDefs[] {
    ...,
    _type == 'linkWithRoute' => { route { ${routeQuery} } }
  }
}`

export const sectionsQuery = groq`
  sections[] {
    ...,
    _type == 'heroBlock' => {
      ...,
      image { ${imageQuery} },
      video { ${videoQuery} },
      cta { ..., route { ${routeQuery} } },
      ${portableTextWithLinks}
    },
    _type == 'ctaBlock' => {
      ...,
      cta { ..., route { ${routeQuery} } },
      image { ${imageQuery} }
    },
    _type == 'textBlock' => {
      ...,
      ${portableTextWithLinks}
    },
    _type == 'embedBlock' => { ... },
    _type == 'imageBlock' => {
      ...,
      image { ${imageQuery} }
    },
    _type == 'faqBlock' => {
      ...,
      faqs[] {
        question,
        answer[] {
          ...,
          markDefs[] {
            ...,
            _type == 'linkWithRoute' => { route { ${routeQuery} } }
          }
        }
      }
    }
  }
`
