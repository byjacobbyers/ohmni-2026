import { defineQuery } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { routeQuery } from '../objects/route-query'
import { teamPersonProjection } from './team-query'

export const SiteQuery = defineQuery(`*[_type == "site"][0] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  altTitle,
  tagline,
  foundingYear,
  address,
  addressLocality,
  addressRegion,
  postalCode,
  addressCountry,
  latitude,
  longitude,
  email,
  sameAs,
  postCta {
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
  "founders": *[_type == "team" && founder == true] | order(title asc) ${teamPersonProjection},
  seo {
    ...,
    metaIcon { ${imageQuery} },
    shareGraphic { ${imageQuery} }
  },
  organizationJsonLd {
    name,
    legalName,
    description,
    logo { ${imageQuery} },
    url,
    email,
    telephone,
    priceRange
  }
}`)
