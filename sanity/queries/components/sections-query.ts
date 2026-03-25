import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { routeQuery } from '../objects/route-query'
import { videoQuery } from '../objects/video-query'

/** Inline link (new) or nested `route` object (legacy portable text). */
const linkWithRouteMarkDef = `_type == 'linkWithRoute' => select(
  defined(linkType) => { ${routeQuery} },
  route { ${routeQuery} }
)`

const portableTextWithLinks = `content[] {
  ...,
  markDefs[] {
    ...,
    ${linkWithRouteMarkDef}
  }
}`

export const sectionsQuery = groq`
  sections[] {
    ...,
    _type == 'coverBlock' => {
      ...,
      image { ${imageQuery} },
      imageMobile { ${imageQuery} },
      content[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      cta { ..., route { ${routeQuery} } }
    },
    _type == 'coverVideo' => {
      ...,
      muxUrl {
        asset-> { playbackId }
      },
      muxUrlMobile {
        asset-> { playbackId }
      },
      content[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      cta { ..., route { ${routeQuery} } }
    },
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
      ${portableTextWithLinks}
    },
    _type == 'textBlock' => {
      ...,
      ${portableTextWithLinks}
    },
    _type == 'embedBlock' => { ... },
    _type == 'formBlock' => {
      ...,
      ${portableTextWithLinks}
    },
    _type == 'imageBlock' => {
      ...,
      image { ${imageQuery} },
      imageMobile { ${imageQuery} }
    },
    _type == 'columnBlock' => {
      ...,
      columns[] {
        ...,
        content[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        },
        image { ${imageQuery} },
        cta { ..., route { ${routeQuery} } }
      }
    },
    _type == 'galleryBlock' => {
      ...,
      images[] { ${imageQuery} }
    },
    _type == 'videoBlock' => {
      ...,
      muxUrl { asset-> { playbackId } },
      muxUrlMobile { asset-> { playbackId } }
    },
    _type == 'faqBlock' => {
      ...,
      faqs[] {
        question,
        answer[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        }
      }
    },
    _type == 'splitScrollBlock' => {
      ...,
      title[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      items[] {
        ...,
        image { ${imageQuery} },
        content[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        }
      }
    }
  }
`
