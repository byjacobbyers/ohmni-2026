import { defineQuery } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { sectionsQuery } from '../components/sections-query'

export const pagesQuery = defineQuery(`*[_type == "page" && defined(slug.current)] {
  _id,
  title,
  "slug": slug.current,
  "language": coalesce(language, "en")
}`)

export const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug && coalesce(language, "en") == $lang][0] {
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  "language": coalesce(language, "en"),
  // every language this slug exists in, for hreflang and the toggle
  "alternates": *[_type == "page" && slug.current == ^.slug.current && !(_id in path("drafts.**"))].language,
  backgroundColor,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  jsonLd,
  ${sectionsQuery}
}`)
