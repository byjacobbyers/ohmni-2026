import { defineQuery } from 'next-sanity'
import { routeQuery } from '../objects/route-query'

/** Default closing CTA for posts (singleton). Falls back handled in the page. */
export const postCtaSettingsQuery = defineQuery(`*[_type == "postCtaSettings" && coalesce(language, "en") == $lang][0] {
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
  }
}`)
