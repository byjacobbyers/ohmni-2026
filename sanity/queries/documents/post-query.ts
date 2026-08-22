import { defineQuery } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { routeQuery } from '../objects/route-query'
import { teamPersonProjection } from './team-query'

/** Article body: portable text with resolvable links and inline images. */
const postBodyQuery = `body[] {
  ...,
  _type == 'defaultImage' => { ${imageQuery} },
  markDefs[] {
    ...,
    _type == 'linkWithRoute' => select(
      defined(linkType) => { ${routeQuery} },
      route { ${routeQuery} }
    )
  }
}`

export const postsQuery = defineQuery(`*[_type == "post" && coalesce(language, "en") == $lang] | order(publishedAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  "language": coalesce(language, "en"),
  publishedAt,
  author-> ${teamPersonProjection},
  "category": category->title,
  excerpt,
  image { ${imageQuery} }
}`)

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug && coalesce(language, "en") == $lang][0] {
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  "language": coalesce(language, "en"),
  "alternates": *[_type == "post" && slug.current == ^.slug.current && !(_id in path("drafts.**"))].language,
  image { ${imageQuery} },
  publishedAt,
  author-> ${teamPersonProjection},
  "category": category->title,
  excerpt,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  jsonLd,
  cta {
    ...,
    content[] {
      ...,
      markDefs[] {
        ...,
        _type == 'linkWithRoute' => select(
          defined(linkType) => { ${routeQuery} },
          route { ${routeQuery} }
        )
      }
    },
    cta { ..., route { ${routeQuery} } }
  },
  ${postBodyQuery}
}`)
