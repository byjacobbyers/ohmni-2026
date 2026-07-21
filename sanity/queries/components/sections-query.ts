import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { routeQuery } from '../objects/route-query'
import { muxAssetProjection, videoQuery } from '../objects/video-query'
import { formDocumentProjection } from '../documents/form-query'

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

/** Shared page-builder sections projection — fragment for page/post/event queries. */
// @sanity-typegen-ignore
export const sectionsQuery = groq`
  sections[] {
    ...,
    _type == 'coverBlock' => {
      ...,
      image { ${imageQuery} },
      imageMobile { ${imageQuery} },
      muxUrl {
        _type,
        asset-> {
          ${muxAssetProjection}
        },
        thumbTime
      },
      muxUrlMobile {
        _type,
        asset-> {
          ${muxAssetProjection}
        },
        thumbTime
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
    _type == 'embedBlock' => {
      ...,
      embedCode {
        _type,
        code,
        language,
        filename
      }
    },
    _type == 'formBlock' => {
      ...,
      ${portableTextWithLinks},
      form-> ${formDocumentProjection}
    },
    _type == 'imageBlock' => {
      ...,
      image { ${imageQuery} },
      imageMobile { ${imageQuery} },
      muxUrl { asset-> { playbackId } },
      muxUrlMobile { asset-> { playbackId } }
    },

    _type == 'columnBlock' => {
      ...,
      intro[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      content[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      excerpt[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
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
    _type == 'postsBlock' => {
      ...
    },
    _type == 'eventsBlock' => {
      ...
    },
    _type == 'teamMemberBlock' => {
      ...,
      member-> {
        _id,
        title,
        "slug": slug.current,
        primaryJobTitle,
        secondaryJobTitle,
        email,
        phone,
        socials,
        image { ${imageQuery} },
        content[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        }
      }
    },
    _type == 'logoBarBlock' => {
      ...,
      logos[] {
        ...,
        logo { ${imageQuery} }
      }
    },
    _type == 'quoteBlock' => {
      ...,
      image { ${imageQuery} },
      quote[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      cta { ..., route { ${routeQuery} } }
    },
    _type == 'statsBlock' => {
      ...,
      heading[] {
        ...,
        markDefs[] {
          ...,
          ${linkWithRouteMarkDef}
        }
      },
      image { ${imageQuery} },
      stats[] {
        ...,
        content[] {
          ...,
          markDefs[] {
            ...,
            ${linkWithRouteMarkDef}
          }
        }
      }
    },
    _type == 'galleryBlock' => {
      ...,
      images[] { ${imageQuery} }
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
